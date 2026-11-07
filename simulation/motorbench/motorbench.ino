#include "DriveBench.h"

// Testausgänge für den Logikanalysator. Kein Rover-Pinout.
#if defined(ARDUINO_ARCH_ESP32)
constexpr int in1 = 18, in2 = 19, en = 23, fwd = 25, rev = 26, linkPin = 27;
#elif defined(ARDUINO_AVR_MEGA2560)
constexpr int in1 = 7, in2 = 8, en = 6, fwd = 22, rev = 23, linkPin = 24;
#else
#error "ESP32 oder Arduino Mega 2560 auswählen"
#endif

DriveBench drive;
DrivePins previous{false, false, 0};

void setup() {
  const int outputs[] = {in1, in2, en};
  for (int pin : outputs) {
    pinMode(pin, OUTPUT);
    digitalWrite(pin, LOW);
  }
  const int inputs[] = {fwd, rev, linkPin};
  for (int pin : inputs) pinMode(pin, INPUT_PULLUP);
  Serial.begin(115200);
  Serial.println("Rover-Logikversuch. Link-Schalter schliessen, dann Richtungstaster halten.");
}

void loop() {
  const uint32_t now = millis();
  const bool forward = digitalRead(fwd) == LOW;
  const bool reverse = digitalRead(rev) == LOW;
  if (digitalRead(linkPin) == LOW) {
    const Drive command = forward == reverse ? Drive::Stop
                         : forward ? Drive::Forward : Drive::Reverse;
    drive.receive(command, now);
  }
  const DrivePins pins = drive.update(now);
  if (pins.in1 != previous.in1 || pins.in2 != previous.in2 || pins.pwm != previous.pwm) {
    analogWrite(en, 0);
    digitalWrite(in1, pins.in1);
    digitalWrite(in2, pins.in2);
    analogWrite(en, pins.pwm);
    previous = pins;
    Serial.print(now);
    Serial.println(pins.in1 ? " ms VOR" : pins.in2 ? " ms ZURUECK" : " ms STOPP");
  }
  delay(2);
}
