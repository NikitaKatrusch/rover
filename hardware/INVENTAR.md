# Hardwarebestand und Beschaffungsstand

Stand der Zusammenführung: 05.11.2026. Mengen sind dokumentierte historische Mengen, kein aktueller physischer Zählbestand. Quellen: [Quellenregister](../docs/QUELLEN_UND_ABGLEICH.md).

## Vorhanden dokumentiert

| Teil | Menge | Nachweis / Einordnung | Verwendung / offen |
|---|---:|---|---|
| 775-DC-Motor, 12 V, Angebotsangabe 15.000 U/min | 2 | S1: Ursprungsliste und Nutzermotortests | Historischer Fahrantrieb; endgültige Eignung/Übersetzung offen |
| PU-Skater-Rad, gewählte Variante 72 mm | 2 | S1: Nutzer nennt 72 mm, alter Bestand 2 Stück | Fahrantrieb; Angebot listet auch 64/70 mm, das sind keine bestätigten zusätzlichen Räder |
| L298N-Modul | 2 | S1/S2: einer für Fahrt, einer frei dokumentiert | Frei bedeutet historisch frei, keine automatische Stromfreigabe für Bandmotoren |
| ESP32-Board | mindestens 1 | S1: Nutzer besitzt und testet es | WROOM-32D wurde im Verlauf identifiziert; genaue Devboardabmessungen fehlen |
| Arduino Mega 2560, CH340/Type-C | mindestens 1 | S1: Bestand; zweiter Mega als mögliche Reserve besprochen | Reserve; zweite Stückzahl nicht gesichert |
| HC-05 | 1 laut alter Liste | S1 | Bluetooth-Konzept der ursprünglichen Ballmaschine, kein Muss für WLAN-Rover |
| 28BYJ-48, 5 V + ULN2003 | 1 Set laut alter Liste | S1 | Reserve / möglicher Vereinzler; nicht festgelegt |
| MG996/MG996R, 360° Continuous Rotation | mindestens 1 | S1: Variantenkorrektur, Nutzer sagt unbenutzt | Kein Positionsservo für feste Klappen-/Kippwinkel |
| Netzteil 12 V / 10 A | 1 laut alter Liste | S1: Teileliste und Motorversuche | Tischtest, kein mobiler Akku |
| 608ZZ-Lager | Menge unbekannt | S1 | Zum Teil in den Skater-Rädern; Anzahl und Einbauzustand unbekannt |
| Schrauben-/Muttern-/Scheibenset M2–M5 | 1 Sortiment | S1: Nutzer kopiert Angebotsliste | M3×8/12/16 erwähnt; aktueller Restbestand unbekannt |
| PVC-90°-Rohrbogen | mindestens 1 | S1: gekauft erwähnt | Alter Ballkanal; Nennweite 75 mm nur als historischer Suchhinweis, Ist-Innen-/Außenmaß fehlen |
| Ninebot Max G30D2-Akku | 1 | S4: Nutzer bestätigt kostenlos vorhanden | 36 V nominal, 42 V voll, 551 Wh / 15,3 Ah; Maße/Anschlüsse fehlen |
| Lötkolben, Leitungen und einfaches Abisolierwerkzeug | vorhanden im Testkontext | S1 | Genaue Werkzeuge, Querschnitte und belastbare Verbindungen noch erfassen |
| Bambu P1S | 1 vom Nutzer genannt | S1 | Fertigungsmittel; aktuelles Profil/Düse/Material nicht vollständig dokumentiert |

WS2812B, Widerstände und Kondensatoren aus einem anderen ESP32-Projekt werden im Altchat erwähnt. Sie werden hier nicht ohne separate Bestätigung als für den Rover verfügbar verplant.

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

S3 stammt aus der wiedergefundenen Unterhaltung vom 08.09.2026. Falls Claude Belege für einen späteren Kauf hat, Datum und Quelle ergänzen, danach Status aktualisieren.

## Nur empfohlen / konstruktiv geplant

- Zwei N20-Getriebemotoren wurden vor JGB37-520 als Beispiel für die Bänder empfohlen. Kein gesicherter zusätzlicher Bestand.
- Zwei Ball-Caster-Kits, vier Umlenkrollen, Bandmaterial bzw. gedruckte Kettenglieder.
- HC-SR04 und Bumper waren im alten Motortest ausdrücklich noch nicht vorhanden; heutiger Stand offen.
- Crimpzange für Aderendhülsen wurde zur Bestellung vorgeschlagen. Bestellung/Ankunft nicht bestätigt.
- M3-Gewindeeinsätze, Madenschrauben, Stifte und zusätzliche Positionsservos wurden diskutiert. Nicht als vorhandenes Set verplanen.
- LiFePO4-, Blei- und 3S-LiPo-Akkus waren alte Alternativen. Belegt vorhanden ist später der Ninebot-Akku, nicht zusätzlich jeder vorgeschlagene Akku.
- Hochvoltgeeignete DC/DC-Versorgung, Sicherungen, Abschaltung, Ladeanschluss und genaue Stecker sind noch zu spezifizieren.

## Schraubensortiment: überlieferte Angebotsliste

Kein Zählprotokoll. Kopierter Titel „320PCS“, tatsächlichen Lieferinhalt bei Bedarf prüfen.

| Größe | Muttern | Schrauben | Weitere genannte Teile |
|---|---:|---|---|
| M2 | 20 | 20 × 6 mm | 20 Unterlegscheiben, 20 Federscheiben |
| M2,5 | 20 | 20 × 8 mm | 20 Unterlegscheiben, 20 Federscheiben |
| M3 | 20 | 10 × 8 mm; je 5 × 12/16 mm | Unterleg-/Federscheiben in der kopierten Liste nach Schraubenlängen gruppiert |
| M4 | 10 | je 5 × 8/16 mm | Entsprechende Unterleg-/Federscheiben genannt |
| M5 | 10 | je 5 × 8/16 mm | Entsprechende Unterleg-/Federscheiben genannt |

Schraubenkopf, Gewindesteigung und Insertaufnahme nicht aus dem Sortimentstitel konstruieren; das tatsächlich verwendete Verbindungsmittel bestimmen.
