# Padel-Schusskopf mit Neigeprüfstand

Stand 08.11.2026. Dieser Aufbau ist für die **stromlose Pass-, Winkel- und Einzugsprobe** ausgelegt. Er prüft die Ø72-mm-Skaterrollen auf festen Achsen und die Neigung auf einer Tischplatte. Die 775-Halter, angetriebenen Naben und die Rückhaltehaube werden nach Bauteilabgleich als eigene Baugruppe ausgelegt.

## Druckteile und Montage

| STL | Anzahl | Funktion |
|---|---:|---|
| `deck.stl` | 1 | Bewegliche Platte 195 × 220 × 8 mm |
| `guide.stl` | 1 | Ballführung 68 mm innen für den Referenzball Ø66 mm |
| `roller_stand.stl` | 2 | Abstützung je einer stillstehenden Ø8-mm-Achse |
| `trunnion_left.stl`, `trunnion_right.stl` | je 1 | Schwenklager und Rastbolzen an der beweglichen Platte |
| `cheek_left.stl`, `cheek_right.stl` | je 1 | Feste Wangen mit den Rastungen 0°, 20°, 35°, 45°, 55° und 65° |

Links und rechts gelten vom Einlauf in Schussrichtung. Die Teile sind in Drucklage exportiert. Zuerst **einen Achsständer** zur Passprobe drucken. Rollenbreite, Lagerbohrung, Außen-Ø und Ball-Ø messen. Die Kugelmitte soll am Einlauf ungefähr auf Rollenmitte liegen. Das Modell nimmt 24 mm Rollenbreite, 8 mm Lagerbohrung und eine 1-mm-Distanz über dem Achsständer an. Eine Distanzscheibe darf nur den Lagerinnenring berühren. Falls beide Lagerinnenringe axial geklemmt werden, braucht das Rad dazwischen eine passende Innenhülse. Alternativ für die stromlose Probe axial mit Spiel sichern.

1. Beide Wangen auf einer planen, am Tisch gesicherten Grundplatte montieren. Das Paar hat außen rund 266 mm Breite. Eine Grundplatte um 230 × 290 mm bietet Platz für die vier Durchgangsschrauben.
2. Führung, beide beweglichen Schwenkplatten und beide Achsständer mit M5-Schrauben auf der beweglichen Platte befestigen. Bei 8 mm Grundstärke passen M5×25 als Ausgangsmaß für diese Verbindungen. Die Ø5,6-mm-Löcher und die Löcher für die Achsen zuerst am Testdruck prüfen.
3. Je Seite einen M5-Drehbolzen mit Scheiben und selbstsichernder Mutter einsetzen. Je Seite einen separaten Rastbolzen einsetzen. Bei 10 mm beweglicher Wange, 1 mm Spalt und 12 mm fester Wange ist M5×35 ein Ausgangsmaß für diese vier Bolzen. Die Befestigung der festen Wangen richtet sich nach der Dicke der Grundplatte.
4. Rollen auf zwei Ø8-mm-Achsen mit glattem Sitz an den Lagerinnenringen montieren. Die Ständer haben unten Platz für eine M8-Sechskantmutter. Die Achslänge am echten Rad festlegen. Einstellbereich des nominellen Rollenspalts 62–70 mm. Zum Anfangen einen Spalt größer als den gemessenen Ball einstellen und den Spalt schrittweise enger stellen.
5. Zuerst bei 0° beide Rollen von Hand in Einzugsrichtung drehen. Dann auf beiden Seiten bei 45° einrasten. Der Ball braucht bei steiler Lage eine definierte Zuführung bis an den Spalt. Für die stromlose Probe einen Schieber verwenden. Eine spätere Einzelballzufuhr und die Ballführung bewegen sich mit der Platte.

Die Schwenkachse verläuft quer zur Schussrichtung auf Höhe der Ballmitte. Bei 65° bleiben im CAD rund 20,6 mm zwischen Plattenunterkante und Grundebene und mindestens 10,6 mm zur 10-mm-Fußebene. Überstehende Schrauben und Kabel beim Aufbau prüfen. Später kann ein Antrieb an den Schwenkrahmen angreifen. Seine Dimensionierung braucht die Masse und Schwerpunktlage von Motoren, Haltern und Haube.

## Flugbahn für den 20-m-Court

Beispiel entlang der Court-Längsachse. Der Schusskopf steht 2 m vor der eigenen Glaswand. Netz bei 8 m und gegenüberliegende Glaswand bei 18 m ab Abwurf. Ziel ist der erste Bodenkontakt bei **16 m ab Schusskopf**. Abwurfhöhe 0,50 m, Ball Ø66 mm und 58 g. Ruhende Luft bei 1,20 kg/m³, quadratischer Widerstand mit geschätztem C_D = 0,55. Spin und Auftrieb bleiben unberücksichtigt. [FIP-Abmessungen](https://www.padelfip.com/wp-content/uploads/2025/12/FIP_Rules-of-Padel.pdf) · [Luftwiderstand an Sportbällen](https://www.physics.sydney.edu.au/~cross/TRAJECTORIES/Sports%20Balls.pdf)

| Abwurfwinkel | Nötige Ballgeschwindigkeit | Höhe über Boden am Netz | Höchster Punkt |
|---|---:|---:|---:|
| 35° | 14,3 m/s | 3,5 m | 3,5 m |
| 45° | 14,1 m/s | 4,9 m | 4,9 m |
| 55° | 14,9 m/s | 6,8 m | 6,8 m |
| 65° | 17,2 m/s | 10,3 m | 10,3 m |

**45° ist der Startwert für den hohen, tiefen Lob.** Bei 55° oder 65° entscheidet die tatsächliche Hallenhöhe einschließlich Lampen und Trägern. Wenn der Kopf auf dem Boden statt in 0,50 m Abwurfhöhe steht, die Flugbahn mit der tatsächlichen Auslasshöhe neu rechnen.

In MuJoCo 4.0.0 wurden beide DC-Motoren, die Rollen, der geneigte Einlauf und der anschließende Freiflug gerechnet. Der Ball wird vor dem Kontakt mit 1 m/s bergauf zugeführt. Bei 45°, 8.000 U/min Anfangsdrehzahl und dem bisherigen V0-Kontakt (65 mm Spalt, μ = 0,24, Kontaktzeitkonstante 12 ms) ergab die Simulation 1,75 m/s am Auslass und 0,57 m bis zum ersten Bodenkontakt. Ein optimistisches Modell mit 62 mm Spalt, μ = 0,60 und 1,5 ms Kontaktzeitkonstante ergab 13,64 m/s, 15,58 m Flugweite und 4,84 m Scheitelhöhe. Halbierter Zeitschritt ergab 15,51 m. **Das ist ein Zielversuch mit angenommenem Kontakt.** Die Zahl 8.000 U/min ist ein Simulationswert. Für die gelieferten Skaterrollen und die 775-Motoren gibt es noch keinen entsprechenden Leistungs- oder Drehzahltest.

[MuJoCo-Lob öffnen](https://live.mujoco.org/?model=github:NikitaKatrusch/rover/main/cad/Schusskopf/schusskopf-lob.xml) · Pause drücken, Keyframe `Reichweitentest` wählen, dann Run. Die Kamera `Flugbahn` zeigt den Bereich bis zur Landung. Das Netz ist eine Sichtmarke. [Parameter](../mujoco-lob.json) · [MJCF-Datei](../schusskopf-lob.xml) · [Luftkräfte in MuJoCo](https://mujoco.readthedocs.io/en/latest/computation/fluid.html)

## Verkabelung in zwei Stufen

| Verbindung | Aufbau |
|---|---|
| USB → Mega 2560 | Versorgt die Logik. Für den bereits vorhandenen Einkanal-Logiktest nutzt der Mega D6 für PWM, D7/D8 für die Richtung und GND als Bezug. |
| Netzteil 12 V → Motortreiber | Separater Leistungszweig mit DC-tauglicher Abschaltung und passend zu Leitung und Treibern ausgelegtem Überstromschutz. Die zulässige Last richtet sich auch nach Stecker und Netzteilverhalten unter Last. |
| Treiberausgang → je ein 775 | Je ein geeigneter strombegrenzter Kanal pro Motor. Im feststehenden, gesicherten Aufbau die Drehrichtung so festlegen, dass beide inneren Laufflächen zum Auslauf laufen. |
| Mega → Motortreiber | Je Kanal PWM und Richtung bzw. Enable passend zum gewählten Modul. Bei nicht isolierten Signalen einen gemeinsamen Massebezug vorsehen und die Motorströme direkt zur Leistungsversorgung zurückführen. |
| Drehzahlsensoren → Mega | Je Rolle einen eigenen Messkanal vorsehen. Die Ballfreigabe soll erst erfolgen, wenn beide Drehzahlen im Sollfenster liegen. |
| Kabel am Schwenkpunkt | Leistungsversorgung und Controller auf dem festen Fuß. Motorleitungen mit Zugentlastung und einer Bewegungsschlaufe am Drehpunkt führen. Die Schlaufe bei 0° und 65° auf Klemmstellen prüfen. |

Der **L298N bleibt für diesen 775-Leistungspfad außen vor**. ST nennt 2 A pro Brücke bei Gleichstrom als absoluten Grenzwert. Der Anlaufstrom der konkret gekauften Motoren und das Verhalten des 12-V-/10-A-Netzteils bei zwei Starts sind offen. Zuerst den [vorhandenen Logiktest](../../../simulation/motorbench/README.md) per USB prüfen. Für den Motorlauf folgen nach Auswahl der Treiber die Klemmenbelegung, Strombegrenzung und eine Messung am einzeln fest eingespannten Motor. Vor einem Rollenantrieb braucht die Baugruppe drehzahlgeeignete Rollen, gesicherte Naben, eine dimensionierte Rückhaltehaube und eine geschützte Zuführung mit Fangkasten. [ST L298-Datenblatt](https://www.st.com/resource/en/datasheet/l298.pdf) · [Beispiel für einen Treiber mit einstellbarer Strombegrenzung](https://www.pololu.com/product/2991) · [DGUV zu trennenden Schutzeinrichtungen](https://publikationen.dguv.de/widgets/pdf/download/article/270)

Für den Motoreinbau am 775 zusätzlich Wellen-Ø, nutzbare Wellenlänge, Zentrierbund und Stirnlochbild messen. Am Skaterrad Breite zwischen den Lagerinnenringen, Tiefe der Lagersitze und die Geometrie des Radkerns erfassen. Die Rollen auf den passiven Ständern laufen auf ihren vorhandenen Lagern. Beim späteren Antrieb muss eine geeignete Nabe das Moment am Radkörper einleiten.

## Dateien erzeugen

```sh
for part in deck guide roller_stand trunnion_left trunnion_right cheek_left cheek_right; do
  openscad -D "part=\"$part\"" -o "$part.stl" neigepruefstand.scad
done
```

Für einen anderen Ball die Variable `guide_width` anpassen und den bewegten Aufbau kontrollieren. Die angegebenen Winkel sind Raststellungen der Plattform. Der tatsächliche Ballwinkel ergibt sich aus der Kontakt- und Zuführdynamik.
