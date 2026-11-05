# Gemeinsamer Arbeitsstand für Codex und Claude

Dieses Repository ist die gemeinsame Projektablage für Nikitas Ballsammler-Rover.
Stand dieser Ergänzung: 2026-11-05. Vor jeder Arbeit den aktuellen Remote-Stand lesen.

## Zuerst lesen

1. `README.md` für die Übersicht und neue Ergänzungen anderer Autoren.
2. `docs/PROJEKTSTAND_CODEX_2026-11-05.md` für den ergänzten Systemstand.
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

## Gleichzeitige Arbeit

- Vor dem Schreiben und unmittelbar vor dem Push den aktuellen Branch-Head prüfen.
- Änderungen anderer Autoren erhalten; niemals einen alten Gesamtstand über `main` schreiben und keinen Force-Push verwenden.
- Bei verändertem Head neu einlesen und Änderungen auf den neuen Stand übernehmen. Dateikonflikte inhaltlich zusammenführen.
- Zusammenfassungen beider Autoren gemeinsam lesen. Ein Commit synchronisiert Dateien, nicht automatisch den Kontext eines bereits geöffneten Chats.
- Keine Tokens, privaten Zugangsdaten oder sachfremden persönlichen Informationen übernehmen.

## Projektpräferenzen

3D-Druck ist ein gewünschter Bestandteil des Projekts. Kein Aluprofilrahmen oder gekauftes RC-Chassis als stillschweigender Ersatz. Nikita möchte einen zusammenhängenden, detaillierten Systemplan und passende Bauteile, keine langen Drucke auf Basis erratener Passungen. Zuerst Fahren und Aufnehmen zuverlässig machen; Schießen als spätere Erweiterung vorbereiten.
