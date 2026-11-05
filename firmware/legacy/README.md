# Wiedergefundene ESP32-Sketches

Am 05.11.2026 aus den tatsächlich vorhandenen lokalen Download-Dateien übernommen. Beide `.ino`-Dateien sind **bytegenaue Archivkopien**, nicht neu entwickelte oder reparierte Firmware. Keine Kompilierung, kein Flashen und kein Hardwaretest wurden bei dieser Übernahme ausgeführt. Ein bestehendes Motorproblem gilt nicht als gelöst.

| Datei | Lokale Quelldatei | Letzte lokale Änderung (UTC) | SHA-256 der Originalbytes |
|---|---|---|---|
| `Ballsammler_Rover/Ballsammler_Rover.ino` | `Downloads/Ballsammler_Rover/Ballsammler_Rover.ino` | 2026-09-03T20:02:21.388999Z | `44c12fe4db631497a57c57584eb2ad1a3a4b6473b30ba33ad0045f3f1c6a3c07` |
| `RoverV2/RoverV2.ino` | `Downloads/RoverV2/RoverV2.ino` | 2026-09-07T18:20:41.200999Z | `d33417cc03d35e5cb84084e501929c596eccc9882514ec42bcbc416dacd18782` |

Die Dateien enthalten nur den historischen lokalen Demo-AP-Zugang, keinen ausgelesenen privaten Heim-WLAN-Zugang. Er ist kein geeigneter dauerhafter Zugang für den Betrieb.

## Schnittstellen des gefundenen Altstands

| Funktion | Pin / Einstellung |
|---|---|
| Linker L298N-Kanal | IN1 GPIO26, IN2 GPIO27, ENA GPIO25 |
| Rechter L298N-Kanal | IN3 GPIO14, IN4 GPIO17, ENB GPIO33 |
| Bürstenservo, Continuous Rotation | GPIO13 |
| HC-SR04 Trigger / Echo | GPIO32 / GPIO35 |
| Bumper | GPIO4, INPUT_PULLUP, aktiv LOW |
| Motor-PWM | `ledcAttach`, 5 kHz, 8 bit; 0–255 |
| Manuelles Timeout | 400 ms seit letzter empfangener WS-Nachricht |
| Auto-Startwerte | 20 cm Abstand; Drehung 700 ms; Seitenversatz 600 ms; PWM 180 |
| RoverV2 Motor-Einzeltest | `TEST_SPEED = 255` |
| Webserver | HTTP 80; WebSocket `/ws`; SoftAP-IP standardmäßig 192.168.4.1 |
| Bedienung | Joystick, Tempo-Slider; V2 zusätzlich Motor-Testknöpfe und Telemetrie alle 250 ms |

Serieller Monitor: 115200 Baud. Genannte Bibliotheken: `ESPAsyncWebServer`/`AsyncTCP` aus dem ESP32Async-Umfeld und `ESP32Servo`. Die tatsächlich verwendeten Versionen sind nicht als Lockdatei gesichert. Die `ledcAttach`-Aufrufe deuten auf Arduino-ESP32-Core 3.x; keine neu bestätigte Buildkonfiguration daraus ableiten.

IN4 steht in beiden gefundenen Dateien bereits auf 17. Alte Erklärungen im Kommentar nennen GPIO12 als Bootursache. Der Chat belegt jedoch nicht, dass dieser Wechsel allein den Fehler behoben hat.

## Vor Wiederverwendung zu bearbeiten

1. Bürsten- und Ultraschalllogik an den tatsächlichen neueren Aufnahmemechanismus anpassen. Zwei Förderbandmotoren sind hier noch nicht implementiert.
2. Allgemeine Abschaltung definieren: vorhandenes Timeout stoppt die Fahrmotoren nur im manuellen Zweig; Auto-Modus und Bürste werden nicht vollständig abgedeckt. Jeder WS-Datenempfang aktualisiert derzeit die Zeit, nicht nur gültige Fahrbefehle.
3. WebSocket-Daten längenbegrenzt und mit Frame-/Fragmentprüfung parsen. Der alte `String((char*)data)` liest zunächst wie eine nullterminierte Zeichenkette; nachträgliches `substring` ersetzt keine begrenzte Übernahme des Eingabepuffers.
4. Zickzack nicht als bewiesene Flächenabdeckung ausgeben: Die Drehrichtungen sind fest einprogrammiert, Winkel und Versatz nur zeitgesteuert. Es gibt keine Encoder-/Gyro-Rückführung und keinen bestätigten Navigationstest.
5. `readDistanceCM()` behandelt fehlendes Echo als 999 cm. Ein fehlender Sensor darf dadurch keinen freigegebenen autonomen Betrieb begründen. Sensor/Bumper waren im alten Test noch nicht vorhanden.
6. Reale Versorgung und Pegel prüfen. Ein 5-V-Sensorausgang darf nicht ungeprüft an einen 3,3-V-ESP32-Eingang; zulässige Pegel mit tatsächlichem Sensor/Board abgleichen. Kein Anschluss dieses Altplans direkt an den Ninebot-Akku.
7. Motortreiber und 775-Anlaufstrom prüfen. Ein im Leerlauf drehender Motor und ein per PWM angezeigter U/min-Schätzwert sind keine Bestätigung der Eignung des Fahrantriebs.
8. Bibliotheken/Core nach erfolgreichem Build festhalten, danach dokumentierter Tischtest beider Kanäle und Stoppverhalten. Nicht automatisch den alten Voll-PWM-Einzeltest als ersten neuen Test übernehmen.

Diese Punkte sind aus dem Quelltext und den Altberichten abgeleitete offene Arbeiten. Bei der Dokumentation wurde keine Korrektur in den Originalsketches vorgenommen.
