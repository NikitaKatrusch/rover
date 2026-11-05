/*
  Ballsammler-Rover – ESP32 WiFi-Steuerung
  ------------------------------------------
  Skid-Steering (2x 775-Motor über L298N) + Bürstenwalze (MG996 360°-Servo)
  ESP32 spannt eigenen WLAN-Hotspot auf, Handy verbindet sich direkt,
  Weboberfläche mit virtuellem Joystick steuert den Rover per WebSocket.

  NEU: Automatik-Modus (Zickzack-Fahrmuster, boustrophedon-artig)
  - HC-SR04 erkennt Wand vorne
  - Bumper-Schalter als mechanisches Fallback
  - Pivot-Turn auf der Stelle, Bürste darf dabei ruhig die Wand streifen
    (Chassis selbst hält per Sicherheitsabstand Luft zur Wand)

  Benötigte Libraries (Arduino IDE -> Library Manager):
  - ESPAsyncWebServer (mathieucarbou / ESP32Async Fork empfohlen)
  - AsyncTCP           (Abhängigkeit von ESPAsyncWebServer)
  - ESP32Servo          (Kevin Harrington / madhephaestus)

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

Servo brushServo;
AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

int currentLeft = 0;
int currentRight = 0;
bool brushOn = false;
bool autoMode = false;

enum AutoState { A_DRIVE, A_TURN1, A_SHIFT, A_TURN2 };
AutoState autoState = A_DRIVE;
unsigned long stateStartTime = 0;
unsigned long lastDistanceSend = 0;

// ---------- Webseite (HTML/CSS/JS als ein String, läuft offline im ESP32-Hotspot) ----------
const char htmlPage[] PROGMEM = R"HTML(
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
<style>
  body { margin:0; background:#111; color:#eee; font-family:sans-serif; text-align:center; touch-action:none; }
  h2 { margin:14px; }
  #joyArea { width:280px; height:280px; margin:20px auto; border-radius:50%; background:#222; position:relative; border:2px solid #444; }
  #stick { width:80px; height:80px; border-radius:50%; background:#4caf50; position:absolute; left:100px; top:100px; }
  .btn { padding:16px 28px; font-size:17px; border-radius:10px; border:none; background:#555; color:#eee; margin:8px; }
  .btn.active { background:#4caf50; }
  #status { margin-top:14px; font-size:14px; color:#888; }
  #dist { font-size:14px; color:#6cf; margin-top:6px; }
</style>
</head>
<body>
<h2>Ballsammler-Rover</h2>
<div id="joyArea"><div id="stick"></div></div>
<button id="brushBtn" class="btn">Bürste AN</button>
<button id="autoBtn" class="btn">Automatik AN</button>
<div id="status">Verbinde...</div>
<div id="dist">Distanz: --</div>
<script>
  let ws = new WebSocket("ws:" + "/" + "/" + location.host + "/ws");
  let statusEl = document.getElementById("status");
  ws.onopen = () => statusEl.textContent = "Verbunden";
  ws.onclose = () => statusEl.textContent = "Getrennt";
  ws.onmessage = (evt) => {
    if (evt.data.startsWith("d:")) {
      document.getElementById("dist").textContent = "Distanz: " + evt.data.substring(2) + " cm";
    }
  };

  const area = document.getElementById("joyArea");
  const stick = document.getElementById("stick");
  const radius = 100;
  let dragging = false;
  let lastX = 0, lastY = 0;

  function setStick(x, y) {
    stick.style.left = (100 + x * radius) + "px";
    stick.style.top  = (100 - y * radius) + "px";
  }

  function sendJoy(x, y) {
    lastX = x; lastY = y;
    ws.send("j:" + x.toFixed(2) + ":" + y.toFixed(2));
  }

  function handleMove(clientX, clientY) {
    const rect = area.getBoundingClientRect();
    let dx = (clientX - rect.left - 140) / radius;
    let dy = (140 - (clientY - rect.top)) / radius;
    const mag = Math.sqrt(dx * dx + dy * dy);
    if (mag > 1) { dx /= mag; dy /= mag; }
    setStick(dx, dy);
    sendJoy(dx, dy);
  }

  area.addEventListener("touchstart", e => { dragging = true; handleMove(e.touches[0].clientX, e.touches[0].clientY); });
  area.addEventListener("touchmove", e => { if (dragging) handleMove(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); }, { passive: false });
  area.addEventListener("touchend", () => { dragging = false; setStick(0, 0); sendJoy(0, 0); });

  area.addEventListener("mousedown", e => { dragging = true; handleMove(e.clientX, e.clientY); });
  window.addEventListener("mousemove", e => { if (dragging) handleMove(e.clientX, e.clientY); });
  window.addEventListener("mouseup", () => { if (dragging) { dragging = false; setStick(0, 0); sendJoy(0, 0); } });

  setInterval(() => { if (dragging) sendJoy(lastX, lastY); }, 150);

  let brushState = false;
  document.getElementById("brushBtn").addEventListener("click", () => {
    brushState = !brushState;
    const btn = document.getElementById("brushBtn");
    btn.classList.toggle("active", brushState);
    btn.textContent = brushState ? "Bürste AUS" : "Bürste AN";
    ws.send("b:" + (brushState ? "1" : "0"));
  });

  let autoState = false;
  document.getElementById("autoBtn").addEventListener("click", () => {
    autoState = !autoState;
    const btn = document.getElementById("autoBtn");
    btn.classList.toggle("active", autoState);
    btn.textContent = autoState ? "Automatik AUS" : "Automatik AN";
    ws.send("m:" + (autoState ? "1" : "0"));
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
  Serial.println(s);
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

      int left  = (int)((y + x) * 255);
      int right = (int)((y - x) * 255);
      currentLeft  = constrain(left, -255, 255);
      currentRight = constrain(right, -255, 255);

      setMotor(IN1, IN2, ENA, currentLeft);
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
}
