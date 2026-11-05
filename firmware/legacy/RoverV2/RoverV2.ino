/*
  Ballsammler-Rover – ESP32 WiFi-Steuerung
  ------------------------------------------
  Skid-Steering (2x 775-Motor über L298N) + Bürstenwalze (MG996 360°-Servo)
  ESP32 spannt eigenen WLAN-Hotspot auf, Handy verbindet sich direkt,
  Weboberfläche mit virtuellem Joystick steuert den Rover per WebSocket.

  Automatik-Modus (Zickzack-Fahrmuster, boustrophedon-artig)
  - HC-SR04 erkennt Wand vorne
  - Bumper-Schalter als mechanisches Fallback
  - Pivot-Turn auf der Stelle, Bürste darf dabei ruhig die Wand streifen
    (Chassis selbst hält per Sicherheitsabstand Luft zur Wand)

  Web-UI: großer Joystick, Live-Status (Signal, Motor-Speed, Modus),
  Max-Tempo-Slider (regelt die Joystick-Empfindlichkeit live, ohne
  neu flashen zu müssen).

  Benötigte Libraries (Arduino IDE -> Library Manager):
  - ESP Async WebServer (mit Leerzeichen! ESP32Async-Fork)
  - Async TCP            (ESP32Async-Fork, gleiche Organisation)
  - ESP32Servo            (Kevin Harrington / madhephaestus)

  WICHTIG: TURN_90_DURATION_MS und SHIFT_DURATION_MS sind Platzhalter!
  Die müssen am fertigen Chassis empirisch kalibriert werden (Stoppuhr:
  wie lange braucht der Rover bei TURN_SPEED für exakt 90°?). Ohne
  Encoder/Gyro ist das reine Zeitsteuerung, kein exakter Winkel.
*/

#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <ESP32Servo.h>

// ---------- WLAN (eigener Hotspot) ----------
const char* AP_SSID = "Ballsammler-Rover";
const char* AP_PASS = "rover1234"; // mind. 8 Zeichen

// ---------- Motor-Pins (L298N) ----------
#define IN1 26  // links, Richtung A
#define IN2 27  // links, Richtung B
#define IN3 14  // rechts, Richtung A
#define IN4 17  // rechts, Richtung B (bewusst NICHT GPIO12 - Strapping-Pin, verursacht Boot-Loop wenn extern beschaltet)
#define ENA 25  // links, PWM-Speed
#define ENB 33  // rechts, PWM-Speed

// ---------- Bürsten-Servo (Continuous Rotation, MG996 360°) ----------
#define BRUSH_PIN 13

// ---------- Ultraschall HC-SR04 ----------
#define TRIG_PIN 32
#define ECHO_PIN 35  // input-only Pin, passt gut fuer Echo (ist ja Eingang)

// ---------- Bumper (mechanisches Fallback) ----------
#define BUMPER_PIN 4  // INPUT_PULLUP, Schalter zieht bei Kontakt auf GND

// ---------- Sicherheits-Timeout (Manuell-Modus) ----------
const unsigned long FAILSAFE_MS = 400;
unsigned long lastMsgTime = 0;

// ---------- Automatik-Parameter (MUSS kalibriert werden!) ----------
const int SAFE_DISTANCE_CM = 20;         // Trigger-Abstand, > halbe Chassis-Diagonale
const unsigned long TURN_90_DURATION_MS = 700;  // Platzhalter, am Chassis testen
const unsigned long SHIFT_DURATION_MS   = 600;  // Platzhalter = "Bahnbreite"
const int TURN_SPEED  = 180;
const int DRIVE_SPEED = 180;
const int TEST_SPEED  = 255;  // fuer die einzelnen Motor-Test-Buttons (volle Power zur Diagnose)

Servo brushServo;
AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

int currentLeft = 0;
int currentRight = 0;
int maxSpeed = 150;  // per Slider einstellbar (30-255), regelt Joystick-Empfindlichkeit
bool brushOn = false;
bool autoMode = false;

enum AutoState { A_DRIVE, A_TURN1, A_SHIFT, A_TURN2 };
AutoState autoState = A_DRIVE;
unsigned long stateStartTime = 0;
unsigned long lastDistanceSend = 0;
unsigned long lastTelemetrySend = 0;

String autoStateName() {
  if (autoState == A_DRIVE) return "DRIVE";
  if (autoState == A_TURN1) return "TURN1";
  if (autoState == A_SHIFT) return "SHIFT";
  if (autoState == A_TURN2) return "TURN2";
  return "?";
}

// ---------- Webseite (HTML/CSS/JS als ein String, läuft offline im ESP32-Hotspot) ----------
const char htmlPage[] PROGMEM = R"HTML(
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
<title>Ballsammler-Rover</title>
<style>
  :root {
    --bg:#0f1115; --panel:#1a1d24; --panel2:#20242c; --accent:#2dd4a7; --text:#e8e8ec; --text-dim:#8b93a3; --border:#2a2f3a;
  }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--text); font-family:-apple-system,Segoe UI,Roboto,sans-serif; text-align:center; touch-action:none; padding:16px; }
  h2 { margin:8px 0 20px 0; font-weight:600; letter-spacing:0.3px; }
  .card { background:var(--panel); border-radius:16px; padding:16px; margin:0 auto 14px auto; max-width:360px; border:1px solid var(--border); }
  #joyArea { width:320px; height:320px; margin:0 auto; border-radius:50%; background:var(--panel2); position:relative; border:2px solid var(--border); }
  #stick { width:90px; height:90px; border-radius:50%; background:var(--accent); position:absolute; left:115px; top:115px; box-shadow:0 0 20px rgba(45,212,167,0.4); transition:background 0.15s; }
  #stick.active { background:#ffffff; }
  .sliderRow { display:flex; align-items:center; gap:12px; }
  .sliderRow input[type=range] { flex:1; accent-color:var(--accent); }
  .sliderLabel { font-size:13px; color:var(--text-dim); min-width:74px; text-align:left; }
  .sliderVal { font-size:14px; font-weight:600; min-width:36px; text-align:right; }
  .btnRow { display:flex; gap:10px; justify-content:center; margin-bottom:14px; max-width:360px; margin-left:auto; margin-right:auto; }
  .btn { flex:1; padding:16px 0; font-size:16px; font-weight:500; border-radius:12px; background:var(--panel2); color:var(--text); border:1px solid var(--border); }
  .btn.active { background:var(--accent); color:#06231a; border-color:var(--accent); }
  .statusGrid { display:flex; gap:10px; }
  .statBox { flex:1; background:var(--panel2); border-radius:12px; padding:10px 6px; }
  .statLabel { font-size:11px; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.5px; }
  .statVal { font-size:15px; font-weight:600; margin-top:4px; }
  #connStatus { font-size:13px; color:var(--text-dim); margin-top:12px; }
  #connStatus.on { color:var(--accent); }
  #distRow { font-size:14px; color:#6cf; margin-top:10px; }
</style>
</head>
<body>
<h2>Ballsammler-Rover</h2>

<div class="card">
<div id="joyArea"><div id="stick"></div></div>
</div>

<div class="card">
<div class="sliderRow">
<span class="sliderLabel">Max Tempo</span>
<input type="range" id="speedSlider" min="30" max="255" value="150">
<span class="sliderVal" id="speedVal">150</span>
<span class="sliderLabel" style="min-width:auto;">U/min*</span>
</div>
<div style="font-size:11px; color:var(--text-dim); margin-top:6px; text-align:left;">*geschätzt, unbelastet laut Datenblatt - real unter Last niedriger</div>
</div>

<div class="btnRow">
<button id="brushBtn" class="btn">Bürste AN</button>
<button id="autoBtn" class="btn">Automatik AN</button>
</div>

<div class="card">
<div class="statusGrid">
<div class="statBox"><div class="statLabel">Signal</div><div class="statVal" id="statSignal">--</div></div>
<div class="statBox"><div class="statLabel">Motor L/R</div><div class="statVal" id="statMotors">0 / 0</div></div>
<div class="statBox"><div class="statLabel">Modus</div><div class="statVal" id="statMode">MANUAL</div></div>
</div>
<div id="distRow">Distanz: --</div>
</div>

<div class="card">
<div style="font-size:12px; color:var(--text-dim); margin-bottom:10px; text-align:left;">Test-Modus (einzelner Motor, ohne Joystick)</div>
<div class="btnRow">
<button id="testLF" class="btn">Links vor</button>
<button id="testLB" class="btn">Links zurück</button>
</div>
<div class="btnRow">
<button id="testRF" class="btn">Rechts vor</button>
<button id="testRB" class="btn">Rechts zurück</button>
</div>
</div>

<div id="connStatus">Verbinde...</div>

<script>
  let ws = new WebSocket("ws:" + "/" + "/" + location.host + "/ws");
  let connEl = document.getElementById("connStatus");
  ws.onopen = function() { connEl.textContent = "Verbunden"; connEl.className = "on"; };
  ws.onclose = function() { connEl.textContent = "Getrennt"; connEl.className = ""; };
  ws.onmessage = function(evt) {
    let msg = evt.data;
    if (msg.indexOf("d:") === 0) {
      document.getElementById("distRow").textContent = "Distanz: " + msg.substring(2) + " cm";
    } else if (msg.indexOf("t:") === 0) {
      let parts = msg.substring(2).split(":");
      document.getElementById("statMotors").textContent = parts[0] + " / " + parts[1];
      document.getElementById("statSignal").textContent = parts[2] + " dBm";
      document.getElementById("statMode").textContent = parts[3];
    }
  };

  const area = document.getElementById("joyArea");
  const stick = document.getElementById("stick");
  const AREA = 320, STICKSIZE = 90, MARGIN = (AREA - STICKSIZE) / 2, RADIUS = MARGIN;
  let dragging = false;
  let lastX = 0, lastY = 0;

  function setStick(x, y) {
    stick.style.left = (MARGIN + x * RADIUS) + "px";
    stick.style.top  = (MARGIN - y * RADIUS) + "px";
  }

  function sendJoy(x, y) {
    lastX = x; lastY = y;
    ws.send("j:" + x.toFixed(2) + ":" + y.toFixed(2));
  }

  function handleMove(clientX, clientY) {
    const rect = area.getBoundingClientRect();
    let dx = (clientX - rect.left - AREA / 2) / RADIUS;
    let dy = (AREA / 2 - (clientY - rect.top)) / RADIUS;
    const mag = Math.sqrt(dx * dx + dy * dy);
    if (mag > 1) { dx /= mag; dy /= mag; }
    setStick(dx, dy);
    sendJoy(dx, dy);
  }

  area.addEventListener("touchstart", function(e) { dragging = true; stick.classList.add("active"); handleMove(e.touches[0].clientX, e.touches[0].clientY); });
  area.addEventListener("touchmove", function(e) { if (dragging) handleMove(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); }, { passive: false });
  area.addEventListener("touchend", function() { dragging = false; stick.classList.remove("active"); setStick(0, 0); sendJoy(0, 0); });

  area.addEventListener("mousedown", function(e) { dragging = true; stick.classList.add("active"); handleMove(e.clientX, e.clientY); });
  window.addEventListener("mousemove", function(e) { if (dragging) handleMove(e.clientX, e.clientY); });
  window.addEventListener("mouseup", function() { if (dragging) { dragging = false; stick.classList.remove("active"); setStick(0, 0); sendJoy(0, 0); } });

  let testL = 0, testR = 0;
  function setTestL(val) {
    testL = (testL === val) ? 0 : val;
    document.getElementById("testLF").classList.toggle("active", testL === 1);
    document.getElementById("testLB").classList.toggle("active", testL === -1);
    ws.send("x:L:" + testL);
  }
  function setTestR(val) {
    testR = (testR === val) ? 0 : val;
    document.getElementById("testRF").classList.toggle("active", testR === 1);
    document.getElementById("testRB").classList.toggle("active", testR === -1);
    ws.send("x:R:" + testR);
  }
  document.getElementById("testLF").addEventListener("click", function() { setTestL(1); });
  document.getElementById("testLB").addEventListener("click", function() { setTestL(-1); });
  document.getElementById("testRF").addEventListener("click", function() { setTestR(1); });
  document.getElementById("testRB").addEventListener("click", function() { setTestR(-1); });

  setInterval(function() {
    if (dragging) sendJoy(lastX, lastY);
    if (testL !== 0) ws.send("x:L:" + testL);
    if (testR !== 0) ws.send("x:R:" + testR);
  }, 150);

  let brushState = false;
  document.getElementById("brushBtn").addEventListener("click", function() {
    brushState = !brushState;
    const btn = document.getElementById("brushBtn");
    btn.classList.toggle("active", brushState);
    btn.textContent = brushState ? "Bürste AUS" : "Bürste AN";
    ws.send("b:" + (brushState ? "1" : "0"));
  });

  let autoOn = false;
  document.getElementById("autoBtn").addEventListener("click", function() {
    autoOn = !autoOn;
    const btn = document.getElementById("autoBtn");
    btn.classList.toggle("active", autoOn);
    btn.textContent = autoOn ? "Automatik AUS" : "Automatik AN";
    ws.send("m:" + (autoOn ? "1" : "0"));
  });

  const speedSlider = document.getElementById("speedSlider");
  const speedVal = document.getElementById("speedVal");
  function updateSpeedLabel() {
    let rpm = Math.round((speedSlider.value / 255) * 15000);
    speedVal.textContent = "~" + rpm;
  }
  updateSpeedLabel();
  speedSlider.addEventListener("input", function() {
    updateSpeedLabel();
    ws.send("v:" + speedSlider.value);
  });
</script>
</body>
</html>
)HTML";

// ---------- Motor-Hilfsfunktion ----------
void setMotor(int in1, int in2, int enPin, int speed) {
  speed = constrain(speed, -255, 255);
  if (speed >= 0) {
    digitalWrite(in1, HIGH);
    digitalWrite(in2, LOW);
  } else {
    digitalWrite(in1, LOW);
    digitalWrite(in2, HIGH);
  }
  ledcWrite(enPin, abs(speed));
}

void stopMotors() {
  setMotor(IN1, IN2, ENA, 0);
  setMotor(IN3, IN4, ENB, 0);
  currentLeft = 0;
  currentRight = 0;
}

// ---------- Ultraschall-Distanzmessung ----------
long readDistanceCM() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH, 30000); // Timeout 30ms ~ 5m
  if (duration == 0) return 999; // kein Echo = nichts erkannt
  return duration * 0.0343 / 2;
}

// ---------- Automatik-Zustandsmaschine (Zickzack) ----------
void enterState(AutoState s) {
  autoState = s;
  stateStartTime = millis();
  Serial.print("Auto-State: ");
  Serial.println(autoStateName());
}

void runAutoStateMachine() {
  long dist = readDistanceCM();
  bool bumperHit = (digitalRead(BUMPER_PIN) == LOW);

  // Distanz alle 300ms an die Weboberfläche schicken, zum Debuggen
  if (millis() - lastDistanceSend > 300) {
    ws.textAll("d:" + String(dist));
    lastDistanceSend = millis();
  }

  switch (autoState) {
    case A_DRIVE:
      setMotor(IN1, IN2, ENA, DRIVE_SPEED);
      setMotor(IN3, IN4, ENB, DRIVE_SPEED);
      if (dist < SAFE_DISTANCE_CM || bumperHit) {
        stopMotors();
        enterState(A_TURN1);
      }
      break;

    case A_TURN1:
      // Pivot auf der Stelle: links rueckwaerts, rechts vorwaerts
      setMotor(IN1, IN2, ENA, -TURN_SPEED);
      setMotor(IN3, IN4, ENB, TURN_SPEED);
      if (millis() - stateStartTime > TURN_90_DURATION_MS) {
        stopMotors();
        enterState(A_SHIFT);
      }
      break;

    case A_SHIFT:
      setMotor(IN1, IN2, ENA, DRIVE_SPEED);
      setMotor(IN3, IN4, ENB, DRIVE_SPEED);
      if (millis() - stateStartTime > SHIFT_DURATION_MS) {
        stopMotors();
        enterState(A_TURN2);
      }
      break;

    case A_TURN2:
      setMotor(IN1, IN2, ENA, -TURN_SPEED);
      setMotor(IN3, IN4, ENB, TURN_SPEED);
      if (millis() - stateStartTime > TURN_90_DURATION_MS) {
        stopMotors();
        enterState(A_DRIVE);
      }
      break;
  }
}

// ---------- WebSocket-Event ----------
void onWsEvent(AsyncWebSocket *server, AsyncWebSocketClient *client,
               AwsEventType type, void *arg, uint8_t *data, size_t len) {
  if (type == WS_EVT_DATA) {
    String msg = String((char*)data).substring(0, len);
    lastMsgTime = millis();

    if (msg.startsWith("j:") && !autoMode) {
      int c1 = msg.indexOf(':', 2);
      float x = msg.substring(2, c1).toFloat();
      float y = msg.substring(c1 + 1).toFloat();

      int left  = (int)((y + x) * maxSpeed);
      int right = (int)((y - x) * maxSpeed);
      currentLeft  = constrain(left, -maxSpeed, maxSpeed);
      currentRight = constrain(right, -maxSpeed, maxSpeed);

      setMotor(IN1, IN2, ENA, currentLeft);
      setMotor(IN3, IN4, ENB, currentRight);
    }
    else if (msg.startsWith("v:")) {
      maxSpeed = constrain(msg.substring(2).toInt(), 30, 255);
    }
    else if (msg.startsWith("x:L:") && !autoMode) {
      int dir = msg.substring(4).toInt();
      currentLeft = dir * TEST_SPEED;
      setMotor(IN1, IN2, ENA, currentLeft);
    }
    else if (msg.startsWith("x:R:") && !autoMode) {
      int dir = msg.substring(4).toInt();
      currentRight = dir * TEST_SPEED;
      setMotor(IN3, IN4, ENB, currentRight);
    }
    else if (msg.startsWith("b:")) {
      brushOn = msg.substring(2).toInt() == 1;
      brushServo.write(brushOn ? 180 : 90); // 180 = volle Fahrt, 90 = Stopp
    }
    else if (msg.startsWith("m:")) {
      autoMode = msg.substring(2).toInt() == 1;
      stopMotors();
      if (autoMode) {
        enterState(A_DRIVE);
      }
    }
  }
}

void setup() {
  Serial.begin(115200);

  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUMPER_PIN, INPUT_PULLUP);

  ledcAttach(ENA, 5000, 8);
  ledcAttach(ENB, 5000, 8);

  brushServo.attach(BRUSH_PIN);
  brushServo.write(90); // Stopp

  WiFi.softAP(AP_SSID, AP_PASS);
  Serial.print("Rover-WLAN gestartet, IP: ");
  Serial.println(WiFi.softAPIP()); // Standard: 192.168.4.1

  ws.onEvent(onWsEvent);
  server.addHandler(&ws);

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send_P(200, "text/html", htmlPage);
  });

  server.begin();
  lastMsgTime = millis();
  lastTelemetrySend = millis();
}

void loop() {
  ws.cleanupClients();

  if (autoMode) {
    runAutoStateMachine();
  } else {
    // Failsafe: kein Signal -> Motoren stoppen
    if (millis() - lastMsgTime > FAILSAFE_MS) {
      if (currentLeft != 0 || currentRight != 0) {
        stopMotors();
      }
    }
  }

  // Live-Telemetrie: Motor-Speed, WLAN-Signal, aktueller Modus
  if (millis() - lastTelemetrySend > 250) {
    String stateStr = autoMode ? autoStateName() : "MANUAL";
    ws.textAll("t:" + String(currentLeft) + ":" + String(currentRight) + ":" + String(WiFi.RSSI()) + ":" + stateStr);
    lastTelemetrySend = millis();
  }
}
