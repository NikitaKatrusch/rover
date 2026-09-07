# Ballsammler-Rover – Aufsammelmechanismus

Vollständige Zusammenfassung dieses Chats, thematisch geordnet statt chronologisch,
damit sie als Doku im Repo brauchbar ist. Verworfene Ansätze sind mit Begründung
drin, damit sie nicht nochmal neu diskutiert werden müssen.

## Status

Aktueller Fokus: **nur der Aufsammelmechanismus.** Der Schuss-Mechanismus ist
bewusst zurückgestellt (siehe Abschnitt 8), wird aber später mit demselben
Chassis kombiniert.

---

## 1. Fahrwerk & Chassis-Layout

- **2 Antriebsräder hinten**, unter der schweren Seite (dort wo später die
  Förderbänder + der Ball-Speicher sitzen) – mehr Gewicht = mehr Traktion.
- Skid-Steering: reine Drehzahl-Differenz zwischen den beiden Rädern, **kein
  Lenkservo**, keine neigbaren Räder.
- **2x Kugel-Caster vorne**, links und rechts vom Ball-Kanal (nicht mittig!) –
  ein einzelner mittiger Caster würde genau im Kanal sitzen und den
  Ball blockieren.
  - Caster-Kugel muss **hart und glatt** sein (kein Gummi wie der blaue
    Demo-Ball) – beim Skid-Steering muss der Caster seitlich wegrutschen
    können, sonst bremst/hakt er.
  - Fassung sollte die Kugel nur zu ca. 40–50% umschließen, damit sie frei in
    alle Richtungen rollen kann.
  - Caster-Höhe muss exakt der Hinterrad-Höhe entsprechen, sonst steht die
    Grundplatte schief (Lippe schleift vorne, oder Ball rollt unterm Kanal
    durch statt reinzutreffen).
- **Warum überhaupt Caster nötig**: mit nur 2 Rädern hinten hat die Platte
  vorne keinen Bodenkontakt und würde nach vorne kippen.

---

## 2. Ball-Einlass (vorne)

- Vorne eine **kleine Rampe/Lippe**, keine dünnen Streben oder ein Rechen –
  dünne Stäbe fangen einen rollenden Ball nicht zuverlässig ein, er rollt
  eher dagegen und bleibt liegen oder rutscht seitlich weg.
- Die Lippe muss flach angewinkelt sein, damit der Ball beim Anfahren
  draufrollt und **unter das Chassis rutscht statt weggeschoben zu werden**.
- Rover fährt gegen den Ball → Ball rollt die Lippe hoch → rollt (weil der
  Rover weiterfährt) nach hinten durchs Chassis durch.

---

## 3. Ball-Kanal (unter dem Chassis)

- Seitenwände im Abstand **Balldurchmesser + etwas Spiel**, zwingen den Ball
  automatisch zur Mitte, unabhängig davon, wo er vorne unter die Front gerät.
- Kanal darf sich **nicht am Radabstand orientieren** – eigene, schmalere
  Wände, damit der Ball nie die drehenden Antriebsräder berührt (sonst wird
  er seitlich weggekickt statt durchgereicht).
- **Durchgehendes leichtes Gefälle** bis zu den Förderbändern, kein flacher
  Boden – auf flachem Untergrund bremst Reibung den Ball ab, bevor er hinten
  ankommt.
- **Kein Spalt** zwischen Kanalwänden und Förderband-Eingang – die Bänder
  bilden quasi die Rückwand des Kanals.
- **Verjüngung auf den exakten Band-Abstand**, aber **kontinuierlich über
  20–30mm**, nicht abrupt: sonst trifft der Ball nicht mittig oder prallt an
  einer harten Kante ab, statt sauber einzufädeln.
- Kanalsohle muss **exakt auf Höhe des untersten Bandkontaktpunkts** enden,
  kein Höhensprung/Fallstufe an der Übergabe.

---

## 4. Fördermechanismus (Ball nach oben transportieren)

### 4.1 Verworfene Ansätze (mit Begründung, nicht nochmal aufgreifen)

| Ansatz | Warum verworfen |
|---|---|
| Förderschnecke (Auger) + PVC-Bogen | War für den *Schuss*-Zubringer gedacht (siehe Abschnitt 8), nicht fürs Sammeln – dort weiterhin relevant, hier nicht gebraucht. |
| Senkrechtes Förderband mit **Mulden** (Becherwerk-Prinzip) | Funktioniert bei Schüttgut (ganzer Haufen), aber nicht bei einem einzelnen, präzise liegenden Ball: die Mulde muss zufällig genau in dem Moment durchschwingen, in dem der Ball da liegt – reines Timing-Glück, kein verlässlicher Mechanismus. |
| Mulde "gräbt" sich beim Umlauf um die untere Bandrolle durch eine feste Vertiefung | Löst zwar theoretisch das Timing, aber die Mulde kann den Ball aus einer seitlichen/stehenden Position heraus nicht zuverlässig packen – gleiche Schwäche wie oben. |

### 4.2 Finale Lösung: zwei gegenläufige Förderbänder (Walzenpaar-Prinzip, gestreckt)

- **Zwei parallele Bänder**, die sich gegenüberstehen und den Ball über die
  **komplette Höhe** einklemmen – Weiterentwicklung des einfachen
  Walzenpaars (ein Walzenpaar reicht nur für kurze Förderhöhen).
- Kein Timing-Problem mehr: der Ball wird bei Kontakt **sofort und
  kontinuierlich** erfasst, unabhängig davon, wann genau er ankommt.
- **Beide Bandflächen, die sich berühren, müssen in dieselbe Richtung (nach
  oben) laufen** – die zwei Bandschlaufen selbst drehen also gegenläufig
  zueinander (sie sind spiegelbildlich).
- **Keine Mulden mehr nötig** – glatte oder leicht griffige
  Bandoberfläche reicht, weil durchgehend geklemmt statt in eine Tasche
  gesammelt wird.
- Bereits gedrucktes Kettenglied-Band (siehe Bilder) kann für die zweite
  Seite einfach gespiegelt werden – Mulden-Ausschnitte weglassen.
- **Bandabstand**: ein paar mm enger als der Balldurchmesser für genug
  Anpressdruck (Ball gibt als Gummi leicht nach).
- **Antrieb**: entweder ein Motor pro Band (synchron, einfacher zu bauen) oder
  ein Motor + Zahnrad-/Riemen-Umkehr fürs zweite Band (spart einen Motor,
  braucht dafür ein Präzisions-Getriebeteil). Empfehlung: zwei Motoren, außer
  eine passende Zahnradachse ist schon vorhanden.
- **Reibungsrisiko trotzdem vorhanden**: der Ball muss beim Eintritt zwischen
  die Bänder sauber mittig treffen (siehe Verjüngung, Abschnitt 3) – "einfach
  reinrollen lassen" reicht ohne die Trichter-Verjüngung nicht zuverlässig.

---

## 5. Ball-Speicher (Magazin/Trichter für ~20 Bälle)

- **Trichter statt schmalem Rohr**: Bälle müssen nicht einzeln exakt oben
  reinfallen, der Förderer kippt sie grob rein, die Trichterform sortiert sie
  zur Engstelle unten – toleranter als ein schmales Magazinrohr.
- **Größenrechnung für 20 Bälle** (Padel-Ball Ø 63,5–67,7mm, ~65mm
  gerechnet):
  - 1 Ball ≈ 144cm³ Volumen
  - 20 Bälle als reines Kugelvolumen: **2,9 Liter**
  - Lose Kugelpackung füllt nur ~55–60% des Raums →
    netto **~5–5,3 Liter** nötig
  - Beispielmaße: **210mm (Breite, = Rampenbreite) × 150mm (Tiefe) ×
    160mm (Höhe)** ≈ 5,0 Liter, plus 10–15% Puffer wegen der sich
    verjüngenden Form am Auslauf → eher **~180mm Höhe** real
  - Empfehlung: eher die höhere/schmalere Box-Variante als eine flache
    breite, damit der Ballstapel nicht zu nah an die Antriebsräder heranreicht
- Am unteren Trichterauslauf wird später wieder auf Balldurchmesser +
  Toleranz verjüngt (Richtung Schuss-Mechanismus, siehe Abschnitt 8).
- **Praktischer Test-Tipp**: 20 Kopien der Ball-Kugel aus Tinkercad lose in
  die geplante Box-Form legen (keine Physik-Simulation in Tinkercad, aber
  zeigt visuell, ob 20 Kugeln bei der geplanten Höhe überhaupt reinpassen).

---

## 6. Steuerungslogik: Ball-Suche & Anfahren (Software/Konzept, noch nicht programmiert)

Ablauf als Regelkreis, unabhängig vom Schuss-Teil:

1. **Suchen** – Rover dreht sich, scannt per Kamera nach einem Ball
2. **Anvisieren** – Ball wird per Lenkkorrektur (Ball-x-Position im Bild)
   im Bild zentriert
3. **Schnell anfahren** – Volltempo, solange der Ball klein/weit weg im
   Bild ist
4. **Andocken & aufnehmen** – ab einem kalibrierten Schwellwert (Ball nimmt
   z.B. >15% der Bildhöhe ein) auf Schleichfahrt abbremsen, damit der Ball
   nicht zur Seite wegspringt
5. Zurück zu Schritt 1 für den nächsten Ball

Details:
- **Lenkung** = reine Proportionalregelung über die Ball-x-Position im Bild
  (kein komplexer Algorithmus nötig)
- **Kamera muss vorne mittig, leicht nach unten geneigt, exakt auf die
  Kanal-/Lippenmitte ausgerichtet sein** – nur dann heißt "Ball mittig im
  Bild" auch wirklich "Ball trifft den Einlass"
- Mindestgröße/-schärfe als Schwelle nötig, damit die Erkennung nicht auf
  einen winzigen Farbfleck am Bildrand anspringt
- Bildverarbeitung läuft auf einem Laptop (Kamera: altes Handy per
  IP-Kamera-App/WLAN-Stream), nicht auf dem ESP32

---

## 7. Recherche / Vergleich mit echten Produkten

- **SeekerBot, Tennibot** und diverse Uni-Kapstone-Projekte/Patente wurden
  als Referenz recherchiert.
- Die meisten echten Sammelroboter trennen **nicht** in "Rampe dann
  separater Elevator" – meist ein einziger integrierter Mechanismus:
  - Rotierende Bürste, die direkt vom Boden in einen Korb OBEN auf dem
    Roboter wirft (Aufnehmen + Hochheben in einer Bewegung)
  - Oder eine angetriebene **Reibungsrolle**, die den Ball aktiv die
    Rampe hochzieht (Patent für einen kombinierten Sammel+Schuss-Roboter,
    sehr nah am eigenen Use Case)
- Daraus abgeleitet: das Doppelband-Prinzip (Abschnitt 4.2) ist im Kern
  dieselbe Idee wie die Reibungsrolle aus dem Patent, nur über die volle
  Höhe gestreckt statt an einer einzigen Stelle.

---

## 8. Zurückgestellt: Schuss-Mechanismus (für später, nicht aktueller Fokus)

Bereits diskutiert, aber bewusst noch nicht gebaut:

- **Wurfräder**: 2 Motoren, aufrecht nebeneinander (nicht übereinander),
  44,6mm Ø / 71mm Länge (ohne Welle) für die 775er-Motoren, Halterungsbohrung
  45–45,5mm Toleranz
- **Kipp-Mechanismus** für Lob-Schüsse: Servo neigt die Wurfräder nach oben
  (Padel braucht nie nach unten, nur flach bis steil für Lobs)
- **Flexibler Schlauch-Übergang** an der Kippachse: nur das letzte Stück vor
  den Rädern ist flexibel (geriffelter Schlauch), der Rest starr; Kipp-Servo
  sollte möglichst nah am Übergabepunkt sitzen, damit der Schlauch nur eine
  kleine Restbewegung abfangen muss
- **Feste Klappe** vor dem flexiblen Stück (nicht auf der kippenden
  Plattform, sonst braucht der Servo dafür bewegliche Verkabelung)
- **Trichter-Vereinzelung** vorm Schuss: Kanalwände verjüngen sich auf
  ~80–85mm (Balldurchmesser + Toleranz), damit nur ein Ball auf einmal
  durchkommt
- **Sammel-/Schuss-Modus-Umschaltung**: Trichter-Füllstand als Trigger
- **Vision-Language-Modell** (später, auf dem Laptop) für Gegner-Einschätzung
  und Schusstyp-Wahl (Lob vs. flach) – unkritisch bei Latenz, weil zwischen
  Schüssen 3–8 Sekunden Zeit sind
- Ziel laut ursprünglicher Idee: Rover soll parallel sammeln UND schießen
  können, nicht nacheinander in zwei Modi

---

## 9. Einkaufsliste (für den Aufsammelmechanismus)

**Neu zu besorgen:**
- 2x kleine Getriebemotoren für die Förderbänder (z.B. N20-Getriebemotor,
  12V, niedrige Drehzahl nach dem Getriebe – **nicht** nochmal 775er, die
  sind für Drehzahl/Wurfkraft ausgelegt, nicht fürs langsame,
  drehmomentstarke Hochziehen)
- Riemen-/Bandmaterial (GT2-Zahnriemen oder flacher Gummiriemen in
  passender Breite) – alternativ die gedruckten Kettenglieder weiterverfolgen,
  falls die schon zuverlässig laufen
- 4x Umlenkrollen (2 pro Band), passend zum gewählten Riemen selbst gedruckt
- 2x Ball-Caster-Kit mit harter, glatter Kugel (fertig kaufen statt selbst
  aus Lagerkugel + Druckteil basteln)

**Bereits vorhanden, nicht neu kaufen:**
- 2. L298N-Motortreiber (1. ist für die Antriebsräder belegt, der zweite ist
  noch frei und deckt beide Bandmotoren ab – 1 Kanal pro Motor)
- MG996-Servo (seit dem Verzicht auf die motorisierte Bürste frei – für
  später als Klappen-Servo am Trichter aufheben, nicht jetzt verplanen)
- ESP32 (gemeinsam genutzt)

---

## 10. Bauplan-Reihenfolge (empfohlen, mit Tests statt alles auf einmal drucken)

1. Motorenbedarf klären (siehe Einkaufsliste) und Motoren besorgen, bevor
   Halterungen final designt werden
2. Mini-Testaufbau: nur ein kurzes Bandstück (~10cm) mit den zwei
   Umlenkrollen drucken
3. Grip mit echtem Padel-Ball testen, Bandabstand in 1-2mm-Schritten
   justieren
4. Erst danach die volle Bandlänge im CAD fertigstellen und drucken
   (gespiegelt für die zweite Seite)
5. Kanal-Verjüngung als eigenes Teil drucken und mit Testbällen aus
   verschiedenen Winkeln/Geschwindigkeiten prüfen
6. Front-Lippe & Kanalwände ans Chassis anbauen (noch ohne Bänder fest zu
   verschrauben)
7. Kompletten Weg unter echter Fahrt testen (Ball aufs Feld legen, Rover
   fahren lassen)
8. Trichter oben aufsetzen, Füllstand mit mehreren Bällen nacheinander
   prüfen (Randhöhe bei ~20 Bällen ausreichend?)

---

## 11. Offene Punkte / noch zu entscheiden

- Ein Motor + Zahnrad-Umkehr vs. zwei separate Motoren für die Bänder
  (Empfehlung: zwei, siehe Abschnitt 4.2/9)
- Bandmaterial final festlegen: gedrucktes Kettenglied weiterverfolgen oder
  auf Zahnriemen wechseln
- Genaue Trichter-Endmaße nach dem Ball-Stapel-Test in Tinkercad
- Kamera-Erkennungsschwelle (Mindestgröße im Bild) muss später empirisch
  kalibriert werden

---

## Anhang: GitHub-Setup (Meta-Notiz zu diesem Chat)

- Es gibt **keinen dauerhaften GitHub-Connector** in diesem Chat-Interface –
  in einem früheren Chat wurde versucht, per Personal-Access-Token (PAT)
  über das Sandbox-Terminal (`git commit` + `git push`) direkt in
  `NikitaKatrusch/rover` zu schreiben. Das ist technisch möglich, ist aber
  damals an einem 403-Fehler (falsche Token-Berechtigungen) gescheitert und
  wurde nicht mehr erfolgreich abgeschlossen – am Ende wurde stattdessen
  manuell per Drag & Drop auf github.com hochgeladen.
- Für **Lesezugriff** auf ein Repo in diesem Chat: "+" im Chateingabefeld →
  "Add from GitHub".
- Für **aktives Schreiben/Committen** über eine Chat-Oberfläche: Claude Code
  (lokal oder claude.ai/code) ist der dafür vorgesehene Weg, nicht dieser
  normale Chat.
- Falls hier nochmal per Token gepusht werden soll: Fine-grained Token mit
  "Only select repositories" → Repo anhaken → Permissions → Contents →
  **Read and write**.
