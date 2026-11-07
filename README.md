# Ballsammler-Rover

Der Rover soll Padel-Bälle vom Boden aufnehmen, speichern und gezielt wieder ausgeben. Aktueller Stand vom 07.11.2026 mit vollständigem V1-Digitalentwurf. Die weitere Projektarbeit läuft über Codex.

## Aktueller Aufbau

Der Ball läuft mittig unter dem Rover bis zur hinteren Schnecke. Sie hebt ihn in den Trichter. Ein Vereinzelner gibt pro Auslösung einen Ball zu den beiden neigbaren Schussrädern frei. Links und rechts zielt der Rover durch Drehen des Fahrwerks. Als Kamera ist ein altes Android vorgesehen, die Erkennung läuft zunächst am Mac. Die ersten Module werden am vorhandenen Netzteil getestet.

**Aktuelle Baustufe ist der stationäre Schusskopf.** Der Nutzer priorisiert den Einzelball-Abschuss am Tisch. Fahrwerk und Sammelmechanismus folgen später. [Schusskopf V0, Bauraummodell und Prüfschritte](docs/SCHUSSKOPF_V0.md)

## CAD und Projektdateien

- [V1-Modell (.3mf)](cad/v1/Rover_V1.3mf), [3D-Vorschau](cad/v1/Vorschau.svg) und [Auslegung mit Prüfergebnissen](docs/ROVER_V1_CAD.md). Der Import der 101 Netzkörper ist in Fusion auf dem Mac geprüft.

- [Elektronikversuch](simulation/motorbench/README.md) für ESP32 und Arduino Mega mit Wokwi-Schaltbild und lokalem Logiktest.
- [Fusion-Anbindung](docs/FUSION_ANBINDUNG.md) mit dem auf dem Mac getesteten Skript und den Prüfergebnissen.
- Historische V0-[STEP-Referenz](cad/referenz/Rover_V0_Bauraum.step) und [Prüfbericht](cad/referenz/pruefbericht.json) für Platte, Rad- und Motorhüllen und Referenzball. Maßherkunft und Einbauannahmen sind separat dokumentiert.
- [Hardwarebestand](hardware/INVENTAR.md), [Maße](hardware/MASSE.md), [Quellenregister](docs/QUELLEN_UND_ABGLEICH.md) und [Arbeitsregeln](AGENTS.md).
- [Historischer Projektstand vom 05.11.2026](docs/PROJEKTSTAND_CODEX_2026-11-05.md), [Doppelband-Konzept](ballsammler-rover-aufsammelmechanismus.md), [Originalchat](rover_chat_komplett.txt) und [Firmware-Archiv](firmware/legacy/README.md).
