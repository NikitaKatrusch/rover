# Hardwarebestand und Beschaffungsstand

Stand 07.11.2026. S12 ergänzt die historischen Angaben um vom Nutzer übermittelte abgeschlossene Bestellungen vom 26.05.2026 und 08.11.2025. Die Mengen in der Tabelle sind Bestellmengen oder historische Bestandsangaben. Ein aktueller physischer Zählbestand steht aus. [Quellenregister](../docs/QUELLEN_UND_ABGLEICH.md)

## Kauf und Bestand dokumentiert

| Teil | Menge | Nachweis / Einordnung | Verwendung / offen |
|---|---:|---|---|
| 775-DC-Motor, 12 V, Variante 15.000 U/min und „no Teeth“ (ohne Ritzel) | 2 bestellt | S12: 26.05.2026. S13: Artikel 1005008221386573. Frühere Nutzermotortests S1 | In V1 als Schussmotoren vorgesehen. Drehzahl unter Last, Anlaufstrom, Welle und Befestigung offen |
| Skater-Rad Ø72 mm, Angebot mit Lagern | 2 bestellt | S12: 26.05.2026; frühere Maßangaben S1 | Fahrwerk. Einbauzustand und Radbreite prüfen |
| L298N-Dual-H-Brücken-Modul | 2 bestellt | S12: 26.05.2026. S13: separates Treiberbild als visuelle Referenz | Artikelnummer, Platinenaufdruck, Jumper-Funktion und Belastbarkeit des konkreten Moduls stehen aus |
| ESP32 DevKitC mit WROOM-32D | 2 bestellt | S12: 08.11.2025, einmal Variante „ESP32-32D“ und einmal „32D-Type-C-1PCS“; S1 belegt den Testkontext | WLAN-Steuerung. Genaue Kontur und Stiftleisten der eingesetzten Platine abgleichen |
| Arduino Mega 2560, CH340, USB-C | 1 bestellt | S12: 26.05.2026, Variante „MEGA2560 CH340 TYPEC“ | Alternative für den Motor-Logikversuch; ESP32 für WLAN vorgesehen |
| HC-05 New Version | 1 bestellt | S12: 26.05.2026 | Bluetooth-Reserve aus dem Konzept der Ballmaschine |
| 28BYJ-48, 5 V + ULN2003 | 1 Set laut alter Liste | S1 | Reserve / möglicher Vereinzler; nicht festgelegt |
| MG996/MG996R, 360° Continuous Rotation | mindestens 1 | S1: Variantenkorrektur, Nutzer sagt unbenutzt | Kein Positionsservo für feste Klappen-/Kippwinkel |
| Netzteil 12 V / 10 A, EU | 1 bestellt | S12: 26.05.2026, Variante „12V 10A EU“; frühere Motorversuche S1 | Tischtest. Belastbarkeit des konkreten Aufbaus und Anschluss prüfen |
| 608ZZ-Lager, ABEC-5 laut Angebot, 8 × 22 × 7 mm (innen × außen × Breite) | 10 separat bestellt | S12: 26.05.2026, ein 10er-Pack | Zusätzlich zur Radbestellung belegt. Anzahl tatsächlich in Rädern verbauter Lager offen |
| Schrauben-/Mutternsortiment M2/M2,5/M3/M4/M5, Edelstahl 304 laut Angebot | 1 Sortiment bestellt | S12: 26.05.2026, Variante „320PCS“; Aufteilung laut S1 | M3×8/12/16 erwähnt; aktueller Restbestand offen |
| PVC-90°-Rohrbogen | mindestens 1 | S1: gekauft erwähnt | Alter Ballkanal; Nennweite 75 mm nur als historischer Suchhinweis, Ist-Innen-/Außenmaß fehlen |
| Ninebot Max G30D2-Akku | 1 | S4: Nutzer bestätigt kostenlos vorhanden | 36 V nominal, 42 V voll, 551 Wh / 15,3 Ah; Maße/Anschlüsse fehlen |
| Lötkolben, Leitungen und einfaches Abisolierwerkzeug | vorhanden im Testkontext | S1 | Genaue Werkzeuge, Querschnitte und belastbare Verbindungen noch erfassen |
| Bambu P1S | 1 vom Nutzer genannt | S1 | Fertigungsmittel; aktuelles Profil/Düse/Material nicht vollständig dokumentiert |

Die Bestellliste nennt zusätzlich ein 5-V-/3-A-USB-Netzteil, 20 Elektrolytkondensatoren mit 1.000 µF und 10 V sowie einen WS2812B-Streifen mit 5 V, 5 m und 60 LEDs/m. Diese Käufe sind belegt. Ihre Verfügbarkeit für den Rover und eine Einbauzuordnung stehen offen. Ein weiterer abgeschlossener Eintrag vom 26.05.2026 enthält keinen Produktnamen und lässt sich keinem Bauteil zuordnen.

## September-Warenkorb, Kaufabschluss nicht belegt

| Teil | Damals genannt | Nicht daraus ableiten |
|---|---|---|
| Zusätzliche 775 | 2 | Dass jetzt insgesamt 4 Motoren vorhanden sind |
| BTS7960-Modul | 2 | Vorhanden, dauerhaft 43 A belastbar oder für 42 V geeignet |
| JGB37-520-Getriebemotor | 2 | Konkrete Getriebeübersetzung, Drehzahl, Wellenform oder Bohrbild |
| Weiteres L298N | Genannt | Aktualisierte Gesamtsumme |
| GT2-Zahnriemen | 5 m, 10 mm Breite in früherer Zusammenfassung | Gewählte Ausführung, Endloslänge oder vorhandene Riemenscheiben |
| Räder 64/70/72 mm | Angebotsvarianten | Je Variante gekaufte Stückzahl |
| DS3218-180° | 1 laut späterer Zusammenfassung | Tatsächlich geliefert oder genaue Bauform |
| MG996R-180° | 2 laut späterer Zusammenfassung | Verwechslung mit vorhandenem 360°-Servo |
| LM2596 | Genannt | Zahl, Modulvariante, Hochvolttauglichkeit oder bestätigter Besitz |

S3 stammt aus der wiedergefundenen Unterhaltung vom 08.09.2026. Die abgeschlossenen Bestellungen aus S12 belegen die Mai- und November-Einträge oben. Die zusätzlichen Artikel aus dem September-Warenkorb bleiben offen.

## Nur empfohlen / konstruktiv geplant

- Zwei N20-Getriebemotoren wurden vor JGB37-520 als Beispiel für die Bänder empfohlen. Kein gesicherter zusätzlicher Bestand.
- Zwei Ball-Caster-Kits, vier Umlenkrollen, Bandmaterial bzw. gedruckte Kettenglieder.
- HC-SR04 und Bumper waren im alten Motortest ausdrücklich noch nicht vorhanden; heutiger Stand offen.
- Crimpzange für Aderendhülsen wurde zur Bestellung vorgeschlagen. Bestellung/Ankunft nicht bestätigt.
- M3-Gewindeeinsätze, Madenschrauben, Stifte und zusätzliche Positionsservos wurden diskutiert. Nicht als vorhandenes Set verplanen.
- LiFePO4-, Blei- und 3S-LiPo-Akkus waren alte Alternativen. Belegt vorhanden ist später der Ninebot-Akku, nicht zusätzlich jeder vorgeschlagene Akku.
- Hochvoltgeeignete DC/DC-Versorgung, Sicherungen, Abschaltung, Ladeanschluss und genaue Stecker sind noch zu spezifizieren.

## Schraubensortiment: überlieferte Angebotsliste

Die Variante „320PCS“ ist durch S12 belegt. Die Aufteilung unten stammt aus dem älteren Angebot S1. Der tatsächliche Restbestand steht aus.

| Größe | Muttern | Schrauben | Weitere genannte Teile |
|---|---:|---|---|
| M2 | 20 | 20 × 6 mm | 20 Unterlegscheiben, 20 Federscheiben |
| M2,5 | 20 | 20 × 8 mm | 20 Unterlegscheiben, 20 Federscheiben |
| M3 | 20 | 10 × 8 mm; je 5 × 12/16 mm | Unterleg-/Federscheiben in der kopierten Liste nach Schraubenlängen gruppiert |
| M4 | 10 | je 5 × 8/16 mm | Entsprechende Unterleg-/Federscheiben genannt |
| M5 | 10 | je 5 × 8/16 mm | Entsprechende Unterleg-/Federscheiben genannt |

Schraubenkopf, Gewindesteigung und Insertaufnahme nicht aus dem Sortimentstitel konstruieren; das tatsächlich verwendete Verbindungsmittel bestimmen.
