# Autodesk Fusion anbinden und maßhaltig konstruieren

> Der vollständige [V1-Digitalentwurf](ROVER_V1_CAD.md) liegt als maßhaltiges 3MF-Netzmodell vor. Der Import aller 101 Netzkörper in Fusion wurde auf dem Mac geprüft. Diese Seite dokumentiert auch die separat geprüfte native V0-Referenz.

## Auf dem Mac geprüft am 07.11.2026

Autodesk Fusion ist installiert und läuft. In Fusion ist das lokale Python-Skript [RoverReferenz](../cad/RoverReferenz/) registriert. Codex hat es in Fusion ausgeführt, sechs B-Rep-Körper erzeugt sowie ihre Außenmaße und Platzierungen mit 0,05 mm Prüftoleranz gegen den Plan geprüft. Das Ergebnis wurde als F3D und [STEP](../cad/referenz/Rover_V0_Bauraum.step) exportiert. Die tatsächlichen Werte stehen im [Prüfbericht](../cad/referenz/pruefbericht.json). Die Toleranz prüft den Modellaufbau. Die Maßquelle entscheidet weiterhin über die physische Passung.

### Modell reproduzieren

1. Repository vollständig lokal bereitstellen, damit das Skript [hardware/bauteilmasse.json](../hardware/bauteilmasse.json) findet.
2. In Fusion **Dienstprogramme → Skripte und Zusatzmodule** öffnen. Auf dem Mac geht das auch mit **Umschalt + S**. Beim ersten Mal **+ → Skript oder Zusatzmodul von Gerät** und den Ordner `cad/RoverReferenz` wählen. Auf Nikitas Mac ist der lokale Projektordner bereits registriert.
3. Nach **RoverReferenz** suchen und das Dreieck **Ausführen** in seiner Zeile anklicken.
4. Fusion erstellt eine neue Baugruppe und legt F3D, STEP und `pruefbericht.json` in einem datierten Unterordner von `builds/` ab. Die Projektgeometrie eines geöffneten Dokuments wird dabei nicht überschrieben.

### Maße aktualisieren und prüfen

- Überlieferte und später gemessene Bauteilwerte mit Herkunft im [Maßblatt](../hardware/MASSE.md) und in [bauteilmasse.json](../hardware/bauteilmasse.json) führen. Platzierung, Führungswand und Schnecken-Versuchswerte stehen separat in [layout.json](../cad/RoverReferenz/layout.json).
- Das Skript bindet Skizzen und Extrusionen von Platte, Rädern und Motorhüllen an Fusion-Benutzerparameter. Ballkörper und Einbaupositionen werden aus den Eingabedaten beim Skriptlauf gesetzt. Nach Maßänderungen die Baugruppe neu erzeugen und den Bericht kontrollieren.
- `python3 cad/RoverReferenz/RoverReferenz.py` berechnet Freiräume und Schnecken-Richtwerte ohne Fusion. Gelenke, Kollisionen und Ballkontakt werden später stufenweise geprüft. [Aktueller Schneckenrover](SCHNECKENROVER_2026-11-07.md)
- Erst danach Halter, Naben und Stützrollen an den Istmaßen auslegen und mit kurzen Passproben verifizieren. Wellen, Stecker und Bohrbilder müssen separat vermessen werden.

### Lokaler Zugriff

Der direkte MCP-Test unter `http://127.0.0.1:27182/mcp` hat am 07.11.2026 keine erfolgreiche Initialisierung geliefert. Der getestete Zugang läuft lokal über die Fusion-Oberfläche und das versionierte Skript. Eine spätere MCP-Anbindung muss sich durch eine tatsächliche Werkzeugliste und einen Maßtest in einem neuen Dokument bestätigen. Der Autodesk-Hilfezugang dient der Dokumentation. [Autodesk Fusion MCP](https://help.autodesk.com/cloudhelp/ENU/ADSKMCP-FusionDesktopMcp/files/ADSKMCP_FusionDesktopMcp_connecting_to_the_fusion_mcp_server_html.html)

Der frühere Installationsversuch auf NO NAME und seine Speicherplatzprüfung bleiben im [Installationsprotokoll vom 05.11.2026](FUSION_INSTALLATION_2026-11-05.md) dokumentiert. Für den aktuellen Lauf wurde die installierte Anwendung im lokalen Autodesk-webdeploy-Verzeichnis verwendet.

Autodesk-Referenzen zur Skriptausführung, Einheiten und zum Export stehen im [Quellenregister](QUELLEN_UND_ABGLEICH.md).
