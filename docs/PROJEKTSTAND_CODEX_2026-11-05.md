# Ergänzter Projektstand: Ballsammler-Rover

> Historischer Stand. Für den aktuellen Schneckenaufbau und den getesteten Fusion-Zugriff siehe [Projektstand vom 07.11.2026](SCHNECKENROVER_2026-11-07.md) und [Fusion-Anbindung](FUSION_ANBINDUNG.md).

Stand: 05.11.2026 · Autor dieser Zusammenführung: Codex · Repository: NikitaKatrusch/rover.

Ab 05.11.2026 übernimmt Codex auf Nikitas Wunsch die weitere Projektarbeit allein. Diese Datei ergänzt die bestehende README und die ursprünglichen Chatdateien. Sie ersetzt sie nicht. Quellenkennungen stehen in [QUELLEN_UND_ABGLEICH.md](QUELLEN_UND_ABGLEICH.md). Nicht dokumentiert bedeutet nicht automatisch nicht vorhanden.

## 1. Ziel und Prioritäten

Ein möglichst weitgehend 3D-gedruckter Rover soll Padel-Bälle finden, aufnehmen und speichern. Später soll derselbe Rover Bälle wieder schießen können, einschließlich Neigung für Lobs. Als langfristiger Wunsch wurde gleichzeitiges Sammeln und Schießen genannt; die Architektur darf das nicht unnötig verbauen. Ein umgesetzter Parallelbetrieb ist nicht belegt.

Nikita möchte vorhandene Hardware wiederverwenden, unnötige zusätzliche Rechnerkäufe vermeiden und zunächst die vorhandenen Funktionen zum Laufen bringen. Ein Aluprofilrahmen und ein gekauftes RC-Chassis wurden als Ersatz für den 3D-Druck abgelehnt. Ein professioneller Gesamtplan mit Mechanik, Elektronik, Software und Computer Vision ist ausdrücklich gewünscht. Stundenlange Drucke mit anschließend unpassenden Halterungen waren ein wesentlicher früherer Blocker. [S1, S3, S5]

## 2. Was tatsächlich vorliegt

| Bereich | Belegter Stand | Noch kein Nachweis |
|---|---|---|
| Dokumentation | Originalchat, Aufsammelzusammenfassung, Claudes am 05.11. ergänzte README | Vollständige aktuelle, physisch abgeglichene Stückliste |
| Elektronik | Ursprünglicher Bestand und später kostenlos vorhandener Ninebot-Akku dokumentiert | Kaufabschluss des September-Warenkorbs |
| Firmware | Zwei echte lokale Arduino-Sketches gefunden und unter `firmware/legacy/` übernommen | Neuer Build, aktueller Flashstand, störungsfreier Gesamtlauf |
| Fahrtests | Ein Motor lief; der andere wurde laut Nutzer direkt an der Niederspannungsversorgung zum Drehen gebracht | Ursache des Fehlers und erfolgreicher abschließender Test beider Kanäle |
| Druckteile | Lochplatte, Adapter, Caster-/Bandideen im Chat bearbeitet; Adapterdruck mit zu großer Passung berichtet | Aktuelle editierbare CAD-Baugruppe, endgültige Passprotokolle und Belastungstests |
| Vision | Handy-Kamera plus Laptop als gewünschter Weg | Verifizierte Kamera-/Erkennungssoftware im Repository |
| Fusion | APFS-Sparsebundle auf NO NAME und webdeploy-Umleitung eingerichtet; Sicherung des alten Ordners vorhanden | Installation weiterhin blockiert: Vorprüfung verlangt etwa 2 GB zusätzlichen internen Platz; keine installierte App oder MCP-Verbindung |

Die beiden alten Sketches heißen `Ballsammler_Rover.ino` und `RoverV2.ino`. RoverV2 ist laut lokalem Änderungsdatum der spätere Fund; Dateidatum allein beweist nicht, welcher Sketch auf dem ESP32 installiert ist. [S6]

## 3. Baugruppen und Schnittstellen

### Fahrwerk

- Zwei getrennt steuerbare Fahrmotoren; Kurven durch Drehzahldifferenz, Pivot-Drehung durch gegenläufige Räder.
- Historischer Aufbau: 2 × 775 mit 72-mm-Skater-Rädern und L298N. Keine gemessene Getriebeübersetzung oder belastbare Fahrgeschwindigkeit dokumentiert.
- 15.000 U/min ist eine berichtete Leerlauf-/Angebotsangabe, keine gemessene Raddrehzahl. Die im UI berechnete Drehzahl ist eine Schätzung aus PWM.
- Neuere Aufsammelzusammenfassung: Antriebsräder auf der schweren hinteren Seite, zwei Kugel-Caster vorn seitlich des Kanals.
- Provisorische Base im älteren Verlauf: eine Lochplatte und zunächst ein Caster. Dies ist ein früherer Teststand, keine verbindliche Stückzahl für den fertigen Sammler.
- Unter dem Chassis liegende Räder und eine hintere Antriebsachse schließen sich räumlich nicht aus. Die konkrete Baugruppe muss zeigen, was tatsächlich kollidiert; ein Widerspruch folgt nicht allein aus diesen Formulierungen.

Offen: Motorwahl des Endstands, Radnaben-Kraftschluss, zusätzliche Radlagerung/zulässige Wellenlast, Bodenfreiheit, Spurweite, Casterposition und Schwerpunkt mit Akku sowie vollem Speicher. Den Rotor-/Motorwellenstummel nicht ohne Prüfung als tragfähige Radachse freigeben. [S1, S2, S3]

### Ballaufnahme und Förderung

Aktuell dokumentiertes Konzept: eine niedrige Frontlippe führt den Ball in einen Kanal unter dem Chassis. Eigene Kanalwände halten ihn von den Rädern fern. Der Übergang zum Förderer verjüngt sich über vorgeschlagene 20–30 mm ohne harte Stufe. Zwei gegenüberliegende Bänder greifen den Ball und transportieren ihn nach oben; beide Kontaktflächen bewegen sich aufwärts, obwohl die Bandschlaufen entgegengesetzt umlaufen. [S2]

Die Bandflächen brauchen hinreichenden Grip und einstellbaren Abstand. Ein erwähnter 66-mm-Ball bei 63-mm-Spalt ist ein alter Diskussionswert, keine getestete Kompression. Kräfte, Motorstrom, Schlupf, Verschleiß und sichere Aufnahme müssen am kurzen Aufbau geprüft werden. Auch ein leichtes Kanalgefälle benötigt eine reale Höhenbilanz; es ist kein Beweis, dass der gesamte Weg vom Boden bis in den Speicher allein durch Schwerkraft funktioniert.

Empfohlen waren zwei langsame Getriebemotoren, alternativ ein Motor mit mechanischer Gegenlaufkopplung. N20 wurde in der älteren Zusammenfassung vorgeschlagen; später stand JGB37-520 im Warenkorb. Daraus folgt keine bestätigte Endauswahl. GT2-Riemen und gedruckte Kettenglieder sind alternative, noch nicht endgültig abgeglichene Bandansätze. [S2, S3, S5]

Nicht erneut als stillschweigende Standardlösung einsetzen: ursprüngliche motorisierte Bürste, Mulden-/Becherwerk und eine Förderschnecke für die aktuelle Aufnahme. Die Bürste ist überholt; Schnecke/PVC-Bogen wurden separat für einen möglichen späteren Schuss-Zubringer besprochen. Begründungen und damalige Aussagen bleiben in den Originaldateien erhalten. [S1, S2]

### Speicher und spätere Schusseinheit

Zielgröße etwa 20 Bälle. Historische Trichterhülle 210 × 150 × 180 mm ist nur ein Entwurf. Außenvolumen, verjüngter Innenraum und praktisch nutzbares Ballvolumen sind verschieden. Die alte Angabe rund 5 Liter ist nicht als gemessene Nettokapazität belegt. Packung, Zuführung und Brückenbildung am Auslauf müssen praktisch überprüft werden. [S2]

Später besprochen: zwei Wurfräder nebeneinander mit vertikalen Motorachsen, eigener Zuführung/Vereinzelung und einer neigbaren Plattform. Die Seitenbezeichnung muss über die Laufrichtung der Radflächen und eine Zeichnung eindeutig werden; frühere Formulierungen zu „aufrecht“/„liegend“ waren mehrdeutig.

Ein kurzer flexibler Übergang an der Neigeachse und eine feste Klappe davor wurden vorgeschlagen. Ein Kanal von 80–85 mm Breite ist allein noch keine vollständige Vereinzelung gegen mehrere hintereinander drückende Bälle. Füllstand als Modusauslöser und der Wunsch nach Parallelbetrieb sind noch in einer gemeinsamen Zustandslogik aufzulösen. Zusätzliche Wurfmotoren und Positionsservos sind nicht als gekauft bestätigt. Der vorhandene 360°-Servo liefert keine definierte Klappen- oder Neigeposition. [S1, S2, S3]

## 4. Steuerung, Kamera und Bedienung

- ESP32 für Motorbefehle, Weboberfläche und zeitkritische Basisfunktionen.
- Altes Handy als Kamera, Stream über WLAN zum Laptop; keine zusätzliche ESP32-CAM als notwendiger Kauf festgelegt.
- Laptop für Ballerkennung und später höherwertige Interpretation. Raspberry Pi/Jetson waren Alternativen, vom Nutzer zunächst nicht bevorzugt.
- Vorgeschlagener Suchzyklus: suchen → Ball im Bild zentrieren → annähern → vor Aufnahme abbremsen → erneut suchen.
- Kamera vorne mittig leicht abwärts auf die tatsächliche Einlassmitte ausrichten. Größen-/Nähe-Schwellen, etwa 15 % Bildhöhe, sind Vorschläge und müssen kalibriert werden.
- Handy, Laptop und ESP32 benötigen eine tatsächlich funktionierende gemeinsame Netzverbindung. Eigenes ESP32-AP-WLAN und ein separater Handy-Hotspot sind nicht automatisch dasselbe Netz.
- Gegnerverständnis/Vision-Language-Modell und Schusswahl sind spätere Wünsche, keine vorhandene Funktion. Ein LLM soll keine ungeprüften direkten Echtzeit-Motorwerte ersetzen. [S1, S2]

Für eine spätere Simulation wünschte Nikita ausdrücklich eine richtige 3D-Darstellung beider Court-Hälften mit Netz. Die damalige einfache 2D-Abdeckungssimulation war dafür nicht ausreichend. Ihre idealisierten 90°-Drehungen und schlupffreien Bahnen sind kein Nachweis realer Navigation. Eine solche 3D-Simulation liegt hier nicht als verifizierte Projektdatei vor. [S1]

### Historische Firmware und Fehlerbild

RoverV2 enthält WLAN-AP, WebSocket-Joystick, Tempo-Slider, Einzelmotor-Testknöpfe, Bürstensteuerung, Telemetrie und zeitgesteuertes Zickzack. Ein 400-ms-Fahrtimeout existiert im manuellen Zweig. Es ist falsch, dem Altstand pauschal jeden Failsafe abzusprechen. Der Timeout ist aber kein allgemeiner Notstopp: Auto-Modus und Bürste werden davon nicht vollständig erfasst. [S6]

Der Verlauf nennt Probleme mit Async-Webserver/Core-Versionen, JavaScript in der eingebetteten HTML-Zeichenkette, Boot-/Verbindungsproblemen und einem nicht reagierenden Motor. IN4 wurde von GPIO12 auf GPIO17 verschoben; das allein hat laut Chat nicht alle Probleme behoben. Frühere Behauptungen „nur Kabel“ oder „nur Motor“ sind keine nachgewiesene Fehlerdiagnose. Direkter Lauf am Netzteil beweist ebenfalls nicht ausreichend verfügbares Anlaufmoment über den Treiber. [S1]

Konkrete Codebefunde und Pinbelegung: [Firmware-Archiv](../firmware/legacy/README.md). Vor Wiederaufnahme zuerst Hardwarestand und tatsächlichen Flashstand abgleichen.

## 5. Stromversorgung

Der bestätigte Ninebot-Max-G30D2-Akku hat berichtete 36 V nominal, 42 V voll, 551 Wh und 15,3 Ah. Er ist kostenlos vorhanden. Gehäusemaße, Befestigung, Steckerbelegung, Entladefreigabe/BMS-Verhalten und Ladegerät sind noch nicht dokumentiert. [S4]

Die frühere 12-V-Testverkabelung ist kein Anschlussplan für diesen Akku. 12-V-Motoren, ESP32 und Servos nicht direkt an 36/42 V anschließen. Ein normaler LM2596 ist bis 40 V Eingang spezifiziert; für einen vollen 42-V-Akku ist er als direkter Eingang ungeeignet. Der BTS7960 ist regulär bis 27,5 V Betriebsspannung angegeben. Der L298-Chipwert ist keine Freigabe eines beliebigen L298N-Moduls mit unbekanntem Regler und Kondensatoren. [E1–E3]

Vor Akkuintegration: konkrete Spannungszweige, Motor-Anlauf-/Blockierströme, zulässige Modulströme, Wandlertyp und Spitzenlasten klären; passend abgesicherte Verteilung und eine erreichbare Abschaltung vorsehen. Kein Wert für Sicherung oder Laufzeit wird hier aus den alten Schätzungen freigegeben. Das ursprüngliche 12-V/10-A-Netzteil bleibt ein historisch dokumentiertes Tischtestgerät.

## 6. Geometrie und Konstruktion

Die [Maßtabelle](../hardware/MASSE.md) unterscheidet Nutzerspezifikationen, zitierte Angebotsdaten, historische CAD-Maße und unbestätigte Vorschläge. Dazu gibt es [maschinenlesbare Daten](../hardware/bauteilmasse.json). Kein Eintrag wird ohne Messprotokoll als neu mit Messschieber verifiziert ausgegeben.

Wichtigste bekannte Größen: 72-mm-Räder; 24-mm-Radbreite und 22-mm-Lagersitz aus kopiertem Angebot; 5-mm-Motorwelle; 44,6-mm-Motorgehäusedurchmesser und 71-mm-Gehäuselänge aus altem Assistentenrückgriff. Die Wellenlänge muss wegen widersprüchlicher alter Angaben nachgemessen werden.

Die spätere Lochplatte wurde mit 215 × 235 × 5 mm, 5-mm-Löchern, 10-mm-Raster und 483 Löchern diskutiert. Frühere 210 × 305/307-mm-Platten, hohe Rampen und rund 930-mm-Gesamtlänge sind überholte Entwurfsstände. Nicht zu einer neuen Baugruppe vermischen. Bambu P1S wird vom Nutzer genannt; Aussagen zu P1P stammen teilweise aus einem Browser-Slicerprofil und beweisen keinen Druckerwechsel. [S1]

Die Fusion-Anbindung und der geplante parametrische Arbeitsweg stehen in [FUSION_ANBINDUNG.md](FUSION_ANBINDUNG.md). Es wurde bei dieser Dokumentation kein 3D-Modell erstellt oder als passend getestet.

## 7. Nächste überprüfbare Schritte

1. Den aktuellen Repository-Stand fortführen; Warenkorbstatus und reale Teilevariante ergänzen. Die weitere Umsetzung übernimmt Codex allein.
2. Aktuelle CAD-Datei und die kritischen Istmaße aufnehmen; insbesondere Motorbohrbild, Wellenlänge, Radnabe, Getriebemotor und Akkublock.
3. Motor-/Treiberproblem mit dokumentierter Versorgung und reproduzierbarem Links-/Rechts-Test lösen; Erfolg nicht aus dem Dateinamen „V2“ ableiten.
4. Fusion verbinden, vorhandene Geometrie lesen, Einheiten und Komponenten prüfen; Modelländerungen versionieren.
5. Kleine Passprobe für Motorhalter/Radadapter und kurzer Bandtest mit echtem Ball.
6. Erst danach gesamte Aufnahme, Speicher und Akkuintegration im gemeinsamen System freigeben. Schuss bleibt die spätere Ausbaustufe.
