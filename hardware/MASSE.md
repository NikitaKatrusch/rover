# Maße, Herkunft und fehlende Messungen

Stand: 05.11.2026. Alle Längen in mm, falls nicht anders angegeben. **Kein Bauteil wurde bei dieser Zusammenführung neu vermessen.** Eine Zahl mit zwei Nachkommastellen ist nicht automatisch eine genaue Istmessung.

## Bauteile

| Bauteil / Merkmal | Überlieferter Wert | Art des Belegs | Vor passgenauer Konstruktion offen |
|---|---|---|---|
| 775 Gehäuse-Ø | 44,6 | Alter Assistentenrückgriff auf ursprünglichen Chat [S1] | Am vorhandenen Motor nachmessen |
| 775 Gehäuselänge ohne Welle | 71 | Alter Chat, ausdrücklich ohne Welle [S1] | Vorderer Zentrierbund, hintere Anschlüsse und Kabelraum separat messen |
| 775 Wellen-Ø | 5 | Produkt-/Nutzerangabe im Chat, mehrfach wiederholt [S1] | Istmaß, Rundheit und tatsächlich nutzbare Länge |
| 775 Wellenlänge | 13 genannt; auch „0,55 in“ | Alte Bildinterpretation [S1] | Widerspruch: 0,55 in = 13,97 mm; nicht als sichere 13-mm-Messung verwenden |
| 775 Wellenform | Glatt/rund, kein D-Flach erkennbar | Alte Fotoeinschätzung [S1] | Am echten Motor prüfen; kein stillschweigender D-Schaft im CAD |
| 775 Montage | Unbekannt | Kein freigegebenes Bohrbild | Lochabstand, Gewinde, Schraubtiefe, Zentrierung, zulässige Klemmzone |
| PU-Rad Außendurchmesser | 72 | Nutzer bestätigt Variante [S1] | Tatsächlicher Durchmesser unter Last |
| Radbreite | ca. 24 | Vom Nutzer kopiertes Angebot [S1] | Rad-/Nabenprofil und axiale Einbaubreite |
| Rad-Lagersitz-Ø | ca. 22 | Dasselbe Angebot [S1] | Tiefe, Mittelschulter, beide Seiten und vorhandene Lager |
| Lager-Innen-Ø | 8 | Dasselbe Angebot [S1] | Tatsächliches Lager/Einbauzustand |
| 608ZZ | 8/22 erwähnt | Nennmaße aus Altchat | Lagerbreite und Einbau nicht neu verifiziert |
| JGB37-520 | Keine gesicherten Einbaumaße | Nur Teilefamilie im Warenkorb [S3] | Genaue Variante, Getriebekörper, Welle, Flansch/Bohrbild |
| Servo 360° | Keine gesicherten Einbaumaße | Bestand und Variantenhinweis [S1] | Gehäuse, Laschen, Abtrieb, Hebel, Freiraum |
| DS3218/MG996R-180° | Unbekannt | Warenkorb [S3] | Konkretes Exemplar und Besitz bestätigen |
| ESP32/L298N/BTS7960/Wandler | Unbekannt | Frühere Größen waren Schätzungen | Platinenkontur, Bohrungen, Kühlkörper, Anschlüsse, Kabelbiegeräume |
| Ninebot-Akku | Keine gesicherten mechanischen Maße | Besitz/elektrische Daten [S4] | L × B × H, Masse, Befestigung, Stecker, Kabel- und Laderaum |
| PVC-Bogen | Keine gesicherten Istmaße | Alter Bestand [S1] | Innen-/Außen-Ø, Biegeradius, Endlängen |

## Frühere CAD-Stände – keine gemeinsame finale Maßkette

| Teil / Stand | Alte Werte | Status |
|---|---|---|
| Lochplatte, später Screenshotstand | 215 × 235 × 5 | In alter Antwort abgelesen; aktuelles CAD fehlt |
| Lochraster | Löcher Ø 5, Teilung 10, 483 Löcher genannt | Nutzerangaben; Lochanzahl und Randbezug im CAD prüfen |
| Rasterrand | „5 mm weg von den Löchern“ und 5-mm-Anfangsversatz | Lochkante vs. Mittelpunkt nicht eindeutig definiert |
| Ältere Grundplatten | 210 × 307 bzw. 210 × 305 | Vor dem späteren kleineren Base-Stand |
| Radadapter | Außen-Ø 22, axiale Länge 11 | Alter CAD-Vorschlag, keine freigegebene Presspassung |
| Adapter-Wellenbohrung | 5,6 bei 5-mm-Welle; später rechnerisch 6 bei Radius 11/Wand 8 | Zu großes Loch berichtet; alte Werte nicht wieder ungeprüft drucken |
| Radiale M3-Befestigung | Kopfloch Ø 6 × 3; Schaftloch Ø 3,2; Bohrwerkzeuglänge später 6 statt 9 | Historische Anleitung, kein Gewinde-/Klemmnachweis |
| Gedruckte Pins | Ø 4,6–4,8; Länge ca. 15 | Nur vorgeschlagene Testwerte für Ø-5-Löcher |
| Alte hohe Rampe | Breite 210, Höhe ca. 80, schräge Länge 350 | Früher Entwurf; nicht mit niedriger Einlasslippe gleichsetzen |
| Hohe Plattform | Z 73, später 78–80 empfohlen | Historischer Versuch, keine aktuelle Baugruppenreferenz |
| Trichterhülle | 210 × 150 × 180 | Konzeptgröße für etwa 20 Bälle, Innenvolumen nicht nachgewiesen |
| Bandabstand | 63 bei diskutiertem 66-mm-Ball | Alte Diskussion [S5], kein bestätigtes Förderergebnis |
| Kurzer Förderertest | ca. 100 Länge, Abstand in 1–2-mm-Schritten variieren | Testvorschlag [S2] |
| Kanalübergang | Verjüngung über 20–30 Länge | Entwurfsvorschlag [S2] |
| Späterer Schusskanal | 80–85 Breite | Entwurfsvorschlag, nicht automatisch wirksamer Vereinzler |

Die Angabe „22 mm Außendurchmesser“ in einer alten Assistentenantwort bezeichnete irrtümlich das Rad. Korrekt zuordnen: 72 mm Radaußen-Ø, etwa 22 mm Lagersitz, 8 mm Lagerinnen-Ø.

Für die historische Lochplatte ergibt sich bei exakt 483 vollständigen Ø-5-Löchern eine theoretische verbleibende ebene Fläche von `215*235 - 483*pi*(5/2)^2`, rund 81,2 % der Rechteckfläche. Das ist nur Geometrie, kein Festigkeitsnachweis. Befestigungsabstände, Motorlast, Infill, Deckschichten, Material und Druckorientierung fehlen für eine Belastungsfreigabe.

## Maßblatt vor dem Konstruieren

Für jedes tatsächliche Teil erfassen: Teilenummer/Variante und Foto, Messgerät und Datum, Bezugspunkt, L/B/H bzw. Durchmesser/Länge, Bohrbild/Loch-Ø/Gewinde, Welle/Nabe, Anschlüsse und Kabelraum. Das Endmaß des Druckteils getrennt vom Bauteil-Istmaß und der Passungszugabe speichern.

Bei einer Ø-5-Welle ist eine historische Ø-5,6-Bohrung bereits 0,6 mm diametral größer. Ein zusätzliches pauschales Druckspiel verschärft das Problem. Eine garantierte allgemeine Regel „FDM-Löcher werden immer größer“ ist falsch; Material, Orientierung und Slicer beeinflussen die Abweichung. Erst Passprobe messen, dann kompensieren.

Für das Fusion-Modell: X vorwärts, Y links, Z aufwärts als vorgeschlagene gemeinsame Konvention dokumentieren; bestehende Baugruppe ggf. über einen klaren Ursprung/Transformationsbezug übernehmen. Radradius definiert die Achshöhe über Boden, nicht automatisch die Plattenhöhe.
