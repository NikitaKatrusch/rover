# Ballsammler-Rover

Der Rover soll Padel-Bälle vom Boden aufnehmen, speichern und gezielt wieder ausgeben. Aktueller Stand vom 07.11.2026 mit vollständigem V1-Digitalentwurf. Die weitere Projektarbeit läuft über Codex.

## Aktueller Aufbau

Der Ball läuft mittig unter dem Rover bis zur hinteren Schnecke. Sie hebt ihn in den Trichter. Ein Vereinzelner gibt pro Auslösung einen Ball zu den beiden neigbaren Schussrädern frei. Links und rechts zielt der Rover durch Drehen des Fahrwerks. Als Kamera ist ein altes Android vorgesehen, die Erkennung läuft zunächst am Mac. Die ersten Module werden am vorhandenen Netzteil getestet.

Priorität haben der freie Weg unter dem Chassis und die zuverlässige Aufnahme in die erste Schneckenwindung. Die Baugruppen für Speicher, Vereinzelung und Schuss bauen auf dieser Schnittstelle auf. Der aktuelle Aufbau und die Abnahmeschritte stehen im [Entwicklungsstand](docs/SCHNECKENROVER_2026-11-07.md).

## CAD und Projektdateien

- [V1-Modell (.3mf)](cad/v1/Rover_V1.3mf), [3D-Vorschau](cad/v1/Vorschau.svg) und [Auslegung mit Prüfergebnissen](docs/ROVER_V1_CAD.md). Die 3MF ist ein in Fusion importierbares Netzmodell.

- [Fusion-Anbindung](docs/FUSION_ANBINDUNG.md) mit dem auf dem Mac getesteten Skript und den Prüfergebnissen.
- Historische V0-[STEP-Referenz](cad/referenz/Rover_V0_Bauraum.step) und [Prüfbericht](cad/referenz/pruefbericht.json) für Platte, Rad- und Motorhüllen und Referenzball. Maßherkunft und Einbauannahmen sind separat dokumentiert.
- [Hardwarebestand](hardware/INVENTAR.md), [Maße](hardware/MASSE.md), [Quellenregister](docs/QUELLEN_UND_ABGLEICH.md) und [Arbeitsregeln](AGENTS.md).
- [Historischer Projektstand vom 05.11.2026](docs/PROJEKTSTAND_CODEX_2026-11-05.md), [Doppelband-Konzept](ballsammler-rover-aufsammelmechanismus.md), [Originalchat](rover_chat_komplett.txt) und [Firmware-Archiv](firmware/legacy/README.md).
