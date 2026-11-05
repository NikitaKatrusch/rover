# Ballsammler-Rover

Kleiner Wagen, der Bälle vom Boden einsammelt und wieder hinausschießt.
Nachfolgeprojekt der Padel-Ballmaschine (siehe Abschnitt "Vorhandene Teile").

Dieses Repo ist die zentrale Projektablage: CAD, Firmware und Vision-Code sollen
hier alle hinein. Die Zusammenfassung des Chats mit allen Details und verworfenen
Ansätzen steht in `ballsammler-rover-aufsammelmechanismus.md`. Der vollständige
Chatverlauf steht in `rover_chat_komplett.txt`.

---

## Status

- **Aktueller Fokus:** nur der Aufsammelmechanismus.
- **Zurückgestellt:** der Schuss-Mechanismus. Er wird später mit demselben Chassis kombiniert.
- **Ziel laut ursprünglicher Idee:** Der Rover soll parallel sammeln UND schießen können,
  nicht nacheinander in zwei getrennten Modi.

---

## Grundkonzept

- Der Rover ist anfangs ein **Trainer**, kein Spielpartner. Er muss den Gegner nicht
  erkennen.
- Die Ballerkennung läuft per Kamera und Bildverarbeitung auf einem Laptop
  (altes Handy als IP-Kamera-Stream), nicht auf dem ESP32.
- Vision-Language-Modell (später, auf dem Laptop) für Gegner-Einschätzung und
  Schusstyp-Wahl (Lob vs. flach). Zwischen zwei Schüssen liegen 3–8 Sekunden, Latenz
  ist daher unkritisch.

---

## Chassis & Antrieb

**Stand der Notizen (Sept. 2026):**
- Antriebs-/Fahrräder sitzen **unter dem Chassis**, getrennt von den seitlich
  montierten Wurfrädern, die den Ball rausschießen.
- Die Ballzufuhr läuft über die schwere Seite, dort wo Förderbänder und Ball-Speicher
  sitzen.

**Stand der Aufsammel-Doku (`ballsammler-rover-aufsammelmechanismus.md`):**
- 2 Antriebsräder hinten, Skid-Steering über Drehzahl-Differenz, kein Lenkservo.
- 2 Kugel-Caster vorne, links und rechts vom Ball-Kanal.

> **OFFEN:** Die beiden Beschreibungen des Antriebs weichen voneinander ab. Welche
> Konfiguration gilt, ist noch nicht entschieden.

---

## Aufsammelmechanismus

**Ablauf:** Der Ball wird per Lippe vorne aufgenommen, rollt durch den Kanal unter dem
Chassis, wird vom Förderer nach oben transportiert und landet im Speicher.

**Wichtigste Festlegungen:**
- **Einlass vorne:** flache Rampe/Lippe, keine dünnen Streben oder Rechen.
- **Ball-Kanal:** Seitenwände im Abstand Balldurchmesser + Spiel, Kanal unabhängig
  vom Radabstand. Durchgehendes leichtes Gefälle. Verjüngung auf den Band-Abstand
  über 20–30 mm, nicht abrupt.
- **Fördermechanismus:** zwei gegenläufige Förderbänder, die den Ball über die volle
  Höhe einklemmen. Kein Timing nötig, keine Mulden.
- **Bandabstand:** einige mm enger als der Balldurchmesser.
- **Antrieb der Bänder:** Empfehlung zwei Motoren (N20-Getriebemotor, 12V,
  niedrige Drehzahl). Nicht 775er, die sind für Drehzahl ausgelegt.

**Verworfen (nicht erneut diskutieren):**
- Förderschnecke für den Sammelbetrieb (nur für den Schuss-Zubringer relevant).
- Senkrechtes Becherwerk mit Mulden. Funktioniert nur zufällig, weil die Mulde im
  richtigen Moment am Ball vorbeikommen muss.
- Mulde, die sich um die untere Bandrolle gräbt. Gleiche Schwäche wie oben.

---

## Ball-Speicher

- Trichter statt schmalem Rohr, damit die Bälle nicht einzeln exakt eingefädelt
  werden müssen.
- Ziel: **ca. 20 Bälle** (Padel-Ball Ø ca. 65 mm).
- Richtwert: Box **210 × 150 × 180 mm** (ca. 5 Liter netto). Die Breite entspricht der
  Rampenbreite. Die höhere, schmalere Variante ist zu bevorzugen, damit der Ballstapel
  nicht an die Antriebsräder reicht.
- Am Auslauf wird später auf den Balldurchmesser + Toleranz verjüngt
  (Richtung Schuss-Mechanismus).
- Test vorab: 20 Kugeln aus Tinkercad lose in die Box legen, um die Höhe zu prüfen.

---

## Schuss-Mechanismus (zurückgestellt)

- **Wurfräder:** 2 Motoren, aufrecht nebeneinander. Für 775er: 44,6 mm Ø,
  71 mm Länge (ohne Welle). Halterungsbohrung 45–45,5 mm.
- **Kipp-Mechanismus:** Servo neigt die Wurfräder nach oben für Lobs. Nach unten wird
  nicht gebraucht.
- **Zufuhr:** festes Rohr mit Klappe, kurz vor den Wurfrädern in ein flexibles
  Schlauchstück (geriffelter Schlauch) am Kipp-Drehpunkt. Der Kipp-Servo sitzt nah am
  Übergabepunkt. Die feste Klappe liegt vor dem flexiblen Stück, nicht auf der
  kippenden Plattform.
- **Vereinzelung:** Kanalwände verjüngen sich auf ca. 80–85 mm, damit nur ein Ball
  durchkommt.
- **Modus-Umschaltung:** Der Füllstand des Trichters dient als Trigger zwischen
  Sammeln und Schießen.
- **Verworfen:** Förderschnecke mit PVC-Bogen gilt nur hier (Zubringer), nicht fürs Sammeln.

---

## Steuerungslogik (Konzept, noch nicht programmiert)

Regelkreis:
1. **Suchen:** Rover dreht sich und scannt per Kamera nach einem Ball.
2. **Anvisieren:** Ball wird über die Ball-x-Position im Bild zentriert
   (Proportionalregelung, kein komplexer Algorithmus).
3. **Schnell anfahren:** Volltempo, solange der Ball klein und weit weg ist.
4. **Andocken & aufnehmen:** ab ca. 15 % Bildhöhe auf Schleichfahrt abbremsen.
5. Zurück zu Schritt 1.

Randbedingungen:
- Kamera vorne mittig, leicht nach unten geneigt, exakt auf die Kanal-/Lippenmitte
  ausgerichtet.
- Mindestgröße/-schärfe als Schwelle, damit die Erkennung nicht an einem Farbfleck am
  Bildrand anspringt. Diese Schwelle muss später empirisch kalibriert werden.

---

## Recherche-Referenzen

- **SeekerBot, Tennibot** und Uni-Projekte/Patente zu Sammelrobotern.
- Die meisten echten Sammler nutzen einen integrierten Mechanismus statt "Rampe und
  separater Elevator":
  - rotierende Bürste, die direkt in einen Korb oben auf dem Roboter wirft, oder
  - angetriebene Reibungsrolle, die den Ball die Rampe hochzieht (Patent für einen
    kombinierten Sammel+Schuss-Roboter, sehr nah am eigenen Use Case).
- Das Doppelband-Prinzip ist im Kern dieselbe Idee wie die Reibungsrolle, nur über die
  volle Höhe gestreckt.

---

## Vorhandene Teile

**Schon vorhanden (aus der Ballmaschine):**
- 2× 775 DC-Motoren
- 2× L298N (1 Treiber für die Antriebsräder, 1 frei für die Bandmotoren)
- MG996R-Servo (frei, für später als Klappen-Servo am Trichter reserviert)
- ESP32 (gemeinsam genutzt)
- 608ZZ-Lager, Schrauben M2–M5, 12V/10A-Netzteil (nur für Tischtest)

**Ersatzteillager (Ballmaschine/Robotarm, nicht für den Rover):**
- Arduino Mega 2560, HC-05 Bluetooth, 28BYJ-48-Stepper + ULN2003

---

## Einkaufsliste (noch offen)

- 2× N20-Getriebemotor, 12V, niedrige Drehzahl (für die Förderbänder)
- Bandmaterial: GT2-Zahnriemen oder flacher Gummiriemen. Alternativ die gedruckten
  Kettenglieder weiterverfolgen, falls sie zuverlässig laufen.
- 4× Umlenkrollen (2 pro Band), selbst gedruckt passend zum Riemen
- 2× Ball-Caster-Kit mit harter, glatter Kugel (fertig kaufen)

---

## Bauplan (Reihenfolge)

1. Motorbedarf klären und Motoren besorgen, bevor Halterungen final designt werden.
2. Mini-Testaufbau: ~10 cm Bandstück mit zwei Umlenkrollen drucken.
3. Grip mit echtem Padel-Ball testen, Bandabstand in 1–2 mm-Schritten justieren.
4. Erst danach die volle Bandlänge im CAD fertigstellen (gespiegelt für die zweite Seite).
5. Kanal-Verjüngung als eigenes Teil drucken, mit Testbällen aus verschiedenen
   Winkeln und Geschwindigkeiten prüfen.
6. Front-Lippe und Kanalwände ans Chassis anbauen, Bänder noch nicht fest verschrauben.
7. Kompletten Weg unter echter Fahrt testen.
8. Trichter aufsetzen, Füllstand mit mehreren Bällen prüfen (reicht die Randhöhe bei ~20 Bällen?).

---

## Offene Punkte

- Chassis-Konfiguration klären (Antrieb unter dem Chassis oder Antriebsräder hinten
  mit Casters vorne, siehe oben).
- Ein Motor mit Zahnrad-Umkehr oder zwei separate Motoren für die Bänder
  (Empfehlung: zwei).
- Bandmaterial festlegen: Kettenglied oder Zahnriemen.
- Trichter-Endmaße nach dem Ball-Stapel-Test in Tinkercad.
- Erkennungsschwelle der Kamera empirisch kalibrieren.

---

## Dateien in diesem Repo

- `README.md`: diese Übersicht
- `ballsammler-rover-aufsammelmechanismus.md`: thematisch geordnete Zusammenfassung mit
  Begründungen für verworfene Ansätze
- `rover_chat_komplett.txt`: vollständiger Chatverlauf (Nachrichten, ohne Tool-Aufrufe)
