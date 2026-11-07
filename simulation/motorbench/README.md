# Virtueller Motorversuch für den Rover

Der Versuch testet einen Kanal. Ein Taster fordert Vorwärts- oder Rückwärtsfahrt an. Der Link-Schalter simuliert, dass laufend Steuerbefehle ankommen oder plötzlich ausbleiben. Ein Logikanalysator beobachtet die vorgesehenen H-Brückensignale. Die Prüfschaltung enthält den Mikrocontroller und Signalleitungen. Sie arbeitet mit virtuellen Ein- und Ausgängen ohne Motorleistungsteil.

## In Wokwi öffnen

1. Ein ESP32-Arduino-Projekt öffnen. [Wokwi ESP32](https://wokwi.com/projects/new/esp32)
2. Den Inhalt von [motorbench.ino](motorbench.ino) in `sketch.ino` kopieren und [DriveBench.h](DriveBench.h) als eigene Datei hinzufügen. Das [Schaltbild](diagram.json) in `diagram.json` übernehmen.
3. Simulation starten. Link-Schalter nach links stellen. Einen Richtungstaster halten und das serielle Protokoll beobachten. Beide Taster gleichzeitig ergeben Stopp.
4. Während ein Richtungstaster gehalten wird, den Link-Schalter nach rechts stellen. Die Ausgänge fallen 400 ms nach dem letzten Befehl ab. Nach einem unmittelbaren Richtungswechsel liegt das Enable-Signal mindestens 80 ms auf Low.
5. Die Signale lassen sich mit dem Logikanalysator als VCD aufzeichnen. D0 ist IN1, D1 ist IN2, D2 ist Enable/PWM und D3 ist Link. [Wokwi Logikanalysator](https://docs.wokwi.com/parts/wokwi-logic-analyzer)

| Signal | ESP32-GPIO | Arduino Mega Pin | Bedeutung |
|---|---:|---:|---|
| IN1 | 18 | 7 | Vorwärtsrichtung |
| IN2 | 19 | 8 | Rückwärtsrichtung |
| EN | 23 | 6 | PWM mit Sollwert 128 von 255 während Fahrt |
| VOR | 25 | 22 | Taster gegen GND |
| ZURÜCK | 26 | 23 | Taster gegen GND |
| LINK | 27 | 24 | Low simuliert frische Befehle |

Die Mega-Pins gelten für denselben Sketch auf der Zielplattform. Das mitgelieferte Wokwi-Schaltbild benutzt den ESP32. Die Pinbelegung ist für den Prüfaufbau gewählt und ersetzt keine Rover-Anschlussliste.

## Prüfstand und Grenzen

- Der lokale C++-Test deckt Einschalten, Richtungswahl, 80-ms-Umschaltpause, Timeout bei 400 ms, Stopp und `millis()`-Überlauf ab. `clang++ -std=c++11 -Isimulation/motorbench simulation/tests/motorbench.cpp -o /tmp/rover-motorbench-test && /tmp/rover-motorbench-test` aus dem Repo-Stamm ausführen.
- Der Sketch wurde für Arduino Mega 2560 und ESP32 kompiliert. Die Wokwi-Datei ist der vorbereitete interaktive Versuch. Der Browser-Simulator wurde für diesen Stand noch nicht ausgeführt.
- Für den Leistungsteil folgt eine getrennte Schaltung mit den tatsächlichen Treibern, Versorgung und Motordaten. SPICE kann Spannungsabfall und Strom mit geeigneten Bauteilmodellen abschätzen. Physischer Anlaufstrom, thermische Reserve und Eignung der vorhandenen L298N-Module für die 775er bleiben zu prüfen. [L298-Datenblatt](https://www.st.com/resource/en/datasheet/l298.pdf) · [Autodesk zu SPICE-Modellen](https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/The-simulation-spice-model-for-a-device-is-not-included-in-a-Fusion-360-and-EAGLE-PCB-library.html)

Die 400 ms und 80 ms sind Versuchswerte für die Logik. Sie dienen keinem Nachweis einer physischen Abschaltung oder eines sicheren Betriebs der Schussräder.
