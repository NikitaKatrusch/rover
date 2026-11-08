# Schusskopf V0 für den Tisch

Aktuelle Baustufe seit 07.11.2026. Der Schusskopf wird als eigenständiger, feststehender Prüfaufbau entwickelt. Ein Padelball läuft über einen separaten Einlauf zwischen zwei gegenläufige Wurfrollen. Der Rover-Gesamtentwurf bleibt die Referenz für die spätere Integration.

[3MF-Passmodell](../cad/Schusskopf/Schusskopf_V0.3mf) · [Auslegung](../cad/Schusskopf/auslegung.json) · [Prüfbericht](../cad/Schusskopf/pruefbericht.json)

Für den 20-m-Court gibt es einen [Neigeprüfstand mit druckbaren Achsständern, Lob-Simulation und Anschlussplan](../cad/Schusskopf/Neigepruefstand/README.md).

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

## Einzug zwischen den Rollen prüfen

In Schussrichtung gesehen bewegen sich die beiden einander zugewandten Rollenflächen beide zum Auslauf. Beim ersten Kontakt drückt die Rolle den Ball entlang der schrägen Verbindungslinie ihrer Mittelpunkte. Diese Kraft hat einen Anteil zurück zum Einlauf. Die Reibung muss diesen Anteil überwinden. Eine seitliche Abweichung führt bei den betrachteten Einstellungen zunächst zum Kontakt mit nur einer Rolle. Eine mittige Führung reduziert dieses Risiko.

Die Draufsicht rechnet mit zwei Ø72-mm-Kreisquerschnitten und einem unverformten Ball auf Höhe der Rollenmitte. Bei zentrierter Zuführung ist die halbe Rollenachsdistanz `a = R + Spalt/2`. Ist der Ball größer als der Spalt, liegt der erste Kontakt `x = sqrt((R + r)^2 − a^2)` vor der Rollenachse. Die theoretische Einzugsgrenze liegt dann bei `µ = x/a`. Bei Ball-Ø kleiner oder gleich Spalt entsteht auf der Mittellinie kein Klemmdruck. Für einseitigen Erstkontakt wird nur die Lage berechnet. Rundprofil, Ballverformung, Rollendynamik und tatsächliche Reibung bleiben praktisch zu prüfen. [Quelle zur Geometrie des Einzugs](https://www.ideals.illinois.edu/items/2169/bitstreams/8172/data.pdf)

| Ball-Ø | Spalt | Versatz | Erstkontakt vor der Achse | Ergebnis des vereinfachten Modells |
|---:|---:|---:|---:|---|
| 63,5 mm | 65 mm | 0 mm | — | 1,5 mm Luft |
| 66,0 mm | 65 mm | 0 mm | 8,29 mm | Beidseitig, µ ≈ 0,121 |
| 67,7 mm | 65 mm | 0 mm | 13,67 mm | Beidseitig, µ ≈ 0,200 |
| 67,7 mm | 62 mm | 0 mm | 19,75 mm | Beidseitig, µ ≈ 0,295 |
| 67,7 mm | 65 mm | 3 mm | 24,26 mm | Einseitiger Erstkontakt |

**Stromlose Passprobe mit den bestellten Skaterrollen.** Tatsächlichen Ball und Rollen messen und die breiteste Rollenfläche auf Ballmitte ausrichten. Auf festen Testachsen frei laufend montieren. Mit einem Spalt knapp über dem tatsächlichen Ball-Ø zuerst den freien Durchgang kontrollieren. Dann in kleinen Schritten enger stellen. Den Ball mit einem Schieber mittig bis an die Rollen bringen, den Schieber entlasten und beide Rollen von außen langsam in Einzugsrichtung von Hand drehen. Pro Einstellung festhalten, ob der Ball selbstständig eingezogen wird, zurückkommt oder klemmt. Danach einen leicht versetzten Start wiederholen. Bei zurückgedrücktem Ball zuerst Zentrierung, Kontakthöhe und einen etwas weiteren Spalt vergleichen. Eine spätere gesicherte Einzelballzufuhr kann den Ball bei Bedarf definiert bis in den Greifbereich bringen.

Die Lager der Skaterrollen lassen den Radkörper gegenüber der Achse frei laufen. Für einen späteren Motorantrieb muss die Nabe das Drehmoment am Radkörper übertragen. Die vorhandenen Skaterrollen dienen hier der stromlosen Passprobe. Für Motorbetrieb sind Wurfrollen und Naben mit passender Drehzahleignung und ein geschützter Einzug zu prüfen. [Beispiel für Radaufbau mit Achse und Lagern](https://www.rollerblade.com/assets/pdf/18_RB_Skate_To_Ski_Pamphlet_Print_v2.pdf)

## 3D-Kontaktversuch und einstellbare Führung

Der [3D-Solver](../cad/Schusskopf/simulate.js) integriert die räumliche Bewegung und Rotation einer 58-g-Kugel im CAD-Einlauf. Boden, Führung und zwei Ø72-mm-Rollen mit 24 mm Breite haben Kontaktkräfte aus Feder, Dämpfung und begrenzter Gleitreibung. Die Rollen behalten eine konstante Oberflächengeschwindigkeit von 2 m/s. Ball und Rollen werden durch idealisierte Formen angenähert. Das Modell enthält keine gemessene Verformung, kein gemessenes Reifenprofil, kein Motormoment und keinen elektrischen Antrieb.

Der [Variantenvergleich](../cad/Schusskopf/sweep.js) prüft 60 Einstellungen mit je 72 Modellfällen, insgesamt 4.320 Läufe. Er variiert drei Ballgrößen (63,5, 66 und 67,7 mm), Reibwerte von 0,12, 0,20 und 0,32, effektive Kontaktsteifigkeit (3 bzw. 8 N/mm), Zuführgeschwindigkeit (0,10 bzw. 0,22 m/s) und Mittellage bzw. 90 % des seitlichen Spiels. Die Reib- und Steifigkeitswerte sind Annahmen für die Sensitivitätsprüfung. Als Einzug zählt ein beidseitiger Rollenkontakt und das Erreichen des Auslaufs mit einer Geschwindigkeit mindestens 0,05 m/s über der Zuführgeschwindigkeit.

| Einstellung | Auslauf mit Einzug |
|---|---:|
| CAD-Referenz, Spalt 65 mm und Führung 74 mm | 43 von 72 |
| Bester fester Spalt mit bestehender Führung, 63 mm | 54 von 72 |
| Ball-Ø minus 0,5 mm und Führung Ball-Ø plus 2 mm | 72 von 72 bei Nennmaß, 9 von 72 bei 0,4 mm größerem Spalt |
| Ball-Ø minus 1,0 mm und Führung Ball-Ø plus 2 mm | 72 von 72 bei Nennmaß und bei jeweils −0,4 und +0,4 mm Spaltabweichung |

Die Zusatzprüfung wiederholt sechs Toleranzfälle mit halbiertem Zeitschritt. Die Einzug-Zählwerte blieben gleich. Bei angepasstem Spalt von Ball-Ø minus 1 mm und unveränderter 74-mm-Führung gab es bei Nennmaß ebenfalls 72 Einzüge. Die 2-mm-Zugabe ist ein separat getesteter Vorschlag für eine engere Zentrierung. Die [Ergebnisdatei](../cad/Schusskopf/einzug-simulation.json) lässt sich mit `node cad/Schusskopf/sweep.js` reproduzieren.

Für den ersten Prototyp Rollenspalt und Führung auf den gemessenen Ball einstellen. Bei Ø66 mm ergeben sich **65 mm Rollenspalt und 68 mm Führungsbreite**. Die Rechnung dient als Startpunkt für eine stromlose Probe mit tatsächlichen Rollen. Die unbekannten Material- und Profilwerte verhindern eine Betriebsfreigabe oder eine Aussage zur Schussweite.

## Dynamischer Test in MuJoCo

Das [MuJoCo-Modell](../cad/Schusskopf/schusskopf.xml) übernimmt die Abmessungen des Einlaufs aus dem CAD. Es enthält zwei rotierende Körper auf eigenen Drehgelenken, zwei native spannungsgesteuerte Gleichstrommotoren, Rollen- und Rotorträgheit sowie Ballkontakte mit Reibung. Die Wellen können durch Kontaktkräfte langsamer werden. Die Drehmarken an beiden Rollen rotieren mit den Körpern.

- [Modell in MuJoCo Live öffnen](https://live.mujoco.org/?model=github:NikitaKatrusch/rover/main/cad/Schusskopf/schusskopf.xml).
- Der Schlüsselzustand **Einzug** setzt beide Wellen auf entgegengesetzte 600 U/min, legt je eine modellierte Klemmenspannung von 0,48 V mit passendem Vorzeichen an und lässt den Ball langsam in den Spalt rollen. **Stillstand** setzt Drehzahlen und Ansteuerung auf null.
- Die Sensoren erfassen die beiden Wellengeschwindigkeiten in rad/s, die Motormomente in N·m und die Ballgeschwindigkeit in m/s. Drehzahl in U/min ergibt sich aus rad/s × 60 ÷ 2π.
- `python3 cad/Schusskopf/generate_mujoco.py` erzeugt die MJCF-Datei aus CAD-Abmessungen und [Versuchsparametern](../cad/Schusskopf/mujoco-setup.json). Die Modelldatei benötigt MuJoCo 3.17 mit dem nativen `dcmotor`-Aktuator.

**Modellannahmen.** Die Spannung 12 V und die Angebotsdrehzahl 15.000 U/min stammen aus der Stückliste. Wicklungswiderstand, Induktivität, Leerlaufstrom, Rotorträgheit, Rollenmasse und Kontaktparameter sind Annahmen. Das Modell verwendet 66 mm Ball-Ø, 65 mm Spalt und 68 mm Führung. Es simuliert die Mechanik und den vereinfachten elektrischen Motor bei vorgegebener Klemmenspannung. Ein tatsächlicher PWM-Treiber, dessen Netzteilverhalten und die Materialkennlinie der konkreten Rolle sind separat zu erfassen. Die simulierten Ströme und Drehzahlen sind Versuchswerte.

[MuJoCo Live und Modellimport](https://mujoco.readthedocs.io/en/stable/studio/web_viewers.html) · [DC-Motormodell](https://mujoco.readthedocs.io/en/stable/XMLreference.html#actuator-dcmotor)

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
