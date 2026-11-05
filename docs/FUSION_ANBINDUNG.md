# Autodesk Fusion anbinden und maßhaltig konstruieren

Recherche und vertiefter lokaler Check: 05.11.2026. Die eigentliche Fusion-Installation fehlt am Ziel des vorhandenen Starters. In `~/Applications/Autodesk Fusion.app` liegt nur eine ca. 165-kB-Start-App; deren Shellskript verweist auf `~/Library/Application Support/Autodesk/webdeploy/production/8d5cf31c499af92b129d5c36903f580173897f8c/Autodesk Fusion.app` (alternativ `Autodesk Fusion 360.app`). Der übergeordnete Autodesk-Installationsordner existiert nicht. Die vorherige Aussage „Fusion installiert“ beruhte nur auf dem vorhandenen Starter und wurde korrigiert. `Fusion Client Downloader.dmg` liegt weiterhin in Downloads. Vor der Verbindung muss die eigentliche Installation wiederhergestellt werden. `127.0.0.1:27182` war nicht erreichbar; in dieser Sitzung sind keine Fusion-Modellierungswerkzeuge aktiv. Es wurde nichts im CAD geändert.

## Direkter Weg: offizieller lokaler Fusion-MCP-Server

In Fusion unter Preferences/Einstellungen → General/Allgemein → API den lokalen Fusion MCP Server einschalten und Fusion offen lassen. Standard-Endpunkt: `http://127.0.0.1:27182/mcp`. In Claude Desktop den offiziellen Autodesk-Fusion-Connector auswählen; andere lokale Clients brauchen Streamable HTTP. Ein anderer Port erfordert die entsprechende Client-URL. [F1]

Für die aktuelle Codex-/ChatGPT-Umgebung zuerst verifizieren, ob eine lokale MCP-Verbindung bereitgestellt werden kann. Der Zugriff ist hier noch nicht nachgewiesen. Ein Cloud-Chat erreicht den Loopback-Port des Macs nicht allein durch Eintragen der URL. Kein öffentliches Portforwarding für den lokalen CAD-Zugriff einrichten.

Der Autodesk Product Help MCP beantwortet Dokumentationsfragen. Er ist keine CAD-Steuerung. Fusion Data dient hauptsächlich Projektdaten. Für Modelländerungen benötigen wir die lokale Modellierungsschnittstelle oder den Skriptweg. [F2]

Erster Verbindungstest: Werkzeugliste und aktives Dokument nur lesen. Einen einfachen Maßtest anschließend in einem separaten neuen Dokument ausführen, speichern und Ergebnismaße rücklesen. Vorhandenen Rover nicht als Testobjekt überschreiben. Niemals behaupten, die Verbindung sei aktiv, nur weil eine Einstellung oder ein Connector vorhanden ist.

## Verlässlicher Skriptweg

Fusion kann lokale Python-Skripte und Add-ins ausführen. Wir können parametrische Baugruppen als versionierten Quelltext im Repository entwickeln und in Fusion über Utilities/Dienstprogramme → Scripts and Add-ins/Skripte und Zusatzmodule laden. Das Skript erstellt oder verändert die Geometrie innerhalb der laufenden CAD-Anwendung. [F3]

Das benötigt keinen erratenen Mausablauf. Bei noch fehlendem direktem Zugriff startet Nikita das Skript zunächst lokal; eine weitergehende Ausführung/Bridge muss ausdrücklich technisch verifiziert werden. Die API ist nicht automatisch als gewöhnlicher externer Python-Import außerhalb von Fusion nutzbar.

Wichtiger Implementierungsfehler aus früheren CAD-Versuchen: fehlgeschlagene Cut-/Bohrfeatures nicht als erledigt melden. Nach jeder Operation entstandene Körper/Features und tatsächliche Geometrie überprüfen. Konstruktion nicht allein aus einem Screenshot beurteilen.

## Gemeinsamer parametrischer Arbeitsweg

1. Aktuelles `.f3d` bzw. bei externen Referenzen `.f3z` und vorhandene STEP-Exporte identifizieren. Ein STL allein liefert keine ursprüngliche parametrische Historie. [F5]
2. [Maßblatt](../hardware/MASSE.md) anhand der tatsächlich vorhandenen Teile vervollständigen. Beschaffungsvariante und Istmaß gehören zusammen.
3. Für Motoren, Wellen, Räder, Akku, Platinen und Servos zuerst eindeutig benannte Referenzkomponenten erstellen. Kabelführung, Zugänglichkeit und Bewegungsräume einbeziehen.
4. Halter, Radadapter, Aufnahme und Bänder auf Benutzerparameter beziehen. Istmaße und Passungszugaben getrennt halten. Keine 44,6-mm-Halterung als verifiziert ausgeben, solange der Motorwert nur aus altem Gesprächskontext stammt.
5. Einheiten strikt handhaben: Fusion-Design-API verwendet intern cm und rad. Längenwerte explizit mit Einheit oder kontrollierter Umrechnung übergeben. Beispiel: `ValueInput.createByString('44.6 mm')`. [F4]
6. Baugruppenpositionen, Abstände, Kollisionen und Bohrbilder prüfen. Bei Schnitten und Exporten tatsächliche Ergebnisgeometrie rücklesen.
7. Kleine Passproben für Welle/Nabe/Motorhalter und kurzen Band-Grip-Test fertigen. Druckabweichung am realen Drucker messen; danach Parameter korrigieren.
8. Erst nach diesem Abgleich größere Druckteile freigeben. Native CAD-Version, neutralen STEP-Stand, einzelne Druckteile und Parameter-/Änderungsprotokoll gemeinsam versionieren.

Das ermöglicht präzise numerische Konstruktion. Es ersetzt keine unbekannten Istmaße, Belastungsprüfung oder Druckpassprobe und ist keine Zusage einer ungeprüften 100-%-Passung.

## Was für den ersten echten Rover-CAD-Schritt noch fehlt

- Die aktuell maßgebliche CAD-Datei und ihre Versionsbezeichnung.
- Motorbohrbild, echte nutzbare Wellenlänge, Radnabenprofil und Montage-/Freiräume.
- Bestätigung und genaue Typvarianten der Getriebemotoren, Servos und Treiber.
- Akkugehäuse einschließlich Befestigung, Steckern und Kabeln.
- Erfolgreiche Verbindung zum lokalen Fusion-Server oder ein lokal gestarteter Skripttest.

Die Schnittstellenvorbereitung steht hier als Dokumentation. Es wurden weder Plugins installiert noch die globale Clientkonfiguration oder Fusion-Einstellungen geändert.

Quellen F1–F5: [Quellenregister](QUELLEN_UND_ABGLEICH.md).
