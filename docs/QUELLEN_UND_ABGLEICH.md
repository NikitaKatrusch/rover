# Quellen und historischer Projektabgleich

Zusammenführung vom 05.11.2026. Nur projektbezogene Informationen; keine sachfremden persönlichen Daten.

## Projektquellen

| Kennung | Quelle | Aussagekraft |
|---|---|---|
| S1 | [`rover_chat_komplett.txt`](../rover_chat_komplett.txt), initialer Repo-Stand c3ccfbd | Historischer Text; Bild-/Dateianhänge und Toolaufrufe sind ausdrücklich nicht enthalten. Nutzer- und Assistentenaussagen unterscheiden. |
| S2 | [`ballsammler-rover-aufsammelmechanismus.md`](../ballsammler-rover-aufsammelmechanismus.md) | Thematische Zusammenfassung des Aufnahme-Konzepts, mit damaligen Vorschlägen und verworfenen Ansätzen. |
| S3 | Wiedergefundener Chat, 08.09.2026, ca. 11:12 Uhr Europe/Berlin | Warenkorb: 775, BTS7960, JGB37-520, L298N, GT2, Servo- und Radvarianten, LM2596. Kein gesicherter Kaufabschluss. Original dieses späteren Chats liegt hier noch nicht vollständig vor. |
| S4 | Wiedergefundene Nutzeraussagen, 21.09.2026, ca. 08:57/09:01 Uhr Europe/Berlin | Ninebot Max G30D2 kostenlos vorhanden; 36 V nominal, 42 V voll, 551 Wh / 15,3 Ah. Keine gesicherten Stecker-/Gehäusemaße. |
| S5 | Wiedergefundene Unterhaltung, 23.09.2026, ca. 20:16/20:17 Uhr Europe/Berlin | Wunsch nach detailliertem Systemplan; 66-mm-Ball/63-mm-Spalt als alte Assistentenfrage. Keine Messung oder erfolgreiche Passprobe daraus ableiten. |
| S6 | Zwei tatsächliche lokale Dateien aus `Downloads/Ballsammler_Rover/` und `Downloads/RoverV2/` | Archivierte Quelltexte; SHA-256 und Dateizeit im Firmware-Archiv. Kein Beweis für den derzeit geflashten oder funktionierenden Stand. |
| S7 | Frühere Nutzerautorisierung vom 05.11.2026 | Beide Assistenten sollten zunächst Wissen im Repo zusammenführen. Fusion für maßhaltige Konstruktion gewünscht. Die Zuständigkeit wurde anschließend durch S9 aktualisiert. |
| S8 | Claudes README, Commit 7faeb8405e78606ca203fc4d4415599080a89c14 | Während der Zusammenführung eingetroffen und gelesen; als historische Projektquelle erhalten. |
| S9 | Neueste Nutzeranweisung vom 05.11.2026: „Claude vergessen wir nur noch du arbeitest da dran“ | Weitere Projektarbeit allein durch Codex. Keine weitere Abstimmung oder Mitarbeit von Claude voraussetzen; vorhandenes Projektwissen bleibt nutzbar. |
| S10 | Nikitas Konzept und Tinkercad-Screenshot „Neat Kasi“ vom 07.11.2026 | Ball unter dem Rover, hinten Schnecke, Speicher und Vereinzelung, Schussräder neigen, Rover dreht, Android-Kamera und Netzteil zuerst. Screenshot zeigt Konzeptgeometrie, keine verifizierten Istmaße. |
| S11 | Fusion-Lauf und [Prüfbericht](../cad/referenz/pruefbericht.json) vom 07.11.2026 | B-Rep-Abmessungen und Einbaupositionen der Referenzkörper. Nachweis für die erzeugte CAD-Geometrie. |
| S12 | Vom Nutzer am 07.11.2026 übermittelte abgeschlossene AliExpress-Bestellungen vom 26.05.2026 und 08.11.2025 | Belegt bestellte Varianten und Mengen, darunter 775 ohne Ritzel, 72-mm-Räder, separates 608ZZ-10er-Pack, L298N, Netzteil, Mega und zwei WROOM-32D-Boards. Physischer Zählbestand, Istmaße und elektrische Eignung stehen aus. |
| S13 | Nutzerlink zum [L298N-Artikel](https://de.aliexpress.com/item/1005008221386573.html) und dazu übermitteltes Angebotsbild vom 07.11.2026 | Bild zeigt rote Platine mit schwarzem Kühlkörper, Schraubklemmen und Steckbrücken. Produktseite beim Abruf nicht verfügbar. Das Bild belegt weder die Beschriftung am gelieferten Exemplar noch dessen Belastbarkeit. |

S3–S5 sind aus wiedergefundenem Gesprächskontext zusammengefasst. Sie werden nicht als neu vom Nutzer bestätigte Inventur oder wortgetreuer vollständiger Chat ausgegeben. Exakte Chattitel und Direktlinks wurden nicht geliefert. Kein erfundener Chatlink.

Chronologiehinweis: Der früheste wiedergefundene Ballmaschinen-Satz liegt bei 08.07.2026 22:29 UTC, also 09.07.2026 00:29 in Deutschland. Die übermittelten abgeschlossenen Rover-Bestellungen tragen das Datum 26.05.2026 [S12]. Die alte Angabe „27. Mai“ in S1 war eine rückblickende Zuordnung. Die Gesamtchronologie ist daher nicht vollständig rekonstruiert.

## Widersprüche und Leseregeln

| Thema | Nicht ungeprüft übernehmen | Gemeinsame Behandlung |
|---|---|---|
| MG996R | Name ohne 180°/360°; frühere Zuordnung als Bürstenantrieb oder Positions-Klappenservo | Nutzer korrigiert: vorhandener Servo unbenutzt und dreht durch. 360°-Ausführung separat von späterem 180°-Warenkorb führen. |
| Teilekauf | Warenkorb = Lieferung | Bis zum Beleg als Warenkorb führen. |
| Fahrwerk | Alle alten Rampen-, Platten- und Castermaße gelten gleichzeitig | Versionsstände trennen; neue CAD-Datei entscheidet aktuelle Lage. „Unter dem Chassis“ und „hinten“ können zugleich stimmen. |
| Radadapter | Ø 22 bezeichnet Radaußen-Ø; Ø 5,6 passt sicher auf 5-mm-Welle | Größen richtig zuordnen; gedruckte Passung war laut Nutzer zu groß. |
| Motorwelle | 13 mm gleich 0,55 in | Umrechnung stimmt nicht; Länge nachmessen. |
| Trichter | Außenvolumen = garantierte Kapazität | Innenraum, Auslauf und Ballbrücken praktisch testen. |
| 66/63 mm | Funktionsnachweis für Ballkompression | Als ungetestete Diskussion kennzeichnen. |
| Motorfehler | Kabel, Lötstelle oder Motor sicher allein schuld | Ursachen nicht nachgewiesen; Treiber, Anlaufstrom und Versorgung mitprüfen. |
| GPIO12→17 | Bootfehler sicher behoben | Änderung dokumentiert, Gesamterfolg im Verlauf nicht bestätigt. |
| Automatik | Zeitkurve = exakter Winkel / lückenlose Platzabdeckung | Ohne Rückführung und Praxistest nur zeitgesteuerter Versuch. |
| Akku | Frühere 12-V-Empfehlungen gelten unverändert für Ninebot | Neu dimensionieren für maximal 42 V plus geeignete Reserve. |
| Parallelbetrieb | Zwei getrennte Modi erfüllen automatisch den Wunsch Sammeln+Schießen | Zustandsmodell später bewusst definieren. |
| Fortführung | Ein alter Chat enthält automatisch den aktuellen Repository-Stand | Codex liest vor der weiteren Arbeit den aktuellen Commit und die Projektdateien; Zuständigkeit gemäß S9. |

## Technische Primärquellen, am 05.11.2026 geprüft

- E1: Texas Instruments, [LM2596 Produktdaten](https://www.ti.com/product/LM2596): maximal 40 V regulärer Eingang.
- E2: Infineon, [BTS7960 Datenblatt](https://www.infineon.com/assets/row/public/documents/10/57/infineon-bts7960-ds-en.pdf): Betriebsspannungsbereich bis 27,5 V. Modulaufbau separat prüfen.
- E3: STMicroelectronics, [L298 Datenblatt](https://www.st.com/resource/en/datasheet/l298.pdf): Chipdaten, keine Pauschalfreigabe beliebiger L298N-Boards oder 775-Motoren.
- E4: Espressif, [ESP32-Datenblatt](https://documentation.espressif.com/esp32_datasheet_en.html): GPIO-/Versorgungsgrenzen und Strapping-Pins.
- F1: Autodesk, [Fusion MCP verbinden](https://help.autodesk.com/cloudhelp/ENU/ADSKMCP-FusionDesktopMcp/files/ADSKMCP_FusionDesktopMcp_connecting_to_the_fusion_mcp_server_html.html).
- F2: Autodesk, [offizielle AI-Integrationen](https://github.com/Autodesk/ai-integrations): Dokumentationszugriff und tatsächliche Fusion-Modellierung unterscheiden.
- F3: Autodesk, [Scripts and Add-ins](https://help.autodesk.com/cloudhelp/ENU/Fusion-Model/files/SLD-MANAGE-SCRIPTS-ADD-INS.htm).
- F4: Autodesk, [API-Einheiten](https://help.autodesk.com/cloudhelp/ENU/Fusion-360-API/files/Units_UM.htm) und [UserParameters.add](https://help.autodesk.com/cloudhelp/ENU/Fusion-360-API/files/fusion_UserParameters_add.htm).
- F5: Autodesk, [Designexport](https://help.autodesk.com/cloudhelp/ENU/Fusion-Designs/files/ASM-EXPORT-DESIGN.htm).

Keine fremden CAD-Modelle oder vollständigen Herstellerunterlagen wurden übernommen; Links dienen der überprüfbaren Begründung.
