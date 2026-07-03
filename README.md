# Techem Design System – Audit Dashboard

Interaktives, eigenständiges Dashboard (kein Build-Step, kein Server nötig) zur Analyse des
Techem Design Systems in Figma (`❖ Techem Components_NEW`, Datei-Key `edSvpy3ljxv7By9kNVxElc`).

## Öffnen

Einfach `index.html` im Browser öffnen (Doppelklick reicht, funktioniert auch offline via `file://`).

Oben rechts kann per **DE/EN-Toggle** die komplette Oberfläche inkl. aller Findings, Empfehlungen
und Token-Beschreibungen zwischen Deutsch und Englisch umgeschaltet werden. Die Wahl wird im
Browser gespeichert (localStorage) und bleibt beim nächsten Öffnen erhalten.

## Struktur (nach UI/UX-Redesign)

Das Dashboard hat zwei Ansichten, umschaltbar über Tabs oben links (📄 Report / 📊 Stats):

**📄 Report** – geführter Report mit 6 Kapiteln (sticky Kapitel-Navigation, Scrollspy):
1. **Überblick** – 5 Kern-Kennzahlen, klickbar
2. **Empfehlungen** – Top-10 priorisiert
3. **Befunde im Detail** – EIN einheitlicher, nach Thema filterbarer Findings-Browser (Naming,
   Tokens, Components, Foundations) statt vieler separater Karten-Raster; standardmäßig werden
   die 5 wichtigsten pro Thema gezeigt, Rest über "weitere anzeigen"
4. **Architektur & Wiederverwendung** – Komplexitäts-Quadrant + kompakte Stat-Strips
5. **Tokens & Variablen** – Collections + Farb-Duplikat-Gruppen (Top 4, Rest aufklappbar)
6. **Explorer** (Werkzeug-Kapitel) – durchsuchbare/filterbare/sortierbare Tabelle aller Components.
   Klick auf eine Zeile öffnet ein **Sidesheet** (Seitenpanel) mit strukturierten Details:
   Anwendungshinweise (kontextabhängig generiert, z.B. "kein offizielles Namensschema" oder
   "keine bekannten Probleme"), Übersicht, Varianten-Achsen, Komplexitäts-Breakdown, Findings und
   interne Abhängigkeiten. Schließen via X-Button, Klick auf Hintergrund, oder Escape-Taste.

**📊 Stats** – Infografik-Erklärung für Nicht-Designer/-Entwickler (bewusst ohne Fachbegriffe,
mit Alltags-Vergleichen erklärt, "als müsste man es einem 14-Jährigen beibringen"):
1. Gesamt-Note als Tacho/Geschwindigkeitsmesser (78/100 = "Befriedigend")
2. Namensregeln als Donut-Chart + Schul-Kleiderordnung-Vergleich
3. Doppelte Farbnamen als Balkendiagramm + Buntstift-Vergleich
4. "Ein Wort, 5 Bedeutungen" (das Wort „Type") als Wort-Hub-Grafik
5. Komplizierteste Bauteile als Balkendiagramm + Lego-Vergleich
6. Echte Nutzung als Donut-Chart (6,2%) + Rucksack-Laden-Vergleich
7. Kaputte Bauteile als Icon-Reihe + Spielzeug-Vergleich

Siehe `PRODUCT.md` und `DESIGN.md` im selben Ordner für die strategischen bzw. visuellen
Design-Entscheidungen hinter dem Redesign.

## Inhalt

- **Executive Summary** – Health-Scores + klickbare KPI-Kacheln (filtern den Explorer)
- **Top-10-Handlungsempfehlungen** – priorisiert nach Impact/Aufwand, mit Link in die betroffenen Components
- **Components-Explorer** – durchsuchbare/filterbare/sortierbare Tabelle aller 187 Component Sets + 49 Standalone Components (Icons/Avatare/Logos bewusst ausgeklammert), mit aufklappbarer Detailansicht pro Zeile
- **Struktur & Naming Findings** – konkrete Naming-/ID-Probleme mit Beispielen
- **Komplexität & Abhängigkeiten** – Quadranten-Chart (Komplexität × Anzahl Findings)
- **Tokens & Variablen** – Collections-Übersicht + Farb-Duplikat-Gruppen mit Risiko-Einstufung

## Dateien

| Datei | Zweck |
|---|---|
| `index.html` | Struktur/Markup |
| `styles.css` | Styling (Techem-Brandfarben, 1:1 aus den extrahierten Color-Tokens) |
| `data.js` | **Generiert** – `window.DASHBOARD_DATA`, alle Rohdaten. Nicht von Hand editieren. |
| `app.js` | Rendering, Suche, Filter, Sortierung, Interaktionen (vanilla JS, keine Dependencies) |

## Datenherkunft & Methodik

Alle Daten wurden per Figma Desktop-Bridge-Plugin direkt aus der Figma-Datei extrahiert
(Stand siehe Header im Dashboard). Kurzfassung der Methodik:

1. Alle 93 Pages klassifiziert (library / foundations / assets / examples / sandbox).
2. Für die 65 „library“-Pages: alle Component Sets + Standalone Components inventarisiert
   (Varianten-Achsen, Component Properties, Beschreibung).
3. Für jedes Component Set: verschachtelte Instanzen im ersten Variant ausgelesen
   (Struktur-/Abhängigkeits-Analyse, `nested_instance_count` + `max_depth`).
4. Instanzen pro Page aggregiert (Reuse-Proxy, siehe Einschränkung unten).
5. Alle Design-Token-Collections + Farbwerte je Marken-Modus (Techem/BFWT/Inexogy) ausgelesen,
   auf Duplikate/Redundanzen geprüft.
6. Ergebnisse angereichert um abgeleitete Felder (`id_status`, `family_type`,
   `structural_score`, `variant_score`, `findings`) und als `data.js` exportiert.

**Wichtige Einschränkungen** (auch im Footer des Dashboards dokumentiert):
- Reuse/Adoption wird nur innerhalb dieser einen Figma-Datei gemessen (keine Anbindung an
  Produkt-/App-Dateien).
- Icons/Avatare/Logos (~8.400 Nodes) wurden nur oberflächlich geprüft, um die Statistiken der
  eigentlichen UI-Komponenten nicht zu verzerren.
- Der Komplexitäts-Score ist eine Heuristik zur groben Priorisierung, kein absolutes
  Qualitätsurteil.
- Duplikat- und „ohne Component gebaut“-Funde sind Kandidatenlisten mit Beispielen, keine
  100% vollständige Erhebung.

## Aktualisieren

Die Daten sind ein Snapshot vom Analyse-Datum im Header. Für ein Re-Audit empfiehlt sich,
dieselbe Methodik erneut über die Figma Desktop-Bridge durchzuführen und `data.js` neu zu
generieren (Struktur siehe oben) – idealerweise mit demselben Scoring-Schema, um Werte über
Zeit vergleichbar zu halten.
