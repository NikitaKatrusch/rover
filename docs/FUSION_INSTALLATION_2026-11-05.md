# Fusion-Installation auf NO NAME – Versuch vom 05.11.2026

## Ergebnis

**Fusion wurde noch nicht installiert.** Das externe APFS-Image und die Umleitung sind eingerichtet. Der grafische Autodesk-Installer scheitert weiterhin an seiner Vorprüfung des internen freien Speicherplatzes. Es existiert noch kein Produktionsordner mit einer installierten Fusion-App im externen Ziel.

## Durchgeführte Schritte

1. NO NAME wurde als bestehendes FAT32-Volume mit rund 94,7 GB freiem Platz geprüft. Seine bestehenden Daten wurden nicht formatiert oder verschoben.
2. Im Festplattendienstprogramm wurde `/Volumes/NO NAME/FusionExtern.sparsebundle` angelegt: mitwachsendes Image-Bundle, APFS, logische Größe 40 GB, Volumename FusionExtern. Es belegt nur den aktuell benötigten Platz und ist unter `/Volumes/FusionExtern` eingebunden.
3. Der bisherige Ordner `~/Library/Application Support/Autodesk/webdeploy` enthielt nur den Unterordner meta. Seine zwei Dateien wurden auf das externe Image kopiert und byteweise per SHA-256 verglichen.
4. Das Original wurde unter `~/Library/Application Support/Autodesk/webdeploy.before-external-20261105` erhalten.
5. Am normalen Installationsort wurde ein symbolischer Link auf `/Volumes/FusionExtern/webdeploy` angelegt. Der Link und das getrennt eingebundene Zielvolume wurden geprüft.
6. Der vorhandene Autodesk-Installer wurde geöffnet. Seine Signatur weist Autodesk als Herausgeber mit TeamIdentifier XXKJ396S2Y aus.
7. Netzwerk-, Zertifikats- und Ordnerprüfungen des Installers waren erfolgreich. Die Speicherprüfung schlug fehl; anschließend wurde der Versuch abgebrochen.
8. Zusätzlich wurde die lokale CLI-Hilfe gelesen. `--root` gehört dort zum Abrufprozess, nicht zu einer regulären externen Installation. Eine Abfrage mit der nicht in der Hilfe beschriebenen Option `--installlocation` endete mit Schreibschutz-/Berechtigungsfehlern an der ausgelagerten Registry. Daraus folgt kein Nachweis, dass diese Option die Installation löst.

## Konkreter Blocker

Im Installerprotokoll `~/Library/Logs/autodesk.webdeploy.streamer.log` steht beim Versuch um 18:06 Uhr Ortszeit:

- Erwarteter freier Speicher: rund **14,2929 GiB**.
- Gemeldeter freier interner Speicher: rund **12,4945 GiB**.
- Differenz: rund **1,80 GiB**, entsprechend etwa **1,93 GB** dezimal.

Die UI nennt ihre Werte GB, obwohl die protokollierten Zahlen binären Größen entsprechen. Die Anzeige „Schaffen Sie 14.29 GB Speicherplatz“ bedeutet hier nicht, dass zusätzlich 14 GB fehlen. Praktisch werden noch etwa 2 GB interner Platz benötigt; der verfügbare Platz kann während anderer Arbeiten schwanken.

Die Umleitung des webdeploy-Ordners verlagert diese Vorprüfung nicht auf das externe Volume. Es wurden keine allgemeinen Vorprüfungen oder Zertifikatsprüfungen abgeschaltet.

## Vorbereiteter Zustand und Wiederaufnahme

- NO NAME anschließen und `FusionExtern.sparsebundle` öffnen, damit das Volume exakt als FusionExtern eingebunden ist.
- Linkziel `/Volumes/FusionExtern/webdeploy` prüfen.
- Etwa 2–3 GB zusätzlichen internen Platz schaffen und den signierten Autodesk-Installer erneut starten.
- Erst eine abgeschlossene Installation, eine tatsächlich vorhandene App und ein erfolgreicher Start gelten als Erfolg. Updates und Lauf auf dem Stick sind noch nicht getestet.
- Fusion-MCP ist weiterhin nicht eingerichtet.

Falls die externe Lösung verworfen wird, kann nach Beenden aller Autodesk-Installationsprozesse ausschließlich der als Symlink geprüfte webdeploy-Eintrag entfernt und der Sicherungsordner auf webdeploy zurückbenannt werden. Das externe Image und die Sicherung nicht als vermeintlich überflüssige Nutzerdaten löschen.

Dies ist ein Versuch einer nicht offiziell unterstützten externen Installation, keine getestete Dauerlösung. Der aktuelle Stand ist ausdrücklich eine vorbereitete, aber blockierte Installation.
