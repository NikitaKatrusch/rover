# Rover V1 mit Schneckenförderer

> Der Gesamtentwurf dient als Integrationsreferenz. Die aktuelle Baustufe ist der [stationäre Schusskopf](SCHUSSKOPF_V0.md).

Digitaler Konstruktionsstand vom 07.11.2026. Die V1 setzt Nikitas Ballweg vom Unterboden bis zum neigbaren Schusskopf um. Modell, Auslegung und Prüfbericht gehören zusammen.

| Datei | Inhalt |
|---|---|
| [Rover_V1.3mf](../cad/v1/Rover_V1.3mf) | Vollständiger 3D-Entwurf in Millimetern, 101 einzeln benannte geschlossene Netzkörper |
| [Vorschau](../cad/v1/Vorschau.svg) | Schrägansicht mit teilweise ausgeblendetem Schneckenmantel |
| [Prüfbericht](../cad/v1/pruefbericht.json) | Reproduzierbare Geometrieprüfung und deren Umfang |
| [Parameter](../cad/RoverV1/auslegung.json) und [Generator](../cad/RoverV1/generate.js) | Quellmodell. Bauteilwerte aus [bauteilmasse.json](../hardware/bauteilmasse.json), neue Einbaumaße separat. |

## In Fusion öffnen und weiterentwickeln

In einer neuen Konstruktion **Netz → Erstellen → Netz einfügen**, `Rover_V1.3mf` auswählen und die Einheit Millimeter kontrollieren. Z zeigt nach oben, X ist die Fahrtrichtung. Die 3MF enthält die Netzkörper in Ruhestellung, einschließlich Referenzball, Abdeckungen und Bauraumhüllen. Autodesk dokumentiert [Netz einfügen](https://help.autodesk.com/cloudhelp/ENU/Fusion-Mesh/files/MESH-INSERT-MESH.htm). Am 07.11.2026 wurde genau diese 3MF auf Nikitas Mac in Fusion importiert. Fusion zeigte 101 Netzkörper im Millimeter-Dokument. Das importierte Modell wurde lokal als `Rover_V1_Fusion.f3d` in Downloads exportiert.

Mit Node.js lässt sich der Stand aus dem vollständigen Repo neu erzeugen. `node cad/RoverV1/generate.js` schreibt die Ergebnisse nach `cad/v1`. Ein anderer Zielordner kann als erstes Argument übergeben werden. Mit `ROVER_OBJ=1` wird zusätzlich OBJ samt Materialdatei geschrieben. Die Prüfrechnung verwendet dieselben Geometrieparameter wie der Export.

## Auslegung und Prüfwerte

Die FIP spezifiziert Ø63,5 bis 67,7 mm und 56,0 bis 59,4 g für Standard- und Höhenbälle. Durchgänge sind für den größten Ball ausgelegt. Sperren und Nennkompression der Wurfräder werden an beiden Enden des Intervalls bewertet. [FIP Game Ball Certification Process](https://www.padelfip.com/wp-content/uploads/2026/04/Game-Ball-Certification-Process.pdf)

| Abschnitt | V1-Geometrie | Prüfergebnis |
|---|---|---|
| Unterboden | Platte 235 × 250 × 5 mm, Unterseite 83 mm über Boden. Leittrichter 148 mm auf 82 mm, Rampe hinter der Achse. | 14,3 mm seitliches Gesamtspiel und 15,3 mm nach oben. Auf der abgetasteten Mittellinie mindestens 3,15 mm zu den geprüften festen Teilen ohne Auflageflächen. |
| Schnecke | Außendurchmesser 140 mm, Kern Ø20 mm, 4 Windungen mit je 105 mm Steigung. Mantel innen Ø168 mm. Seitliche feste Führung außerhalb der Windung. | Zwischen den Windungen 29,07 mm vertikaler Bereich für den Mittelpunkt des größten Balls im stationären Querschnitt. 6,54 mm Windung zu Führung. Mittig 2,67 mm Übergabespalt zur Rutsche. |
| Speicher | Trichter oben 210 × 200 mm innen, Auslauf 78 × 78 mm. | 5,0 l geometrisches Bruttovolumen bis zur Einlaufhöhe. Die tatsächliche Ballzahl hängt von Schüttung und Einlauf ab. |
| Vereinzler | Zwei Schieber mit 72 mm Höhenversatz und 84 mm Hub. Unten geschlossen, oben zurückgezogen in Ruhestellung. | Oberer Schieber 1,3 mm über dem größten unteren Ball und 23,25 mm unter der Mitte des kleinsten nächsten Balls. Auslauf hat 10,3 mm Gesamtspiel. |
| Schusskopf | Kippachse seitlich abgestützt, −5° bis +23° Auslegungsbereich. Radpaar Ø72 mm als Referenz, Nennspalt 61 mm. | Bei oberer Neigung noch 12,38° Gefälle auf der Zuführrampe. Minimaler abgetasteter Kopfabstand zur Grundplatte 11,91 mm. Rechnerische Eindrückung 2,5–6,7 mm vor Verformungsversuch. |

Der Bericht deckt geschlossene Einzelnetze, Sollmaße, ausgewählte Freiräume und einen vereinfachten Bewegungsbereich ab. Einbauschnittstellen, Reibung, Motorlast, Schwerpunkt und Ballkontakt bleiben praktisch zu prüfen. Die durchgehende Schnecke ist im Digitalmodell 424 mm hoch. Für die Fertigung ist sie in Segmente mit definierter Wellenverbindung zu teilen. Gelagerte Aufnahmen, Schraubpunkte, elektrische Schutzfunktionen und die endgültigen Schussradabdeckungen benötigen die konkreten Bauteilvarianten.

## Teilezuordnung

| Vorhanden dokumentiert | Einsatz in V1 | Auswahl bzw. Passprobe |
|---|---|---|
| 2 × 775, zwei Ø72-mm-Skater-Räder, 608ZZ und Schrauben | Die vorhandenen 775 sind diesmal für den Schusskopf angesetzt. Die vorhandenen Räder sind fürs Fahrwerk reserviert. Lager und Schrauben sind Kandidaten für die passenden Befestigungen. | Wellen, Naben, Befestigungsbilder und Eignung für Drehzahl und Last abgleichen. Schussräder sind als eigene Referenzkörper modelliert. |
| Zwei ESP32-WROOM-32D bestellt, zwei L298N und ein EU-Netzteil 12 V/10 A [S12] | ESP32 für Zustandslogik und Fahrbefehle. Treiberbauraum und Tischversorgung eingeplant. | Treiber je Motor und Messlast prüfen. Das Netzteil dient den gestuften Modulprüfungen. Mobiler Akku bleibt offen. |
| Alter Android und 360°-Servo | Smartphone-Hülle vorne als Kameraposition. Für die Klappen- und Neigeachsen sind Antriebsbauräume eingezeichnet. | Das Smartphone-Modell ist ein Platzhalter. Für genaue Winkel und Anschläge braucht der Servo Positionsrückmeldung oder einen passenden Positionsantrieb. |
| JGB37-520 aus altem Warenkorb, mögliche weitere Motoren | Zwei langsame Fahrgetriebeantriebe und ein separater Schneckenantrieb als Bauraum. | Bestellung und tatsächliche Varianten sind offen. Bauraum Ø37 × 80 mm für Fahrmotoren ist ein Entwurfsmaß. |

## Funktionsfolge für Inbetriebnahme

1. Das Android liefert das lokale Kamerabild. Der Mac erkennt den Ball und zentriert ihn im Bild. Der ESP32 setzt Sollwerte um. Bei veraltetem Bild oder ausbleibendem Fahrbefehl stoppt die Fahrt.
2. Im Einlauftest wird je ein Ball aus unterschiedlichen seitlichen Lagen und bei unterschiedlichen Schneckenphasen zugeführt. Die flache Tasche stabilisiert die Position, die erste Windung greift von unten, die feste Führung hält die Bahn. Eine weiche Einzugsrolle bleibt als Option, falls der Test zu viele Fehlaufnahmen zeigt.
3. Am oberen Ende soll der feste Abstreifer den Ball über die konturierte Rutsche in den Speicher lenken. Schüttung, Abstreifkontakt und Rückstau werden mit echten Bällen beobachtet. Ein Sensor am Auslauf ist für die spätere Bestätigung der Aufnahme vorgesehen.
4. Zur Ausgabe hält zunächst der untere Schieber den ersten Ball. Der obere schließt und hält die restliche Schlange. Der untere öffnet und wartet auf bestätigten Ballabgang, schließt wieder und gibt erst dann den oberen frei. Die Schussfreigabe ist mit Stillstand, Kopfstellung, Schutzabdeckung und Raddrehzahl zu verknüpfen. Der Rover dreht für die horizontale Richtung.
5. Für die Integration nach dem stationären Schussversuch Aufnahme und Förderung sowie Trichter und Schieber einzeln prüfen. Das V1-Modell ist die Zielgeometrie für die gemeinsame Baugruppe.
