# Projektarbeit mit Codex

Dieses Repository ist die zentrale Projektablage für Nikitas Ballsammler-Rover.
Nikita hat am 05.11.2026 festgelegt: Ab jetzt übernimmt Codex die weitere Projektarbeit allein. Bestehende Beiträge und Quellen bleiben als Projektwissen erhalten. Eine Abstimmung mit Claude ist kein Arbeitsschritt mehr.
Stand dieser Ergänzung: 2026-11-07. Vor jeder Arbeit den aktuellen Remote-Stand lesen.

## Zuerst lesen

1. `README.md` und `docs/SCHUSSKOPF_V0.md` für die aktuelle Baustufe.
2. `docs/PROJEKTSTAND_CODEX_2026-11-05.md` für den historischen Systemstand.
3. `hardware/INVENTAR.md` und `hardware/MASSE.md` vor Teilewahl oder CAD.
4. `docs/QUELLEN_UND_ABGLEICH.md` für Quellen, Widersprüche und Nachweise.
5. `docs/FUSION_ANBINDUNG.md` vor Arbeiten an Fusion.

## Verlässlichkeit

- Vorhanden, im Warenkorb, empfohlen, gezeichnet, gedruckt und funktionierend sind verschiedene Zustände. Nicht ineinander umdeuten.
- Eine alte Assistentenaussage ist weder eine neue Nutzerbestätigung noch ein Messprotokoll. Neuere Nutzeraussagen und tatsächliche Dateien haben Vorrang.
- Bauteilbezeichnungen wie 775, JGB37-520, MG996R oder ESP32 bestimmen kein vollständiges Bohrbild. Unbekannte Maße bleiben unbekannt.
- CAD-Vorschläge und historische Maße als solche kennzeichnen. Druckfreigabe erst nach dokumentierter Passprobe der maßkritischen Schnittstellen.
- Firmware unter `firmware/legacy/` ist archivierter Altstand, keine freigegebene Steuerung des endgültigen Rovers.
- Änderungen an Mechanik, Elektronik und Software mit Quelle, Datum, betroffener Schnittstelle und Prüfergebnis dokumentieren.

## Versionspflege

- Vor dem Schreiben und unmittelbar vor dem Push den aktuellen Branch-Head prüfen.
- Änderungen anderer Autoren erhalten; niemals einen alten Gesamtstand über `main` schreiben und keinen Force-Push verwenden.
- Bei verändertem Head neu einlesen und Änderungen auf den neuen Stand übernehmen. Dateikonflikte inhaltlich zusammenführen.
- Den aktuellen dokumentierten Projektstand fortführen. Frühere Zusammenfassungen als Quellen berücksichtigen; für den nächsten Schritt keinen Beitrag oder Abgleich mit einem zweiten Assistenten voraussetzen.
- Keine Tokens, privaten Zugangsdaten oder sachfremden persönlichen Informationen übernehmen.

## Projektpräferenzen

3D-Druck ist ein gewünschter Bestandteil des Projekts. Kein Aluprofilrahmen oder gekauftes RC-Chassis als stillschweigender Ersatz. Nikita möchte einen zusammenhängenden, detaillierten Systemplan und passende Bauteile, keine langen Drucke auf Basis erratener Passungen. Seit dem 07.11.2026 zuerst den stationären Schusskopf mit Einzelballzufuhr entwickeln. Fahrwerk und Sammlung folgen nach der Prüfung am Tisch.
