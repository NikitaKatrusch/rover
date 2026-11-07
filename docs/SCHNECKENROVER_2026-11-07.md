# Rover mit Schneckenförderer

> Die aktuelle Baustufe ist der [stationäre Schusskopf](SCHUSSKOPF_V0.md). Dieses Dokument hält das Gesamtvorhaben fest.

> Die vollständige Auslegung liegt jetzt als [Rover V1](ROVER_V1_CAD.md) vor. Zahlen und Rollenverteilung in diesem Entwurfsprotokoll dokumentieren den früheren V0-Stand.

Stand 07.11.2026. Nikitas Konzept aus dem Chat „Chat zum Ballroboter“ und dem Screenshot des Tinkercad-Entwurfs „Neat Kasi“ ist die aktuelle Entwicklungsrichtung. Die frühere Doppelband-Variante bleibt in den historischen Unterlagen nachvollziehbar.

## Ballweg und Schnittstellen

| Baugruppe | Aktuelle Funktion | Nächster Nachweis |
|---|---|---|
| Einlass und Unterboden | Der Rover fährt über den Ball. Seitliche Führungen bringen den am Boden rollenden Ball mittig nach hinten. Der Kanal bleibt an der Achse möglichst niedrig und frei. | Reale Engstelle einschließlich Haltern, Leitungen und Stützrollen messen. Fahrt mit mittig und versetzt liegenden Bällen filmen. |
| Aufnahme hinten | Nach der Achse hält eine kurze, höhenverstellbare Rampe mit Tasche den Ball am Eintritt. Die erste Schneckenwindung soll von unten untergreifen. Eine feststehende Führung hält den Ball in der Förderbahn und wirkt dem Mitdrehen entgegen. Bei unzuverlässiger Übergabe eine weiche Einzugsrolle an dieser Stelle testen. | Eine kurze, langsam angetriebene Schneckenprobe mit ein bis zwei Windungen und austauschbarer Einlaufführung. Ball bei verschiedenen Startwinkeln zuführen und greifen, mitdrehen, klemmen oder auswerfen protokollieren. |
| Speicher | Oben wirft der Förderer in einen festen Behälter mit Trichter aus. Die alte Hülle 210 × 150 × 180 mm und etwa 20 Bälle bleiben Referenz und Ziel aus der Vorgeschichte. | Tatsächliche Schüttung, Auslauf und Schwerpunkt mit leerem und vollem Speicher testen. |
| Vereinzelung | Eine betätigte Klappe mit zwei versetzt schließenden Sperren oder ein Drehschieber mit einer Balltasche hält die Schlange zurück und lässt den isolierten Ball durch. | Aus voll und fast leer befülltem Trichter pro Auslösung genau einen Ball zählen. |
| Schusseinheit | Zwei gegenläufige Schussräder gemeinsam auf einem gelagerten, nach oben und unten neigbaren Kopf. Das Fahrwerk dreht den Rover für links und rechts. Fester Trichter und kurzer Übergang nahe der Kippachse. | Übergang, Kabelschlaufe und Kollisionsfreiheit über die ganze Bewegung prüfen. Vor Freigabe der Klappe Stillstand des Fahrwerks, Schussfreigabe und stabile Raddrehzahl prüfen. |

## Bauraum und erste Schneckenprobe

Die [Fusion-Referenz](FUSION_ANBINDUNG.md) enthält Platte, zwei Rad- und zwei Motorhüllen sowie einen Referenzball. Die Quellwerte 235 × 215 × 5 mm, Ø72 × 24 mm, Ø44,6 × 71 mm und Ø66 mm stammen aus [bauteilmasse.json](../hardware/bauteilmasse.json). Sie sind überliefert und noch nicht vollständig am aktuellen Aufbau nachgemessen. Die Einbauannahmen sind separat in [layout.json](../cad/RoverReferenz/layout.json) abgelegt.

- Der nominelle Durchgang zwischen den 775-Gehäusehüllen ist 73 mm. Zwei angenommene 2-mm-Führungswände lassen 69 mm frei, also 3 mm Gesamtspiel zum Referenzball. Über dem Ball bleiben 6 mm bis zur Plattenunterseite. Wellen, Halter, Schrauben, Caster, seitliche Einfahrt und Untergrund sind im Modell noch offen. Bei kleinerem Ist-Durchgang Motoren/Halter aus dem Ballkanal verlegen.
- Für einen senkrechten Schneckenversuch mit rundem Mantel braucht der radiale Zwischenraum mindestens einen Balldurchmesser. Bei Ø66 mm Ball und angenommenem Ø20 mm Kern ergibt das mindestens Ø152 mm Mantel innen bei null Spiel. Die Beispielgeometrie Ø156 mm innen ergibt 2 mm Radialspiel. 80 mm Steigung und 4 mm axiale Windungsdicke ergeben bei festem Winkel 10 mm rechnerisches axiales Spiel. Der axiale Wert prüft weder die schräge Flanke gegen die Kugel noch die Kontaktbahn. Diese Zahlen dienen der Größenordnung und sind Versuchswerte.
- Die Probe braucht eine geschützte, einsehbare Einlaufzone und eine feste Führung hinter dem Ball. Einlaufhöhe, Windungskante und Führung so testen, dass der Ball aus mehreren Startpositionen aufgenommen wird. Rampe und Einlauf bei Stillstand einstellen. Prüfziel für den ersten Vergleich sind 20 Zuführungen mit mehreren realen Bällen und unterschiedlichen Startwinkeln, gefolgt von einem Test mit zwei nachlaufenden Bällen. Zahl der Fehlaufnahmen und Staus festhalten.

Die Downloads „Neat Kasi.stl“ und „Neat Kasi-2“ bis „Neat Kasi-5“ sind ältere Mesh-Exporte. Die September-3MF enthält eine einzelne 39,5 × 21,05 × 10 mm große Mesh-Geometrie, passend zur Außenhülle der gleichnamigen STL-Variante. Für den Abgleich der vollständigen aktuellen Baugruppen ist ein frischer Export aus „Neat Kasi“ nötig.

## Hardware und Steuerung

- Zwei 775 und zwei Räder sind [dokumentiert](../hardware/INVENTAR.md). In der Referenz sitzen sie als Fahrantrieb. Für gleichzeitige Ausstattung mit zwei separat angetriebenen Schussrädern fehlen dann zwei bestätigte Schussantriebe. Ein langsamer Getriebeantrieb für die Schnecke bleibt zusätzlich offen. Die Varianten aus dem alten Warenkorb getrennt vom physischen Bestand zählen.
- ESP32 für Antriebsbefehle, Rückmeldungen und Stillsetzen bei ausbleibenden Fahrbefehlen. Ältere Sketches bleiben im [Archiv](../firmware/legacy/README.md). Der vorhandene MG996R mit kontinuierlicher Drehung hat keine absolute Klappen- oder Neigeposition. Für diese Achsen kommen ein Positionsservo oder eine Positionsrückmeldung mit Endanschlägen infrage.
- Strom zuerst mit dem vorhandenen Netzteil und je einem Prüfmodul. Treibervariante, Versorgung und erwartete Anlaufströme vor belasteten Motorversuchen abgleichen. Akku, Leistungszweige und Reichweite werden nach den Messungen festgelegt. Der dokumentierte Ninebot-Akku ist eine spätere Option.
- Altes Android vorne am Rover, mittig auf den Einlass ausgerichtet, als Kamera über lokales WLAN. Der Mac erkennt zunächst Ballfarbe und -form im Bild. Er sendet Sollwerte an den ESP32, der den Rover dreht und bei annähernd mittigem Ball langsam vorwärts fährt. Die Nahzone, in der der Ball unter der Kamera verschwindet, mit einer kurzen kontrollierten Einfahrt überbrücken. Ein Sensor am Schneckenauslauf kann später die erfolgreiche Aufnahme bestätigen. Erst Kamerabild, dann Erkennung mit echten Bildern vom Platz, dann Fahrt testen.

## Prüfablauf

1. Ball an mehreren Stellen messen. Den freien Kanal unter der Platte am echten Rover an der engsten Stelle in Breite und Höhe messen. Aktuellen „Neat Kasi“-Export als Geometriereferenz sichern.
2. Kurzen Einlauf samt erster Windung modellieren. Dafür reale Montagehöhe, Abstand ab Hinterkante und Einlassposition aufnehmen. Abstände und Windungsphase geometrisch prüfen, anschließend Griff und Staus am Tisch testen.
3. Unterboden und Hub gemeinsam testen. Danach Hopper und Vereinzelung aufbauen. Mit Gelenken und Interferenzprüfung in Fusion den Neigebereich des Schusskopfs kontrollieren. [Autodesk Motion Study](https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/How-to-perform-kinematic-motion-analysis-of-revolution-based-on-joints-in-Fusion-360.html)
4. Im weiteren Verlauf eine 3D-Fahr- und Kamerasimulation mit beiden Platzhälften und Netz für Suchlogik und Wendemanöver aufbauen. Für Reibung, Nachgiebigkeit, Einzug und Schussgeschwindigkeit bleiben Messwerte vom echten Aufbau maßgeblich.
