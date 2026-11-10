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

Der [Schnelltest](passadapter_schnelltest.scad) hat zwei konzentrische Wände mit 1,4 mm Nennwandstärke, eine Einstecktiefe von 12 mm und eine durchgehende Bohrung von Ø5,25 mm. Der Anschlag misst Ø26 × 1,6 mm. Der offene Raum zwischen den Wänden spart Material.

| Position auf Platte 1 | Kerben am Anschlag | Radzapfen |
|---|---:|---:|
| Links | 1 | Ø19,15 mm |
| Mitte | 2 | Ø19,25 mm |
| Rechts | 3 | Ø19,35 mm |

Alle drei Varianten drucken gemeinsam, damit der Drucker nur einmal die Startsequenz durchläuft. Bambu Studio 2.6.0.51 hat am 09.11.2026 für den P1S mit 0,4-mm-Düse, PLA, 0,28-mm-Schichten und 0 % Infill **11:29 min reine Druckzeit**, **17:42 min Gesamtzeit** und **7,99 g** geschätzt. Alle Netze sind geschlossen und wurden gemeinsam geslict. Zuerst die mittlere Größe am stromlosen Aufbau von Hand prüfen. Die reale Passprobe steht aus.

```sh
openscad -o schnelltest_1925.stl -D 'rad_durchmesser=19.25' -D 'markierungen=2' passadapter_schnelltest.scad
```

## Wellenpassprobe V2

Am 10.11.2026 meldete Nikita nach dem Druck, dass alle drei hohlen V1-Varianten ins Rad gingen. Die Ø5,25-mm-Sollbohrung saß sehr stramm auf der Welle. Beim Einschieben der Welle in die bereits im Rad sitzenden Prüfteile riss die Innenhülse bei allen dreien aus. Bei einem Teil trennte sich zusätzlich der Anschlag. Das Nutzerfoto zeigt die getrennten Teile. Das radseitige Spiel sowie der Ist-Ø der gedruckten Bohrung wurden noch nicht gemessen.

Die [Wellenpassprobe V2](passadapter_wellenprobe.scad) verwendet für alle drei Varianten den größten bereits einsetzbaren Radzapfen von Ø19,35 mm und 12 mm Einstecktiefe. Der Körper ist in CAD als durchgehender Ring ausgeführt, der Anschlag ist 3,2 mm dick und beide Wellenöffnungen haben eine 0,8-mm-Einführfase. Die drei Kerbenzahlen stehen in V2 für die Wellenbohrungen.

| Kerben am Anschlag | Wellenbohrung im CAD |
|---:|---:|
| 1 | Ø5,50 mm |
| 2 | Ø5,65 mm |
| 3 | Ø5,80 mm |

Zuerst am vom Netzteil getrennten Motor mit der größten Bohrung beginnen. Der Prüfkörper soll sich separat von Hand aufschieben und wieder abziehen lassen. Kleinere Varianten nur prüfen, wenn die größere deutliches Spiel hat. Anschließend die Radpassung und den Sitz des Anschlags prüfen. Erst bei leicht lösbaren Einzelpassungen beides zusammenstecken. Die Teile sind für die stromlose Passprobe vorgesehen.

Bambu Studio 2.6.0.51 hat alle drei Varianten gemeinsam geslict. Die geschlossenen Netze wurden auf Konnektivität und Sollmaße geprüft. P1S, PLA, 0,4-mm-Düse, 0,20-mm-Schichten, vier Wandlinien und 40 % Füllung. Slicerschätzung **29:53 min** und **14,27 g** für alle drei. Die physische V2-Passprobe steht aus.

```sh
openscad -o wellenprobe_565.stl -D 'wellenbohrung=5.65' -D 'markierungen=2' passadapter_wellenprobe.scad
```

## Wellenlehre und Passadapter V3

Nikita meldete am 10.11.2026, dass die V2-Teile alle zu groß seien. Für diese Iteration wurde daraus geschlossen, dass die Wellenbohrungen zu viel Spiel haben. Die Zuordnung zum Wellensitz, die Ist-Durchmesser und die Radpassung sind noch zu bestätigen.

Die [Wellenlehre](passadapter_wellenlehre.scad) fasst fünf beschriftete CAD-Bohrungen in einem 5,2 mm dicken Streifen zusammen. Von klein nach groß sind das Ø5,25, Ø5,30, Ø5,35, Ø5,40 und Ø5,45 mm. Beginne an der stromlosen Welle bei Ø5,45 mm und geh schrittweise kleiner, bis die Lehre möglichst spielfrei und von Hand leicht abziehbar sitzt.

Daneben liegt ein [vollständiger Passadapter](passadapter_wellenprobe.scad) mit Ø5,35 mm Bohrung, Ø19,35 mm Radzapfen und vier Kerben. Prüfe den Adapter separat auf der Welle und im Rad. Das Lehrenergebnis ist wegen der kürzeren Bohrung ein Anhaltspunkt für den Adapter. Der physische V3-Test steht aus.

Bambu Studio 2.6.0.51 hat beide geschlossenen, zusammenhängenden Netze auf einer Platte geslict. P1S, PLA, 0,4-mm-Düse, 0,20-mm-Schichten, vier Wandlinien und 40 % Füllung wie bei V2. Slicerschätzung **25:56 min** und **9,44 g**.

```sh
openscad -o wellenlehre.stl passadapter_wellenlehre.scad
openscad -o passadapter_v3_535.stl -D 'wellenbohrung=5.35' -D 'markierungen=4' passadapter_wellenprobe.scad
```

## Vollständige Passadapter V4

Nikita bestätigte am 10.11.2026, dass der Ø19,35-mm-Radzapfen von V2 passt und dass Ø5,25 mm in der kurzen V3-Lehre bisher am besten sitzt, aber noch Spiel hat. Damit ist die frühere Rückmeldung zu V2 der Wellenseite zuzuordnen. Das Sollmaß Ø5,25 mm war auch in allen drei hohlen V1-Adaptern enthalten. Bei V3 läuft dieselbe Nennbohrung durch eine nur 5,2 mm dicke Lehre. Ein vollständiger Prüfkörper kann sich durch die längere Führung und die gedruckte Innenkontur anders anfühlen. Der Ist-Durchmesser der Bohrungen steht aus.

V4 nutzt für alle drei Prüfkörper den [durchgehenden Ring](passadapter_wellenprobe.scad) mit Radzapfen Ø19,35 mm, 12 mm Einstecktiefe und 15,2 mm Gesamtlänge. Bohrungen im CAD sind Ø5,15 mm (eine Kerbe), Ø5,20 mm (zwei Kerben) und Ø5,25 mm (drei Kerben). Das Teil mit drei Kerben zuerst separat auf der stromlosen Welle prüfen. Nur bei zu viel Spiel eine kleinere Variante versuchen. Die Passung soll von Hand lösbar sein.

Die drei Netze wurden auf Sollmaße, geschlossene Kanten und Konnektivität geprüft und auf einer P1S-Platte geslict. Das Projekt übernimmt die V3-Einstellungen. Der Kommandozeilen-Slicer schätzt **30:42 min** und **14,39 g**.

**Passprobe am 10.11.2026.** Nikita hat je eine Motor-Rad-Kombination mit dem V4-Adapter mit einer Kerbe (Sollbohrung Ø5,15 mm) und mit zwei Kerben (Sollbohrung Ø5,20 mm) zusammengesteckt. Beide Radzapfen haben nominal Ø19,35 mm. Die Paarungen für die weitere stromlose Montageprobe beibehalten. Unterschiede an den beiden Wellen oder Radkernen werden vermutet. Ist-Durchmesser, Einstecktiefe und Rundlauf der montierten Paarungen wurden noch nicht gemessen.

```sh
openscad -o passadapter_v4_525.stl -D 'wellenbohrung=5.25' -D 'markierungen=3' passadapter_wellenprobe.scad
```
