# Schusskopf V0 für den Tisch

Aktuelle Baustufe seit 07.11.2026. Der Schusskopf wird als eigenständiger, feststehender Prüfaufbau entwickelt. Ein Padelball läuft über einen separaten Einlauf zwischen zwei gegenläufige Wurfrollen. Der Rover-Gesamtentwurf bleibt die Referenz für die spätere Integration.

[3MF-Passmodell](../cad/Schusskopf/Schusskopf_V0.3mf) · [Auslegung](../cad/Schusskopf/auslegung.json) · [Prüfbericht](../cad/Schusskopf/pruefbericht.json)

## Teile und belastbare Angaben

| Teil | Belegt | Für den Schusskopf offen |
|---|---|---|
| 2 × 775-DC-Motor | Bestellung ChgImposs, 12 V, Angebotsvariante 15.000 U/min, ohne Ritzel. Die exakte Artikelnummer 1005008221386573 findet sich im öffentlichen Preisarchiv. Gehäuse Ø44,6 × 71 mm und Welle Ø5 mm sind historische Richtmaße aus S1. | Konkrete Wicklung, Leerlauf- und Anlauf-/Blockierstrom, Wellenlänge, Stirnlochbild und Eignung für die erforderliche Drehrichtung. |
| 2 × L298N | Vorhandene Bestellung. Das ST-Datenblatt nennt 2 A Gleichstrom pro Kanal als absoluten Grenzwert des Chips. | Der bestehende L298N wird für den 775-Schussantrieb nicht freigegeben. |
| 12 V / 10 A Netzteil | 120 W Nennleistung am Ausgang laut Bestellvariante. | Belastung beim Hochlauf beider Antriebe und Verhalten der Versorgung prüfen. Für die Motorcharakterisierung einen strombegrenzten Laboraufbau verwenden. |
| 2 × Skater-Rad, 608ZZ | Ø72 mm bestellt. Separate 608ZZ mit 8 × 22 × 7 mm Nennmaß. | Für die rotierenden Schussräder sind passende, drehzahlgeeignete Rollen, Wellen und mechanisch gesicherte Naben erforderlich. Das Bauraummodell zeigt Ø72 × 24 mm als Rechenwert. |
| ESP32 oder Mega | Beides in der [Stückliste](../hardware/INVENTAR.md). Der [virtuelle Motorversuch](../simulation/motorbench/README.md) ist für beide Boards gebaut. | Später pro Rolle Drehzahl messen und die Ballfreigabe erst bei stabiler Drehzahl zulassen. Die Abschaltung des Leistungsteils ist separat auszulegen. |

Für einen bauähnlichen RS-775SM veröffentlicht Lihua bei 12 V zwei deutlich unterschiedliche Blockierströme von 21,3 und 84 A. Das sind Daten zweier anderer Wicklungen. Aus dem 775-Gehäusetyp oder der Drehzahlangabe lässt sich der Strom der gekauften ChgImposs-Variante nicht bestimmen. Ein Treiber mit dokumentierter Strombegrenzung und Strommessung ist die gesuchte Bauart. Der typische 43-A-Begrenzungswert des BTS7960-Halbrückenchips beschreibt keine garantierte Dauerlast eines Trägermoduls. Pololu dokumentiert beispielsweise die einstellbare Strombegrenzung eines G2-MOSFET-Treibers. Dessen Werkseinstellung passt nicht automatisch zu dieser Versorgung.

## Geometrie für die erste Passprobe

- Platte **240 × 232 mm**, horizontale Referenz für den Tisch, zwei Motor- und Nabenhüllen. Halter mit jeweils **4 mm seitlichem Verstellweg** vorsehen. Endgültige Bohrungen erst nach Bauteilabgleich.
- Kanal **74 mm** innen. Für den größten FIP-Ball mit Ø67,7 mm bleiben **6,3 mm Gesamtspiel** im Ein- und Auslauf. Der Bericht prüft den Abstand der Wände zur Rolle auch beim kleinsten Spalt.
- Einstellbarer Spalt **62–70 mm**. **65 mm** ist die gezeigte CAD-Stellung. Bei Ø72-mm-Rollen entspricht sie **137 mm Achsabstand**. Ob diese Einstellung den Ball greift, hängt von seinem Durchmesser und von der Nachgiebigkeit beider Oberflächen ab. Für die stromlose Passprobe mit weit geöffnetem Spalt beginnen und am tatsächlichen Ball einstellen.
- Im 3MF sind Rollen und Halter Platzhalter. Die spätere Schutzhaube, die gesicherte Nabe und das tatsächliche Motorbohrbild sind separate Konstruktionsschritte.

Fusion öffnet das Modell als Netz in Millimetern. Aus dem Repository lässt es sich mit `node cad/Schusskopf/generate.js` reproduzieren. Die erzeugte 3MF wurde auf korrekte Einheiten, 15 geschlossene Einzelnetze und ausgewählte Freiräume geprüft. Die Prüfung der Maßketten ist kein Betriebsnachweis.

## Inbetriebnahme in Stufen

1. **Stromlose Passprobe.** Bei getrennter Energieversorgung den Ball durch Einlauf, Rollenspalt und Auslauf führen. Dabei Ball, Rad und Nabe am realen Aufbau vermessen und die Einstellbarkeit prüfen.
2. **Einzelmotor charakterisieren.** Die Variantenkennung am Motor prüfen. Den Stromverlauf mit einem strombegrenzten Aufbau und fest eingespanntem Motor erfassen. Die Welle nicht mit dem 12-V-Netzteil absichtlich blockieren.
3. **Zwei Rollen als gekapselten Aufbau prüfen.** Erst nach Auswahl von Treibern, Wurfrollen, Naben und einer dimensionierten Schutzhaube mit gesicherter Einzelballzufuhr und Fangkasten testen. Die Motoren einzeln kontrolliert hochlaufen lassen. Strom, Drehzahl und Drehzahlabfall beim Abschuss erfassen. Leistungsabschaltung und Nachlauf separat prüfen.
4. **Integration nach der stationären Prüfung.** Drehzahlregelung, manuelle bzw. motorisierte Neigung und die Übergabe vom späteren Rover als getrennte Stufen ergänzen.

## Quellen

- [Preisarchiv des konkreten 775-Angebots](https://www.pricearchive.org/aliexpress.com/item/1005008221386573) und [Quellenregister S12/S13](QUELLEN_UND_ABGLEICH.md).
- [Lihua RS-775SM, Datenblatt zweier Vergleichsmotoren](https://www.lihuamotor.com/uploads/12076/files/775-Motor-Sheet.pdf?rnd=263).
- [ST L298-Datenblatt](https://www.st.com/resource/en/datasheet/l298.pdf), [Infineon BTS7960-Datenblatt](https://www.infineon.com/dgdl/BTS7960_Datasheet.pdf?folderId=db3a304412b407950112b408e8c900) und [Pololu G2-Treiber mit Strombegrenzung](https://www.pololu.com/product/2994).
- [FIP-Ballspezifikation](https://www.padelfip.com/wp-content/uploads/2026/04/Game-Ball-Certification-Process.pdf).
- [DGUV 209-074 zu trennenden Schutzeinrichtungen und Rückhaltung herausgeschleuderter Teile](https://publikationen.dguv.de/widgets/pdf/download/article/270).
