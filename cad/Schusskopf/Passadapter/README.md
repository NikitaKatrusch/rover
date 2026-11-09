# Passadapter 775 und Skater-Radkern

Stand 09.11.2026. Nikita hat am Rad nach Ausbau des Kugellagers **Ø19,43 mm innen** und an der 775-Motorwelle **Ø5,01 mm** mit einem Digitalmessschieber gemessen. Die genaue Lage und axiale Länge der Ø19,43-mm-Stufe sind noch offen. Die Produktangabe von ca. Ø22 mm beschreibt den Lagersitz.

Der Anschlag setzt außen am Rad an. Der 12 mm lange Zapfen prüft die Zentrierung im Radkern. Die Einstecktiefe ist ein Versuchsmaß. Alle drei Teile haben eine nominelle Durchgangsbohrung von Ø5,25 mm. Damit bleibt die Wellenseite beim Vergleich der Radpassungen gleich.

| Radzapfen | Durchmesserspiel gegenüber Ø19,43 mm |
|---|---:|
| Ø19,15 mm | 0,28 mm |
| Ø19,25 mm | 0,18 mm |
| Ø19,35 mm | 0,08 mm |

**Stromlose Passprobe.** Zuerst das mittlere Teil probieren. Es soll sich von Hand einsetzen und herausziehen lassen. Wenn der Zapfen vor dem Anliegen des Anschlags stoppt, die Einstecktiefe und die Kontur der Bohrungsstufe erfassen. Wenn der Zapfen passt, aber wackelt, die nächstgrößere Variante probieren. Die Welle separat in die Ø5,25-mm-Bohrung stecken und prüfen, ob die Fase und der Schaft frei hineingleiten. Alle Abmessungen am Druckteil sind Sollmaße.

Die Druckteile tragen `TEST` und besitzen keine Klemmung oder Axialsicherung. Sie dienen der Passprobe bei ausgeschaltetem und abgeklemmtem Motor. Die spätere Antriebsnabe braucht eine gesicherte Verbindung mit der Motorwelle, eine drehmomentübertragende Verbindung mit dem Radkern und eine Auslegung für die Betriebsdrehzahl. Dafür sind die Tiefe von der Radseite bis zum Beginn der Ø19,43-mm-Stufe, deren axiale Länge sowie die nutzbare Wellenlänge zu erfassen.

Die drei geschlossenen Netze wurden auf Sollmaße und zusammen in Bambu Studio für den P1S auf Slicebarkeit geprüft. Die mechanische Passprobe am Rad und an der Welle steht aus.

STL-Export aus diesem Verzeichnis am Beispiel der mittleren Variante.

```sh
openscad -o passadapter_1925.stl -D 'rad_durchmesser=19.25' -D 'beschriftung="19.25"' passadapter.scad
```

## Materialarme Passprobe

Der [Schnelltest](passadapter_schnelltest.scad) hat zwei konzentrische Wände mit 1,4 mm Nennwandstärke, eine Einstecktiefe von 12 mm und eine durchgehende Bohrung von Ø5,25 mm. Der Anschlag misst Ø26 × 1,6 mm. Der offene Raum zwischen den Wänden spart Material. Die Größen sind im P1S-Projekt über die Plattennamen gekennzeichnet.

| Platte | Radzapfen | Reine Druckzeit | Gesamtzeit | Material |
|---|---:|---:|---:|---:|
| 1 | Ø19,25 mm | 5:11 min | 11:24 min | 2,73 g |
| 2 | Ø19,15 mm | 5:12 min | 11:26 min | 2,73 g |
| 3 | Ø19,35 mm | 5:14 min | 11:28 min | 2,74 g |

Bambu Studio 2.6.0.51 am 09.11.2026, P1S mit 0,4-mm-Düse, PLA, 0,28-mm-Schichten und 0 % Infill. Alle drei Netze sind geschlossen und ließen sich einzeln slicen. Die Zeitwerte sind Schätzungen aus dem Slicer. Zuerst Platte 1 drucken und die Passung von Hand am stromlosen Aufbau prüfen. Die Größen auf den anderen Platten bei Bedarf einzeln verwenden. Die reale Passprobe steht aus.

```sh
openscad -o schnelltest_1925.stl -D 'rad_durchmesser=19.25' passadapter_schnelltest.scad
```
