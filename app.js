// Techem Design System Audit Dashboard – App-Logik (vanilla JS, keine Dependencies)
(function () {
  "use strict";

  const DATA = window.DASHBOARD_DATA;
  if (!DATA) {
    document.body.innerHTML = "<p style='padding:40px;font-family:sans-serif'>Fehler: data.js konnte nicht geladen werden. / Error: data.js could not be loaded.</p>";
    return;
  }

  // ---------------------------------------------------------------------
  // 0. I18N
  // ---------------------------------------------------------------------
  const I18N = {
    de: {
      eyebrow: "Design System Audit · ❖ Techem Components_NEW",
      title: "Wie gesund ist das Techem Design System?",
      heroScoreLbl: "Health Score",
      heroVerdict: 'Der Health-Score liegt bei <b>78 von 100</b> ("needs work"). Die größten Schwachstellen: <b>Naming-Konsistenz</b> und <b>Konsistenz allgemein</b>. Dieses Dashboard führt dich durch die wichtigsten Befunde – von der Kurzfassung bis zum Rohdaten-Explorer.',
      metaDateLabel: n => `Stand: ${n}`,
      metaScopeLabel: (a, b, c, d) => `${a} Component Sets + ${b} Standalone Components analysiert (von ${c} Sets gesamt, ${d} Pages)`,
      metaReuseNote: "Reuse-Messung nur innerhalb dieser Datei",

      navOverview: "Überblick", navRecommendations: "Empfehlungen", navFindings: "Befunde",
      navArchitecture: "Architektur", navTokens: "Tokens", navExplorer: "Explorer",

      ovEyebrow: "Kapitel 1", ovTitle: "Überblick",
      ovSub: "Die wichtigsten Kennzahlen auf einen Blick. Jede Kachel ist klickbar und springt zu den passenden Befunden.",

      recoEyebrow: "Kapitel 2",
      secRecoTitle: "Was als Nächstes zu tun ist",
      secRecoSub: "Die 10 wichtigsten Handlungsempfehlungen, priorisiert nach Wirkung und Aufwand.",
      recoBtn: "Details →",
      impactLabel: "Impact:",
      effortLabel: "Aufwand:",

      findEyebrow: "Kapitel 3",
      secNamingTitle: "Befunde im Detail",
      secNamingSub: "Alle konkreten, evidenzbasierten Einzelbefunde – gefiltert nach Thema. Standardmäßig werden die wichtigsten 5 gezeigt.",
      topicAll: "Alle", topicNaming: "Naming & Struktur", topicTokens: "Tokens", topicComponents: "Components", topicFoundations: "Foundations",
      showMoreFindings: n => `${n} weitere Befunde anzeigen`,
      showLessFindings: "Weniger anzeigen",

      archEyebrow: "Kapitel 4",
      secComplexityTitle: "Architektur & Wiederverwendung",
      secComplexitySub: "Komplexität als zwei Teil-Scores (Struktur, Varianten) statt einer Zahl. Der Quadrant zeigt Komplexität gegen Anzahl Findings – rechts oben zuerst anfassen.",
      quadXAxis: "Komplexität (Composite-Score) →",
      quadYAxis: "Anzahl Findings →",
      quadTackleFirst: "zuerst anfassen →",
      variantStructureLabel: "Struktureller Varianten-Check (alle 187 Sets, nicht nur 1. Variant)",
      toplevelLabel: "Echte Top-Level-Adoption (Parent-Chain-Analyse)",

      tokEyebrow: "Kapitel 5",
      secTokensTitle: "Tokens & Variablen",
      secTokensSub: "286 Variablen in 7 Collections. Kernbefund: massive Namens-Redundanz bei Farbtokens.",
      showMoreDup: n => `${n} weitere Farbgruppen anzeigen`,
      showLessDup: "Weniger anzeigen",

      explEyebrow: "Kapitel 6 · Werkzeug",
      secExplorerTitle: "Alle Components durchsuchen",
      secExplorerSub: "Für die Vertiefung: alle 236 Component Sets + Standalone Components, such-/filter-/sortierbar.",
      legendOfficial: "ID-Status: offiziell (IFE-/FOE-ID)",
      legendInternal: "intern (_prefix / veraltet)",
      legendAdhoc: "kein Schema",
      searchPlaceholder: "Suche nach Name, Page, ID…",
      optKindAll: "Alle Typen", optKindSet: "Component Sets", optKindStandalone: "Standalone Components",
      optIdstatusAll: "Alle ID-Status", optIdstatusOfficial: "offiziell", optIdstatusInternal: "intern", optIdstatusAdhoc: "kein Schema",
      optFamilyAll: "Alle Familien",
      optFindingtagAll: "Alle Findings",
      onlyFindings: "Nur mit Findings",
      clearBtn: "Filter zurücksetzen",
      thName: "Name", thPage: "Page", thKind: "Typ", thIdstatus: "ID-Status", thFamily: "Familie",
      thVariants: "Varianten", thComplexity: "Komplexität", thFindings: "Findings",
      resultCount: (n, total, sets, standalone) => `${n} von ${total} Components (${sets} Sets + ${standalone} Standalone)`,

      badgeOfficial: "offiziell", badgeInternal: "intern", badgeAdhoc: "kein Schema",

      detailOverview: "Übersicht", detailKey: "Key:", detailExtractedId: "Erkannte ID:", detailNone: "keine",
      detailUsageSet: (n, d) => `Verschachtelte Instanzen im 1. Variant: <b>${n}</b>, max. Tiefe: <b>${d}</b>`,
      detailUsageStandalone: (n, p) => `Instanzen (in dieser Datei gefunden): <b>${n}</b> auf ${p} Page(s)`,
      detailDescription: "Beschreibung:", detailAxes: "Varianten-Achsen", detailAxesValues: v => `${v} Werte`,
      detailComplexity: "Komplexität (Breakdown)", detailStructScore: "Struktur-Score:", detailStructScoreNote: "(Tiefe/Verschachtelung)",
      detailVariantScore: "Varianten-Score:", detailVariantScoreNote: "(Varianten × Achsen)",
      detailComposite: "Composite:", detailCompositeNote: "(Heuristik, siehe Footer)",
      detailFindings: "Findings", detailNoFindings: "keine",
      detailDeps: "Interne Abhängigkeiten (Stichprobe aus 1. Variant)", detailNoDeps: "keine verschachtelten Abhängigkeiten gefunden",
      usageHintsTitle: "Anwendungshinweise",

      footerMethodikTitle: "Methodik",
      footerMethodikList: [
        "Datenquelle: Figma Desktop-Bridge-Plugin.",
        "Icons/Avatare/Logos (~8.400 Nodes) bewusst nur oberflächlich geprüft, um Statistiken der UI-Komponenten nicht zu verzerren.",
        "Reuse/Adoption nur innerhalb dieser einen Datei gemessen (mit Auftraggeber abgestimmt).",
        "Duplikat- und „ohne Component gebaut“-Funde sind Kandidatenlisten mit Beispielen, keine 100% vollständige Erhebung.",
      ],
      footerScoreTitle: "Komplexitäts-Score – Formel & Grenzen",
      footerScoreList: [
        "Struktur-Score = verschachtelte Instanzen × 1 + max. Tiefe × 5",
        "Varianten-Score = Varianten × 0.5 + Achsen × 3",
        "Heuristik zur groben Sortierung/Priorisierung – <b>kein</b> absolutes Qualitätsurteil.",
      ],
      footerSourcesTitle: "Quellen",
      footerSourcesList: [
        'Figma-Datei: <a href="https://www.figma.com/design/edSvpy3ljxv7By9kNVxElc" target="_blank" rel="noopener">❖ Techem Components_NEW</a>',
        "Vollständiger Analyse-Report (Fließtext): <code>files/design-system-analysis.md</code> in der Session",
        "Unabhängiger Referenzwert: figma_audit_design_system Health-Score",
      ],
      severityLabels: { hoch: "hoch", mittel: "mittel", niedrig: "niedrig" },

      tabReport: "Report", tabStats: "Stats",
      statsIntroTitle: "Die Kernergebnisse des Audits – ohne Fachvokabular",
      statsIntroSub: "Dieselben Befunde wie im Report, aber visuell aufbereitet und mit Vergleichen aus dem Arbeitsalltag erklärt – für alle, die schnell verstehen wollen, wo der größte Handlungsbedarf liegt.",
      analogyKicker: "Zur Einordnung",

      stat1Title: "1. Gesamtbewertung",
      stat1Explain: "Das System erreicht <b>78 von 100 Punkten</b> – Kategorie <b>„solide, aber ausbaufähig“</b>. Es funktioniert im Tagesgeschäft zuverlässig, einzelne Schwachstellen summieren sich über Zeit aber zu spürbarem Mehraufwand.",
      gaugeGradeGood: "Stark", gaugeGradeOk: "Solide", gaugeGradeMeh: "Ausbaufähig", gaugeGradeBad: "Kritisch",

      stat2Title: "2. Werden die Namenskonventionen eingehalten?",
      donut1Lbl: "folgen der Konvention",
      stat2Explain: "Es existiert eine verbindliche Namenskonvention (z.B. „IFE-003 Button“). Eingehalten wird sie aber nur bei <b>{PCT}%</b> aller Bauteile. Der Rest trägt keinen oder einen veralteten Namen.",
      stat2Analogy: "Vergleichbar mit einer Ablagestruktur im Team, an die sich nur jeder Vierte hält – der Rest legt Dateien nach eigenem System ab. Nach kurzer Zeit ist nicht mehr nachvollziehbar, welche Version aktuell ist.",

      stat3Title: "3. Wie oft trägt dieselbe Sache unterschiedliche Namen?",
      stat3Explain: "Einzelne Farbwerte im System sind unter <b>mehr als 20 verschiedenen Namen</b> hinterlegt – obwohl es sich um exakt denselben Farbton handelt. Das macht es kaum möglich, die verbindliche Bezeichnung zu bestimmen.",
      stat3Analogy: "Vergleichbar mit einem Unternehmen, in dem 24 Abteilungen denselben Markenfarbton jeweils anders benennen. Am Ende lässt sich nicht mehr sicher sagen, ob zwei Bezeichnungen wirklich dieselbe Farbe meinen.",

      stat4Title: "4. Ein Begriff, fünf unterschiedliche Bedeutungen",
      stat4Explain: "Der Begriff <b>„Type“</b> wird in 5 verschiedenen Bauteilen verwendet – und bezeichnet dabei jedes Mal etwas völlig anderes.",
      stat4Analogy: "Vergleichbar mit dem Begriff „Status“ in einem Unternehmen, der in der Buchhaltung etwas anderes bedeutet als im Support oder im Vertrieb. Missverständnisse sind bei so einer Mehrfachbelegung vorprogrammiert.",
      hub1: "Navigations-Rolle", hub2: "Darstellungsform", hub3: "Eingabe-Art", hub4: "Inhaltsart", hub5: "Größenangabe",

      stat5Title: "5. Welche Bauteile sind unnötig komplex?",
      stat5Explain: "Einzelne Bauteile bestehen aus einer sehr hohen Zahl kleinteiliger Elemente, die sich zudem uneinheitlich verhalten. Das erschwert Wartung und Weiterentwicklung und erhöht das Fehlerrisiko.",
      stat5Analogy: "Vergleichbar mit einer Montageanleitung, bei der jeder Arbeitsschritt anders dargestellt ist, obwohl es sich technisch um denselben Vorgang handelt.",

      stat6Title: "6. Wie viel davon wird tatsächlich verwendet?",
      donut2Lbl: "tatsächlich im Einsatz",
      stat6Explain: "Von allen in der Datei angelegten Elementen wird nur ein kleiner Teil tatsächlich in echten Screens verwendet. Der überwiegende Rest sind Beispiele, Icons oder Dokumentationsmaterial.",
      stat6Analogy: "Vergleichbar mit einem Lager, in dem nur ein Bruchteil des Bestands je verkauft wird – der Rest liegt vor, ohne je zum Einsatz zu kommen.",

      stat7Title: "7. Defekte Bauteile, die weiterhin verfügbar sind",
      stat7Explain: "Eine Reihe von Bauteilen funktioniert technisch nicht mehr korrekt – sie erzeugen Fehler beim Öffnen –, sind im System aber weiterhin auffindbar und nutzbar.",
      stat7Analogy: "Vergleichbar mit als defekt markierten Teilen in einem Ersatzteillager, die trotzdem im Regal verbleiben – das fällt erst auf, wenn jemand sie tatsächlich einsetzen will.",
    },

    en: {
      eyebrow: "Design System Audit · ❖ Techem Components_NEW",
      title: "How healthy is the Techem Design System?",
      heroScoreLbl: "Health Score",
      heroVerdict: 'The health score is <b>78 out of 100</b> ("needs work"). The biggest weak spots: <b>naming consistency</b> and <b>overall consistency</b>. This dashboard walks you through the key findings, from the summary down to the raw-data explorer.',
      metaDateLabel: n => `As of: ${n}`,
      metaScopeLabel: (a, b, c, d) => `${a} component sets + ${b} standalone components analyzed (of ${c} total sets, ${d} pages)`,
      metaReuseNote: "Reuse measured within this file only",

      navOverview: "Overview", navRecommendations: "Recommendations", navFindings: "Findings",
      navArchitecture: "Architecture", navTokens: "Tokens", navExplorer: "Explorer",

      ovEyebrow: "Chapter 1", ovTitle: "Overview",
      ovSub: "The key figures at a glance. Every tile is clickable and jumps to the matching findings.",

      recoEyebrow: "Chapter 2",
      secRecoTitle: "What to do next",
      secRecoSub: "The 10 most important recommendations, prioritized by impact and effort.",
      recoBtn: "Details →",
      impactLabel: "Impact:",
      effortLabel: "Effort:",

      findEyebrow: "Chapter 3",
      secNamingTitle: "Findings in Detail",
      secNamingSub: "Every concrete, evidence-based finding, filterable by topic. The top 5 are shown by default.",
      topicAll: "All", topicNaming: "Naming & Structure", topicTokens: "Tokens", topicComponents: "Components", topicFoundations: "Foundations",
      showMoreFindings: n => `Show ${n} more findings`,
      showLessFindings: "Show less",

      archEyebrow: "Chapter 4",
      secComplexityTitle: "Architecture & Reuse",
      secComplexitySub: "Complexity as two separate scores (structure, variants) instead of one number. The quadrant plots complexity against number of findings – top-right means tackle first.",
      quadXAxis: "Complexity (composite score) →",
      quadYAxis: "Number of findings →",
      quadTackleFirst: "tackle first →",
      variantStructureLabel: "Structural variant check (all 187 sets, not just the 1st variant)",
      toplevelLabel: "True top-level adoption (parent-chain analysis)",

      tokEyebrow: "Chapter 5",
      secTokensTitle: "Tokens & Variables",
      secTokensSub: "286 variables across 7 collections. Core finding: massive naming redundancy in color tokens.",
      showMoreDup: n => `Show ${n} more color groups`,
      showLessDup: "Show less",

      explEyebrow: "Chapter 6 · Tool",
      secExplorerTitle: "Search All Components",
      secExplorerSub: "For deeper research: all 236 component sets + standalone components, searchable/filterable/sortable.",
      legendOfficial: "ID status: official (IFE-/FOE-ID)",
      legendInternal: "internal (_prefix / deprecated)",
      legendAdhoc: "no naming scheme",
      searchPlaceholder: "Search by name, page, ID…",
      optKindAll: "All types", optKindSet: "Component Sets", optKindStandalone: "Standalone Components",
      optIdstatusAll: "All ID statuses", optIdstatusOfficial: "official", optIdstatusInternal: "internal", optIdstatusAdhoc: "no scheme",
      optFamilyAll: "All families",
      optFindingtagAll: "All findings",
      onlyFindings: "Only with findings",
      clearBtn: "Reset filters",
      thName: "Name", thPage: "Page", thKind: "Type", thIdstatus: "ID Status", thFamily: "Family",
      thVariants: "Variants", thComplexity: "Complexity", thFindings: "Findings",
      resultCount: (n, total, sets, standalone) => `${n} of ${total} components (${sets} sets + ${standalone} standalone)`,

      badgeOfficial: "official", badgeInternal: "internal", badgeAdhoc: "no scheme",

      detailOverview: "Overview", detailKey: "Key:", detailExtractedId: "Detected ID:", detailNone: "none",
      detailUsageSet: (n, d) => `Nested instances in the 1st variant: <b>${n}</b>, max. depth: <b>${d}</b>`,
      detailUsageStandalone: (n, p) => `Instances found in this file: <b>${n}</b> across ${p} page(s)`,
      detailDescription: "Description:", detailAxes: "Variant Axes", detailAxesValues: v => `${v} values`,
      detailComplexity: "Complexity (Breakdown)", detailStructScore: "Structural score:", detailStructScoreNote: "(depth/nesting)",
      detailVariantScore: "Variant score:", detailVariantScoreNote: "(variants × axes)",
      detailComposite: "Composite:", detailCompositeNote: "(heuristic, see footer)",
      detailFindings: "Findings", detailNoFindings: "none",
      detailDeps: "Internal dependencies (sample from 1st variant)", detailNoDeps: "no nested dependencies found",
      usageHintsTitle: "Usage Guidance",

      footerMethodikTitle: "Methodology",
      footerMethodikList: [
        "Data source: Figma Desktop Bridge plugin.",
        "Icons/avatars/logos (~8,400 nodes) were deliberately only checked superficially, to avoid skewing the UI component statistics.",
        "Reuse/adoption measured only within this one file (agreed with the requester).",
        "Duplicate- and \u201cbuilt without a component\u201d-findings are candidate lists with examples, not a 100% complete survey.",
      ],
      footerScoreTitle: "Complexity Score – Formula & Limits",
      footerScoreList: [
        "Structural score = nested instances × 1 + max. depth × 5",
        "Variant score = variants × 0.5 + axes × 3",
        "A heuristic for rough sorting/prioritization – <b>not</b> an absolute quality judgment.",
      ],
      footerSourcesTitle: "Sources",
      footerSourcesList: [
        'Figma file: <a href="https://www.figma.com/design/edSvpy3ljxv7By9kNVxElc" target="_blank" rel="noopener">❖ Techem Components_NEW</a>',
        "Full written analysis report: <code>files/design-system-analysis.md</code> in the session",
        "Independent reference value: figma_audit_design_system health score",
      ],
      severityLabels: { hoch: "high", mittel: "medium", niedrig: "low" },

      tabReport: "Report", tabStats: "Stats",
      statsIntroTitle: "The audit's core findings – without the jargon",
      statsIntroSub: "The same findings as in the report, presented visually and explained through everyday work comparisons – for anyone who wants to quickly understand where the greatest need for action lies.",
      analogyKicker: "For context",

      stat1Title: "1. Overall Assessment",
      stat1Explain: "The system scores <b>78 out of 100 points</b> – category <b>\u201csolid, but room to improve\u201d</b>. It holds up reliably in day-to-day use, but individual weak spots add up to noticeable overhead over time.",
      gaugeGradeGood: "Strong", gaugeGradeOk: "Solid", gaugeGradeMeh: "Needs work", gaugeGradeBad: "Critical",

      stat2Title: "2. Are naming conventions being followed?",
      donut1Lbl: "follow the convention",
      stat2Explain: "A binding naming convention exists (e.g. \u201cIFE-003 Button\u201d). Yet it's only followed by <b>{PCT}%</b> of components. The rest carry no name at all, or an outdated one.",
      stat2Analogy: "Comparable to a shared filing structure that only one in four team members actually follows, while everyone else files things their own way. Before long, nobody can tell which version is current.",

      stat3Title: "3. How often does the same thing carry different names?",
      stat3Explain: "Individual color values in the system are stored under <b>more than 20 different names</b> – despite being the exact same shade. That makes it nearly impossible to determine the one binding name.",
      stat3Analogy: "Comparable to a company where 24 departments each name the same brand color differently. Eventually nobody can say with certainty whether two labels actually refer to the same color.",

      stat4Title: "4. One term, five different meanings",
      stat4Explain: "The term <b>\u201cType\u201d</b> is used across 5 different components – and refers to something completely different each time.",
      stat4Analogy: "Comparable to the term \u201cstatus\u201d in a company meaning something different in accounting than it does in support or sales. That kind of overloaded term is a reliable source of miscommunication.",
      hub1: "Navigation role", hub2: "Display format", hub3: "Input type", hub4: "Content type", hub5: "Size designation",

      stat5Title: "5. Which components are needlessly complex?",
      stat5Explain: "Certain components consist of an unusually high number of small elements that also behave inconsistently. That makes them harder to maintain and increases the risk of errors.",
      stat5Analogy: "Comparable to an assembly manual where every single step is documented differently, even though it's technically the same procedure each time.",

      stat6Title: "6. How much of this is actually used?",
      donut2Lbl: "actually in use",
      stat6Explain: "Of everything defined in the file, only a small share is actually used on real screens. The vast majority is examples, icons, or documentation material.",
      stat6Analogy: "Comparable to a warehouse where only a fraction of the inventory is ever sold – the rest sits in stock without ever being put to use.",

      stat7Title: "7. Defective components that remain available",
      stat7Explain: "A number of components no longer function correctly on a technical level – they throw errors when opened – yet remain discoverable and usable within the system.",
      stat7Analogy: "Comparable to parts marked as defective in a spare-parts inventory that stay on the shelf regardless – it only becomes apparent once someone actually tries to use them.",
    },
  };

  const LANG_KEY = "ds-audit-lang";
  let currentLang = localStorage.getItem(LANG_KEY) || "de";
  if (!I18N[currentLang]) currentLang = "de";

  function t(key, ...args) {
    const v = I18N[currentLang][key];
    return typeof v === "function" ? v(...args) : v;
  }
  function tc(obj, field) {
    if (currentLang === "en" && obj[field + "_en"]) return obj[field + "_en"];
    return obj[field];
  }
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // ---------------------------------------------------------------------
  // 1. Datenaufbereitung
  // ---------------------------------------------------------------------
  const sets = DATA.componentSets.map(r => ({
    kind: "Set", name: r.name, page_name: r.page_name, id_status: r.id_status, extracted_id: r.extracted_id,
    family_type: r.family_type, variant_count: r.variant_count, complexity_score: r.complexity_score,
    structural_score: r.structural_score, variant_score: r.variant_score, nested_instance_count: r.nested_instance_count,
    max_depth: r.max_depth, findings: r.findings, finding_count: r.finding_count, description: r.description, key: r.key,
    variant_axes: r.variant_axes, prop_defs_list: r.prop_defs_list, dependency_names: r.dependency_names || [],
    is_broken: r.is_broken, is_duplicate_id: r.is_duplicate_id, id_mismatch: r.id_mismatch, is_known_duplicate_component: r.is_known_duplicate_component,
  }));

  const standalones = DATA.standaloneComponents.map(r => ({
    kind: "Standalone", name: r.name, page_name: r.page_name, id_status: r.id_status, extracted_id: r.extracted_id,
    family_type: "Standalone", variant_count: 0, complexity_score: 0, structural_score: 0, variant_score: 0,
    nested_instance_count: 0, max_depth: 0, findings: r.findings, finding_count: r.finding_count, description: r.description,
    key: r.key, variant_axes: {}, prop_defs_list: [], dependency_names: [], instance_total: r.instance_total, instance_pages: r.instance_pages,
    is_broken: false, is_duplicate_id: false, id_mismatch: false, is_known_duplicate_component: false,
  }));

  const ALL_ITEMS = sets.concat(standalones);
  const allFindingTags = new Set();
  ALL_ITEMS.forEach(it => (it.findings || []).forEach(f => allFindingTags.add(f)));

  const state = {
    search: "", kind: "all", idstatus: "all", family: "all", findingtag: "all", onlyFindings: false,
    sortKey: "complexity_score", sortDir: "desc",
  };

  // ---------------------------------------------------------------------
  // 2. Statische Übersetzungen
  // ---------------------------------------------------------------------
  function setText(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  function applyStaticTranslations() {
    document.documentElement.lang = currentLang;
    setText("t-eyebrow", t("eyebrow"));
    setText("t-title", t("title"));
    setText("t-hero-score-lbl", t("heroScoreLbl"));
    setText("t-hero-verdict", t("heroVerdict"));
    setText("t-meta-date-label", t("metaDateLabel", DATA.meta.generatedAt));
    setText("t-meta-scope-label", t("metaScopeLabel", DATA.meta.totals.componentSetsAnalyzed, DATA.meta.totals.standaloneComponentsAnalyzed, DATA.meta.totals.totalComponentSetsInFile, DATA.meta.totals.pages));
    setText("t-meta-reuse-note", t("metaReuseNote"));

    setText("nav-overview", t("navOverview"));
    setText("nav-recommendations", t("navRecommendations"));
    setText("nav-findings", t("navFindings"));
    setText("nav-architecture", t("navArchitecture"));
    setText("nav-tokens", t("navTokens"));
    setText("nav-explorer", t("navExplorer"));

    setText("t-ov-eyebrow", t("ovEyebrow"));
    setText("t-ov-title", t("ovTitle"));
    setText("t-ov-sub", t("ovSub"));

    setText("t-reco-eyebrow", t("recoEyebrow"));
    setText("t-sec-reco-title", t("secRecoTitle"));
    setText("t-sec-reco-sub", t("secRecoSub"));

    setText("t-find-eyebrow", t("findEyebrow"));
    setText("t-sec-naming-title", t("secNamingTitle"));
    setText("t-sec-naming-sub", t("secNamingSub"));

    setText("t-arch-eyebrow", t("archEyebrow"));
    setText("t-sec-complexity-title", t("secComplexityTitle"));
    setText("t-sec-complexity-sub", t("secComplexitySub"));

    setText("t-tok-eyebrow", t("tokEyebrow"));
    setText("t-sec-tokens-title", t("secTokensTitle"));
    setText("t-sec-tokens-sub", t("secTokensSub"));

    setText("t-expl-eyebrow", t("explEyebrow"));
    setText("t-sec-explorer-title", t("secExplorerTitle"));
    setText("t-sec-explorer-sub", t("secExplorerSub"));
    setText("t-legend-official", t("legendOfficial"));
    setText("t-legend-internal", t("legendInternal"));
    setText("t-legend-adhoc", t("legendAdhoc"));

    document.getElementById("f-search").placeholder = t("searchPlaceholder");
    setText("opt-kind-all", t("optKindAll"));
    setText("opt-kind-set", t("optKindSet"));
    setText("opt-kind-standalone", t("optKindStandalone"));
    setText("opt-idstatus-all", t("optIdstatusAll"));
    setText("opt-idstatus-official", t("optIdstatusOfficial"));
    setText("opt-idstatus-internal", t("optIdstatusInternal"));
    setText("opt-idstatus-adhoc", t("optIdstatusAdhoc"));
    setText("opt-family-all", t("optFamilyAll"));
    setText("opt-findingtag-all", t("optFindingtagAll"));
    setText("t-only-findings", t("onlyFindings"));
    document.getElementById("f-clear").textContent = t("clearBtn");

    setText("th-name", t("thName")); setText("th-page", t("thPage")); setText("th-kind", t("thKind"));
    setText("th-idstatus", t("thIdstatus")); setText("th-family", t("thFamily")); setText("th-variants", t("thVariants"));
    setText("th-complexity", t("thComplexity")); setText("th-findings", t("thFindings"));

    setText("t-footer-methodik-title", t("footerMethodikTitle"));
    setText("t-footer-methodik-list", t("footerMethodikList").map(li => `<li>${li}</li>`).join(""));
    setText("t-footer-score-title", t("footerScoreTitle"));
    setText("t-footer-score-list", t("footerScoreList").map(li => `<li>${li}</li>`).join(""));
    setText("t-footer-sources-title", t("footerSourcesTitle"));
    setText("t-footer-sources-list", t("footerSourcesList").map(li => `<li>${li}</li>`).join(""));

    document.getElementById("lang-btn-de").classList.toggle("active", currentLang === "de");
    document.getElementById("lang-btn-en").classList.toggle("active", currentLang === "en");
  }

  // ---------------------------------------------------------------------
  // 3. Hero Score Ring
  // ---------------------------------------------------------------------
  function renderHeroScore() {
    const score = DATA.healthScores.overall;
    const circumference = 2 * Math.PI * 56;
    const offset = circumference * (1 - score / 100);
    document.getElementById("hero-score-num").textContent = score;
    const arc = document.getElementById("hero-score-arc");
    arc.setAttribute("stroke-dasharray", circumference.toFixed(1));
    arc.setAttribute("stroke-dashoffset", offset.toFixed(1));
  }

  // ---------------------------------------------------------------------
  // 4. KPI Row (auf 5 Kernzahlen getrimmt)
  // ---------------------------------------------------------------------
  const officialCount = ALL_ITEMS.filter(it => it.id_status === "official" && it.kind === "Set").length;
  const totalSets = sets.length;
  const brokenCount = sets.filter(s => s.is_broken).length;
  const dupIdCount = sets.filter(s => s.is_duplicate_id).length;
  const complexCompoundCount = sets.filter(s => s.family_type === "Complex Compound").length;

  function kpiDefs() {
    const officialPct = Math.round(officialCount / totalSets * 100);
    return [
      { label: { de: "Component Sets analysiert", en: "Component sets analyzed" }, caption: { de: "von 236 insgesamt", en: "of 236 total" }, value: totalSets, tone: "", filter: null },
      { label: { de: "Offizielle IFE-/FOE-ID", en: "Official IFE-/FOE-ID" }, caption: { de: "Naming-Konvention eingehalten", en: "naming convention followed" }, value: `${officialPct}%`, tone: officialCount / totalSets < 0.4 ? "danger" : "warning", filter: { f_idstatus: "official" } },
      { label: { de: "Defekte Component Sets", en: "Broken component sets" }, caption: { de: "technische Fehler in Figma", en: "technical errors in Figma" }, value: brokenCount, tone: "danger", filter: { f_findingtag: "defekt" } },
      { label: { de: "ID-Kollisionen", en: "ID collisions" }, caption: { de: "mehrfach vergebene IDs", en: "IDs assigned more than once" }, value: dupIdCount, tone: "danger", filter: { f_findingtag: "id-kollision" } },
      { label: { de: "Complex Compound", en: "Complex Compound" }, caption: { de: "hohe strukturelle Komplexität", en: "high structural complexity" }, value: complexCompoundCount, tone: "warning", filter: { f_family: "Complex Compound" } },
    ];
  }

  function renderKpis() {
    const kpiGrid = document.getElementById("kpi-grid");
    kpiGrid.innerHTML = "";
    kpiDefs().forEach(k => {
      const card = document.createElement("button");
      card.className = "kpi-card" + (k.tone ? " tone-" + k.tone : "");
      card.innerHTML = `<div class="kpi-value">${k.value}</div><div class="kpi-label">${k.label[currentLang]}</div><div class="kpi-caption">${k.caption[currentLang]}</div>`;
      card.addEventListener("click", () => { if (k.filter) applyFilterAndScroll(k.filter); });
      kpiGrid.appendChild(card);
    });
  }

  // ---------------------------------------------------------------------
  // 5. Recommendations
  // ---------------------------------------------------------------------
  const areaFilterMap = {
    "Tokens": { scrollTo: "chapter-tokens" },
    "Components": { filter: { f_findingtag: "karteileiche" } },
    "Naming": { filter: { f_idstatus: "adhoc" } },
    "Dependencies": { filter: { f_family: "Complex Compound" } },
    "Reuse": { scrollTo: "chapter-explorer" },
  };

  function renderRecommendations() {
    const recoGrid = document.getElementById("reco-grid");
    recoGrid.innerHTML = "";
    DATA.recommendations.slice().sort((a, b) => a.prio - b.prio).forEach(r => {
      const impact = tc(r, "impact"); const effort = tc(r, "effort");
      const row = document.createElement("div");
      row.className = "reco-row";
      const impactClass = "impact-" + r.impact.replace(/\s+/g, "-");
      row.innerHTML = `
        <span class="reco-prio">${r.prio}</span>
        <div>
          <h3>${escapeHtml(tc(r, "title"))}</h3>
          <p>${escapeHtml(tc(r, "detail"))}</p>
          <div class="reco-tags">
            <span class="tag ${impactClass}">${t("impactLabel")} ${escapeHtml(impact)}</span>
            <span class="tag">${t("effortLabel")} ${escapeHtml(effort)}</span>
            <span class="tag">${escapeHtml(r.area)}</span>
          </div>
        </div>
        <button class="reco-btn-link">${t("recoBtn")}</button>
      `;
      row.querySelector(".reco-btn-link").addEventListener("click", () => {
        const target = areaFilterMap[r.area];
        if (target && target.filter) applyFilterAndScroll(target.filter);
        else if (target && target.scrollTo) document.getElementById(target.scrollTo).scrollIntoView({ behavior: "smooth" });
      });
      recoGrid.appendChild(row);
    });
  }

  // ---------------------------------------------------------------------
  // 6. Findings Browser (ersetzt 5 separate Karten-Raster)
  // ---------------------------------------------------------------------
  const findingsState = { topic: "all", expanded: false };
  const PAGE_SIZE_FINDINGS = 5;

  function renderFindingsTopics() {
    const wrap = document.getElementById("findings-topics");
    const counts = { all: DATA.unifiedFindings.length };
    DATA.unifiedFindings.forEach(f => { counts[f.topic] = (counts[f.topic] || 0) + 1; });
    const topics = [
      ["all", t("topicAll")], ["naming", t("topicNaming")], ["tokens", t("topicTokens")],
      ["components", t("topicComponents")], ["foundations", t("topicFoundations")],
    ];
    wrap.innerHTML = "";
    topics.forEach(([key, label]) => {
      const btn = document.createElement("button");
      btn.className = "topic-pill" + (findingsState.topic === key ? " active" : "");
      btn.innerHTML = `${escapeHtml(label)} <span class="count">${counts[key] || 0}</span>`;
      btn.addEventListener("click", () => { findingsState.topic = key; findingsState.expanded = false; renderFindingsBrowser(); });
      wrap.appendChild(btn);
    });
  }

  function renderFindingsBrowser() {
    renderFindingsTopics();
    const list = document.getElementById("findings-list");
    const moreBtn = document.getElementById("findings-show-more");
    let items = DATA.unifiedFindings.filter(f => findingsState.topic === "all" || f.topic === findingsState.topic);
    const total = items.length;
    if (!findingsState.expanded) items = items.slice(0, PAGE_SIZE_FINDINGS);

    list.innerHTML = "";
    items.forEach(f => {
      const row = document.createElement("div");
      row.className = "finding-row sev-" + f.severity;
      row.innerHTML = `
        <div class="sev-bar"></div>
        <div>
          <p class="f-title">${escapeHtml(tc(f, "title"))}</p>
          <p class="f-body">${escapeHtml(tc(f, "body"))}</p>
          <p class="f-meta">${escapeHtml(tc(f, "meta"))}</p>
        </div>
      `;
      list.appendChild(row);
    });

    if (total > PAGE_SIZE_FINDINGS) {
      moreBtn.style.display = "inline-block";
      moreBtn.textContent = findingsState.expanded ? t("showLessFindings") : t("showMoreFindings", total - PAGE_SIZE_FINDINGS);
      moreBtn.onclick = () => { findingsState.expanded = !findingsState.expanded; renderFindingsBrowser(); };
    } else {
      moreBtn.style.display = "none";
    }
  }

  // ---------------------------------------------------------------------
  // 7. Architecture Chapter: Quadrant + Stat Strips
  // ---------------------------------------------------------------------
  function renderQuadrant() {
    const svg = document.getElementById("quadrant-svg");
    const tooltip = document.getElementById("quad-tooltip");
    const W = 900, H = 420, PAD = 50;
    const plotW = W - PAD * 2, plotH = H - PAD * 2;
    const maxComplexity = Math.max(...sets.map(s => s.complexity_score)) || 1;

    function hashJitter(str) {
      let h = 0;
      for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
      return (h % 100) / 100;
    }

    let svgHtml = "";
    svgHtml += `<line x1="${PAD}" y1="${H - PAD}" x2="${W - PAD}" y2="${H - PAD}" stroke="#ced4da" stroke-width="1.5"/>`;
    svgHtml += `<line x1="${PAD}" y1="${PAD}" x2="${PAD}" y2="${H - PAD}" stroke="#ced4da" stroke-width="1.5"/>`;
    svgHtml += `<text x="${W / 2}" y="${H - 10}" text-anchor="middle" class="quad-label">${t("quadXAxis")}</text>`;
    svgHtml += `<text x="18" y="${H / 2}" text-anchor="middle" class="quad-label" transform="rotate(-90 18 ${H / 2})">${t("quadYAxis")}</text>`;
    const medX = PAD + plotW * 0.35;
    svgHtml += `<line x1="${medX}" y1="${PAD}" x2="${medX}" y2="${H - PAD}" stroke="#e9ecef" stroke-dasharray="4 4"/>`;
    svgHtml += `<text x="${W - PAD}" y="${PAD + 14}" text-anchor="end" class="quad-label" font-style="italic">${t("quadTackleFirst")}</text>`;

    sets.forEach(s => {
      const x = PAD + (s.complexity_score / maxComplexity) * plotW;
      const jitter = (hashJitter(s.name) - 0.5) * 0.6;
      const y = H - PAD - ((s.finding_count + jitter + 0.3) / 3.6) * plotH;
      const famClass = s.family_type === "Base" ? "base" : s.family_type === "Compound" ? "compound" : "complex";
      const r = 4 + Math.min(s.finding_count, 3) * 1.5;
      svgHtml += `<circle class="quad-dot ${famClass}" cx="${x.toFixed(1)}" cy="${Math.max(PAD, Math.min(H - PAD, y)).toFixed(1)}" r="${r}"
        data-name="${escapeHtml(s.name)}" data-page="${escapeHtml(s.page_name)}" data-complexity="${s.complexity_score}" data-findings="${s.finding_count}"></circle>`;
    });
    svg.innerHTML = svgHtml;

    svg.querySelectorAll(".quad-dot").forEach(dot => {
      dot.addEventListener("mousemove", e => {
        tooltip.style.display = "block";
        tooltip.style.left = (e.pageX + 14) + "px";
        tooltip.style.top = (e.pageY - 10) + "px";
        tooltip.innerHTML = `<b>${dot.dataset.name}</b><br>${dot.dataset.page}<br>${currentLang === "de" ? "Komplexität" : "Complexity"}: ${Number(dot.dataset.complexity).toFixed(0)} · ${t("thFindings")}: ${dot.dataset.findings}`;
      });
      dot.addEventListener("mouseleave", () => { tooltip.style.display = "none"; });
      dot.addEventListener("click", () => {
        resetFilters();
        document.getElementById("f-search").value = dot.dataset.name;
        state.search = dot.dataset.name.toLowerCase();
        renderExplorer();
        document.getElementById("chapter-explorer").scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  function renderArchitectureStrips() {
    if (DATA.variantStructureFindings) {
      const vs = DATA.variantStructureFindings;
      const wrap = document.getElementById("variant-structure-strip");
      const pct = Math.round(vs.structurallyDivergent / vs.totalSetsChecked * 100);
      wrap.innerHTML = `
        <div class="stat-strip">
          <div class="label">${t("variantStructureLabel")}</div>
          <div class="pct">${pct}%</div>
          <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
          <div class="note">${vs.structurallyDivergent} / ${vs.totalSetsChecked} ${currentLang === "de" ? "Sets strukturell divergent zwischen Varianten" : "sets structurally divergent between variants"}</div>
        </div>
      `;
      document.getElementById("variant-structure-conclusion").innerHTML = escapeHtml(tc(vs, "conclusion"));
    }
    if (DATA.toplevelAdoptionBreakdown) {
      const tl = DATA.toplevelAdoptionBreakdown;
      const wrap = document.getElementById("toplevel-strip");
      wrap.innerHTML = `
        <div class="stat-strip">
          <div class="label">${t("toplevelLabel")}</div>
          <div class="pct">${tl.topLevelPct}%</div>
          <div class="bar-track"><div class="bar-fill" style="width:${tl.topLevelPct}%"></div></div>
          <div class="note">${currentLang === "de" ? "top-level platziert" : "placed top-level"} (${tl.nestedPct}% ${currentLang === "de" ? "verschachtelt" : "nested"})</div>
        </div>
        <div class="stat-strip">
          <div class="label">${currentLang === "de" ? "Auffälligster Fund" : "Most notable finding"}</div>
          <div class="pct" style="font-size:16px;">${escapeHtml(tl.standoutComponent.name)}</div>
          <div class="note">${tl.standoutComponent.count} ${currentLang === "de" ? "Instanzen" : "instances"} / ${tl.standoutComponent.pages} ${currentLang === "de" ? "Pages" : "pages"}</div>
        </div>
      `;
      document.getElementById("toplevel-conclusion").innerHTML = escapeHtml(tc(tl, "conclusion"));
    }
  }

  // ---------------------------------------------------------------------
  // 8. Tokens Chapter
  // ---------------------------------------------------------------------
  const knownCollectionTotals = [
    { name: "Color Styles", n: 230 }, { name: "Spacings", n: 22 }, { name: "Gaps", n: 16 },
    { name: "Table Heights", n: 6 }, { name: "Modal Width", n: 5 }, { name: "Value-Standards", n: 5 }, { name: "Global", n: 2 },
  ];
  const DUP_PAGE_SIZE = 4;
  let dupExpanded = false;

  function renderTokens() {
    const tokenColl = document.getElementById("token-collections");
    tokenColl.innerHTML = "";
    knownCollectionTotals.forEach(c => {
      const card = document.createElement("div");
      card.className = "token-coll-card";
      card.innerHTML = `<h4>${c.name}</h4><div class="n">${c.n}</div>`;
      tokenColl.appendChild(card);
    });

    const dupWrap = document.getElementById("dup-groups");
    const sorted = DATA.colorDuplicateGroups.slice().sort((a, b) => b.count - a.count);
    const shown = dupExpanded ? sorted : sorted.slice(0, DUP_PAGE_SIZE);
    dupWrap.innerHTML = "";
    shown.forEach(g => {
      const div = document.createElement("div");
      div.className = "dup-group risk-" + (g.riskFlag || "niedrig");
      const riskNote = tc(g, "riskNote");
      div.innerHTML = `
        <div class="dup-group-head">
          <span class="swatch" style="background:${g.hex}"></span>
          <span class="hex">${g.hex}</span>
          <span class="count">${g.count} ${currentLang === "de" ? "Tokennamen für denselben Wert" : "token names for the same value"}</span>
        </div>
        <div class="dup-names">${g.names.map(n => `<span>${escapeHtml(n)}</span>`).join("")}</div>
        ${riskNote ? `<div class="risk-note">${escapeHtml(riskNote)}</div>` : ""}
      `;
      dupWrap.appendChild(div);
    });

    const moreBtn = document.getElementById("dup-groups-show-more");
    if (sorted.length > DUP_PAGE_SIZE) {
      moreBtn.style.display = "inline-block";
      moreBtn.textContent = dupExpanded ? t("showLessDup") : t("showMoreDup", sorted.length - DUP_PAGE_SIZE);
      moreBtn.onclick = () => { dupExpanded = !dupExpanded; renderTokens(); };
    } else {
      moreBtn.style.display = "none";
    }
  }

  // ---------------------------------------------------------------------
  // 9. Explorer (Werkzeug-Kapitel) – Filter/Sort/Detail
  // ---------------------------------------------------------------------
  function setupFindingTagOptions() {
    const sel = document.getElementById("f-findingtag");
    Array.from(sel.querySelectorAll("option:not(#opt-findingtag-all)")).forEach(o => o.remove());
    Array.from(allFindingTags).sort().forEach(tag => {
      const opt = document.createElement("option");
      opt.value = tag; opt.textContent = tag;
      sel.appendChild(opt);
    });
    sel.value = state.findingtag;
  }

  function wireToolbarEvents() {
    document.getElementById("f-search").addEventListener("input", e => { state.search = e.target.value.toLowerCase(); renderExplorer(); });
    document.getElementById("f-kind").addEventListener("change", e => { state.kind = e.target.value; renderExplorer(); });
    document.getElementById("f-idstatus").addEventListener("change", e => { state.idstatus = e.target.value; renderExplorer(); });
    document.getElementById("f-family").addEventListener("change", e => { state.family = e.target.value; renderExplorer(); });
    document.getElementById("f-findingtag").addEventListener("change", e => { state.findingtag = e.target.value; renderExplorer(); });
    document.getElementById("f-onlyfindings").addEventListener("change", e => { state.onlyFindings = e.target.checked; renderExplorer(); });
    document.getElementById("f-clear").addEventListener("click", () => { resetFilters(); renderExplorer(); });

    document.querySelectorAll("#explorer-table thead th").forEach(th => {
      th.addEventListener("click", () => {
        const key = th.dataset.key;
        if (state.sortKey === key) state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
        else { state.sortKey = key; state.sortDir = "desc"; }
        renderExplorer();
      });
      th.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); th.click(); } });
    });
  }

  function resetFilters() {
    state.search = ""; state.kind = "all"; state.idstatus = "all"; state.family = "all"; state.findingtag = "all"; state.onlyFindings = false;
    document.getElementById("f-search").value = "";
    document.getElementById("f-kind").value = "all";
    document.getElementById("f-idstatus").value = "all";
    document.getElementById("f-family").value = "all";
    const sel = document.getElementById("f-findingtag");
    if (sel.querySelector('option[value="all"]')) sel.value = "all";
    document.getElementById("f-onlyfindings").checked = false;
  }

  function applyFilterAndScroll(filterObj) {
    resetFilters();
    if (filterObj.f_idstatus) { state.idstatus = filterObj.f_idstatus; document.getElementById("f-idstatus").value = filterObj.f_idstatus; }
    if (filterObj.f_family) { state.family = filterObj.f_family; document.getElementById("f-family").value = filterObj.f_family; }
    if (filterObj.f_findingtag) {
      state.findingtag = filterObj.f_findingtag; state.onlyFindings = true;
      document.getElementById("f-onlyfindings").checked = true;
      const sel = document.getElementById("f-findingtag");
      if (![...sel.options].some(o => o.value === filterObj.f_findingtag)) {
        const opt = document.createElement("option");
        opt.value = filterObj.f_findingtag; opt.textContent = filterObj.f_findingtag;
        sel.appendChild(opt);
      }
      sel.value = filterObj.f_findingtag;
    }
    renderExplorer();
    document.getElementById("chapter-explorer").scrollIntoView({ behavior: "smooth" });
  }

  function getFiltered() {
    return ALL_ITEMS.filter(it => {
      if (state.kind !== "all" && it.kind !== state.kind) return false;
      if (state.idstatus !== "all" && it.id_status !== state.idstatus) return false;
      if (state.family !== "all" && it.family_type !== state.family) return false;
      if (state.findingtag !== "all" && !(it.findings || []).includes(state.findingtag)) return false;
      if (state.onlyFindings && (it.finding_count || 0) === 0) return false;
      if (state.search) {
        const hay = (it.name + " " + it.page_name + " " + (it.extracted_id || "")).toLowerCase();
        if (!hay.includes(state.search)) return false;
      }
      return true;
    });
  }

  function badgeForIdStatus(s) {
    const map = { official: ["badge-official", t("badgeOfficial")], internal: ["badge-internal", t("badgeInternal")], adhoc: ["badge-adhoc", t("badgeAdhoc")] };
    const [cls, label] = map[s] || ["badge-adhoc", s];
    return `<span class="badge ${cls}">${label}</span>`;
  }
  function badgeForFamily(f) {
    const map = { "Base": "badge-base", "Compound": "badge-compound", "Complex Compound": "badge-complex", "Standalone": "badge-base" };
    return `<span class="badge ${map[f] || "badge-base"}">${f}</span>`;
  }

  function renderExplorer() {
    let items = getFiltered();
    const dir = state.sortDir === "asc" ? 1 : -1;
    items = items.slice().sort((a, b) => {
      const av = a[state.sortKey], bv = b[state.sortKey];
      if (typeof av === "string") return av.localeCompare(bv) * dir;
      return ((av || 0) - (bv || 0)) * dir;
    });

    document.getElementById("result-count").textContent = t("resultCount", items.length, ALL_ITEMS.length, sets.length, standalones.length);

    document.querySelectorAll("#explorer-table thead th").forEach(th => {
      th.classList.toggle("active", th.dataset.key === state.sortKey);
      th.querySelector(".sort-ind").textContent = th.dataset.key === state.sortKey ? (state.sortDir === "asc" ? "▲" : "▼") : "▾";
      th.setAttribute("aria-sort", th.dataset.key === state.sortKey ? (state.sortDir === "asc" ? "ascending" : "descending") : "none");
    });

    const tbody = document.getElementById("explorer-tbody");
    tbody.innerHTML = "";
    items.forEach((it) => {
      const tr = document.createElement("tr");
      tr.className = "row-main";
      tr.dataset.key = it.key || it.name;
      tr.innerHTML = `
        <td class="name-cell">${escapeHtml(it.name)}</td>
        <td class="page-cell">${escapeHtml(it.page_name)}</td>
        <td>${it.kind}</td>
        <td>${badgeForIdStatus(it.id_status)}</td>
        <td>${badgeForFamily(it.family_type)}</td>
        <td class="num-cell">${it.variant_count || "–"}</td>
        <td class="num-cell">${it.kind === "Set" ? it.complexity_score.toFixed(0) : "–"}</td>
        <td class="num-cell">${it.finding_count || 0}</td>
      `;
      tr.addEventListener("click", () => openSidesheet(it, tr));
      tbody.appendChild(tr);
    });
  }

  // ---------------------------------------------------------------------
  // 9b. Sidesheet: Component-Detail + Anwendungshinweise
  // ---------------------------------------------------------------------
  let sidesheetActiveRow = null;

  function getUsageGuidance(it) {
    const hints = [];
    if (it.is_broken) {
      hints.push({ sev: "hoch", de: "Technischer Fehler in Figma – vor Weiterverwendung reparieren oder entfernen.", en: "Technical error in Figma – repair or remove before further use." });
    }
    if (it.is_known_duplicate_component) {
      hints.push({ sev: "hoch", de: "Bekannte veraltete Kopie – nutze stattdessen die offizielle Version auf der zugehörigen Haupt-Page.", en: "Known outdated copy – use the official version on its main page instead." });
    }
    if (it.is_duplicate_id) {
      hints.push({ sev: "hoch", de: "Diese ID ist mehrfach vergeben – vor Verwendung prüfen, ob dies wirklich die aktuelle/korrekte Version ist.", en: "This ID is assigned more than once – verify this is really the current/correct version before use." });
    }
    if (it.id_mismatch) {
      hints.push({ sev: "mittel", de: "Komponenten-ID passt nicht zur Page – beim Nachschlagen über die ID Vorsicht walten lassen.", en: "Component ID doesn't match its page – be careful when looking this up by ID." });
    }
    if (it.id_status === "adhoc") {
      hints.push({ sev: "mittel", de: "Kein offizielles IFE-/FOE-Namensschema – beim nächsten Update eine ID nach Konvention vergeben.", en: "No official IFE-/FOE naming scheme – assign a conventional ID on the next update." });
    } else if (it.id_status === "internal" && !it.is_known_duplicate_component) {
      hints.push({ sev: "mittel", de: "Als interne/veraltete Komponente markiert – nur verwenden, wenn keine offizielle Alternative existiert.", en: "Marked as internal/deprecated – only use if no official alternative exists." });
    }
    if (it.family_type === "Complex Compound") {
      hints.push({ sev: "mittel", de: "Hohe strukturelle Komplexität – bei Neuentwicklungen prüfen, ob eine einfachere Komposition aus Basis-Komponenten reicht.", en: "High structural complexity – when building something new, check whether a simpler composition of base components suffices." });
    }
    if (it.kind === "Standalone" && (it.instance_total || 0) === 0) {
      hints.push({ sev: "mittel", de: "Keine Nutzung in dieser Datei gefunden – vor Verwendung prüfen, ob die Komponente noch gepflegt wird.", en: "No usage found in this file – check whether the component is still maintained before using it." });
    }
    if (hints.length === 0) {
      hints.push({ sev: "good", de: "Keine bekannten Probleme – kann als Referenz oder Vorlage für neue Komponenten genutzt werden.", en: "No known issues – can be used as a reference or template for new components." });
    }
    return hints;
  }

  function renderSidesheetBody(it) {
    const axesChips = Object.entries(it.variant_axes || {}).map(([k, v]) => `<span class="axis-chip">${escapeHtml(k)}: ${t("detailAxesValues", v)}</span>`).join("") || "–";
    const findingsChips = (it.findings || []).map(f => `<span class="tag">${escapeHtml(f)}</span>`).join(" ") || `<span class='tag'>${t("detailNoFindings")}</span>`;
    const depsChips = (it.dependency_names || []).slice(0, 12).map(d => `<span class="axis-chip">${escapeHtml(d)}</span>`).join("") || t("detailNoDeps");
    const usageLine = it.kind === "Standalone"
      ? t("detailUsageStandalone", it.instance_total || 0, it.instance_pages || 0)
      : t("detailUsageSet", it.nested_instance_count, it.max_depth);
    const guidance = getUsageGuidance(it);

    return `
      <h4>${t("usageHintsTitle")}</h4>
      <div class="usage-hint-list">
        ${guidance.map(h => `<div class="usage-hint sev-${h.sev}"><span class="dot"></span><span>${escapeHtml(currentLang === "de" ? h.de : h.en)}</span></div>`).join("")}
      </div>

      <h4>${t("detailOverview")}</h4>
      <div class="kv">${t("detailKey")} <code>${escapeHtml((it.key || "").slice(0, 28))}…</code></div>
      <div class="kv">${t("detailExtractedId")} <b>${it.extracted_id || t("detailNone")}</b></div>
      <div class="kv">${usageLine}</div>
      ${it.description ? `<p class="description">${escapeHtml(it.description)}</p>` : ""}

      <h4>${t("detailAxes")}</h4>
      <div>${axesChips}</div>

      <h4>${t("detailComplexity")}</h4>
      <div class="kv">${t("detailStructScore")} <b>${(it.structural_score || 0).toFixed(1)}</b> <i>${t("detailStructScoreNote")}</i></div>
      <div class="kv">${t("detailVariantScore")} <b>${(it.variant_score || 0).toFixed(1)}</b> <i>${t("detailVariantScoreNote")}</i></div>
      <div class="kv">${t("detailComposite")} <b>${(it.complexity_score || 0).toFixed(1)}</b> <i>${t("detailCompositeNote")}</i></div>

      <h4>${t("detailFindings")}</h4>
      <div>${findingsChips}</div>

      <h4>${t("detailDeps")}</h4>
      <div>${depsChips}</div>
    `;
  }

  function openSidesheet(it, rowEl) {
    if (sidesheetActiveRow === rowEl && document.getElementById("sidesheet").classList.contains("open")) {
      closeSidesheet();
      return;
    }
    document.querySelectorAll("#explorer-tbody tr.row-main.active").forEach(el => el.classList.remove("active"));
    if (rowEl) { rowEl.classList.add("active"); sidesheetActiveRow = rowEl; }

    document.getElementById("sidesheet-eyebrow").textContent = it.page_name;
    document.getElementById("sidesheet-title").textContent = it.name;
    document.getElementById("sidesheet-badges").innerHTML = `${badgeForIdStatus(it.id_status)}${badgeForFamily(it.family_type)}`;
    document.getElementById("sidesheet-body").innerHTML = renderSidesheetBody(it);

    document.getElementById("sidesheet").classList.add("open");
    document.getElementById("sidesheet-backdrop").classList.add("open");
    document.getElementById("sidesheet").currentItem = it;
  }

  function closeSidesheet() {
    document.getElementById("sidesheet").classList.remove("open");
    document.getElementById("sidesheet-backdrop").classList.remove("open");
    document.querySelectorAll("#explorer-tbody tr.row-main.active").forEach(el => el.classList.remove("active"));
    sidesheetActiveRow = null;
  }

  document.getElementById("sidesheet-close").addEventListener("click", closeSidesheet);
  document.getElementById("sidesheet-backdrop").addEventListener("click", closeSidesheet);
  window.addEventListener("keydown", e => { if (e.key === "Escape") closeSidesheet(); });

  // ---------------------------------------------------------------------
  // 10. Scrollspy für Chapter-Nav
  // ---------------------------------------------------------------------
  function setupScrollspy() {
    const links = Array.from(document.querySelectorAll("#chapter-nav a"));
    const sections = links.map(l => document.getElementById(l.dataset.chapter)).filter(Boolean);
    const navHeight = document.getElementById("chapter-nav").offsetHeight;

    function onScroll() {
      let current = sections[0];
      const scrollPos = window.scrollY + navHeight + 40;
      for (const sec of sections) {
        if (sec.offsetTop <= scrollPos) current = sec;
      }
      links.forEach(l => l.classList.toggle("active", current && l.dataset.chapter === current.id));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ---------------------------------------------------------------------
  // 10b. Stats View: Infografik-Erklärung für Nicht-Fachpublikum
  // ---------------------------------------------------------------------
  function polarToCartesian(cx, cy, r, angleDeg) {
    const rad = (angleDeg - 180) * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }
  function describeArc(cx, cy, r, startAngle, endAngle) {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
  }

  function renderGauge(score) {
    const svg = document.getElementById("gauge-svg");
    const cx = 120, cy = 120, r = 96;
    let grade, color;
    if (score >= 90) { grade = t("gaugeGradeGood"); color = "#05944f"; }
    else if (score >= 75) { grade = t("gaugeGradeOk"); color = "#e0a500"; }
    else if (score >= 60) { grade = t("gaugeGradeMeh"); color = "#f08a3c"; }
    else { grade = t("gaugeGradeBad"); color = "#e20613"; }

    const needleAngle = (score / 100) * 180;
    const needleTip = polarToCartesian(cx, cy, r - 14, needleAngle);

    svg.innerHTML = `
      <path d="${describeArc(cx, cy, r, 0, 75)}" fill="none" stroke="#e20613" stroke-width="20" stroke-linecap="round"/>
      <path d="${describeArc(cx, cy, r, 75, 135)}" fill="none" stroke="#f08a3c" stroke-width="20" stroke-linecap="round"/>
      <path d="${describeArc(cx, cy, r, 135, 180)}" fill="none" stroke="#05944f" stroke-width="20" stroke-linecap="round"/>
      <line x1="${cx}" y1="${cy}" x2="${needleTip.x.toFixed(2)}" y2="${needleTip.y.toFixed(2)}" stroke="#212529" stroke-width="4" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${cy}" r="8" fill="#212529"/>
    `;
    document.getElementById("gauge-num").textContent = score;
    const gEl = document.getElementById("gauge-grade");
    gEl.textContent = grade;
    gEl.style.color = color;
  }

  function renderDonut(svgId, pct, color) {
    const svg = document.getElementById(svgId);
    const r = 80, cx = 100, cy = 100, circumference = 2 * Math.PI * r;
    const offset = circumference * (1 - pct / 100);
    svg.innerHTML = `
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e9ecef" stroke-width="24"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="24"
        stroke-linecap="round" stroke-dasharray="${circumference.toFixed(1)}" stroke-dashoffset="${offset.toFixed(1)}"/>
    `;
  }

  function renderBarChart(containerId, rows) {
    const el = document.getElementById(containerId);
    const max = Math.max(...rows.map(r => r.value)) || 1;
    el.innerHTML = rows.map((r, i) => {
      const pct = Math.round((r.value / max) * 100);
      const tone = i === 0 ? "" : i <= 1 ? "" : i <= 2 ? "tone-2" : "tone-2";
      return `
        <div class="bar-chart-row">
          <span class="bar-name" title="${escapeHtml(r.name)}">${escapeHtml(r.name)}</span>
          <span class="bar-track"><span class="bar-fill ${i >= 2 ? "tone-2" : ""}" style="width:${pct}%"></span></span>
          <span class="bar-value">${r.value}</span>
        </div>
      `;
    }).join("");
  }

  function renderWordHub() {
    const el = document.getElementById("word-hub");
    const chips = [
      { k: "hub1", meaning: "Breadcrumb" }, { k: "hub2", meaning: "Alert" }, { k: "hub3", meaning: "CheckboxCard" },
      { k: "hub4", meaning: "Collapsible" }, { k: "hub5", meaning: "FeatureCard" },
    ];
    el.innerHTML = `
      <div class="hub-word">“Type”</div>
      <div class="hub-meanings">
        ${chips.map(c => `<div class="hub-chip"><b>${escapeHtml(c.meaning)}</b>${escapeHtml(t(c.k))}</div>`).join("")}
      </div>
    `;
  }

  function renderBrokenRow() {
    const brokenItems = sets.filter(s => s.is_broken);
    const el = document.getElementById("broken-row");
    el.innerHTML = brokenItems.map(s => `
      <div class="broken-item">
        <span class="icon">⚠️</span>
        <span class="name">${escapeHtml(s.name)}</span>
      </div>
    `).join("");
  }

  function renderStatsView() {
    setText("t-tab-report", t("tabReport"));
    setText("t-tab-stats", t("tabStats"));
    setText("t-stats-intro-title", t("statsIntroTitle"));
    setText("t-stats-intro-sub", t("statsIntroSub"));
    for (let i = 1; i <= 6; i++) setText("t-analogy-kicker-" + i, t("analogyKicker"));

    setText("t-stat1-title", t("stat1Title"));
    setText("t-stat1-explain", t("stat1Explain"));
    renderGauge(DATA.healthScores.overall);

    const officialPct = Math.round(officialCount / totalSets * 100);
    setText("t-stat2-title", t("stat2Title"));
    setText("t-donut1-lbl", t("donut1Lbl"));
    setText("t-stat2-explain", t("stat2Explain").replace("{PCT}", officialPct));
    setText("t-stat2-analogy", t("stat2Analogy"));
    renderDonut("donut1-svg", officialPct, "#e20613");
    document.getElementById("donut1-num").textContent = officialPct + "%";

    setText("t-stat3-title", t("stat3Title"));
    setText("t-stat3-explain", t("stat3Explain"));
    setText("t-stat3-analogy", t("stat3Analogy"));
    const topDup = DATA.colorDuplicateGroups.slice().sort((a, b) => b.count - a.count).slice(0, 5)
      .map(g => ({ name: g.hex, value: g.count }));
    renderBarChart("bar-chart-dup", topDup);

    setText("t-stat4-title", t("stat4Title"));
    setText("t-stat4-explain", t("stat4Explain"));
    setText("t-stat4-analogy", t("stat4Analogy"));
    renderWordHub();

    setText("t-stat5-title", t("stat5Title"));
    setText("t-stat5-explain", t("stat5Explain"));
    setText("t-stat5-analogy", t("stat5Analogy"));
    const topComplex = sets.slice().sort((a, b) => b.complexity_score - a.complexity_score).slice(0, 5)
      .map(s => ({ name: s.name, value: Math.round(s.complexity_score) }));
    renderBarChart("bar-chart-complex", topComplex);

    setText("t-stat6-title", t("stat6Title"));
    setText("t-donut2-lbl", t("donut2Lbl"));
    setText("t-stat6-explain", t("stat6Explain"));
    setText("t-stat6-analogy", t("stat6Analogy"));
    const realUsePct = Math.min(...DATA.reuseQualityBreakdown.categories.map(c => c.pct));
    renderDonut("donut2-svg", realUsePct, "#009bb2");
    document.getElementById("donut2-num").textContent = realUsePct + "%";

    setText("t-stat7-title", t("stat7Title"));
    setText("t-stat7-explain", t("stat7Explain"));
    setText("t-stat7-analogy", t("stat7Analogy"));
    renderBrokenRow();
  }

  function setupViewTabs() {
    const tabReport = document.getElementById("tab-report");
    const tabStats = document.getElementById("tab-stats");
    const mainReport = document.getElementById("main-report");
    const chapterLinks = document.getElementById("chapter-links");
    const statsView = document.getElementById("stats-view");

    function activate(view) {
      const isStats = view === "stats";
      tabReport.classList.toggle("active", !isStats);
      tabStats.classList.toggle("active", isStats);
      mainReport.style.display = isStats ? "none" : "";
      chapterLinks.style.display = isStats ? "none" : "";
      statsView.style.display = isStats ? "" : "none";
      window.scrollTo({ top: 0 });
    }
    tabReport.addEventListener("click", () => activate("report"));
    tabStats.addEventListener("click", () => activate("stats"));
  }

  // ---------------------------------------------------------------------
  // 11. Master-Render + Sprachumschaltung
  // ---------------------------------------------------------------------
  function renderAll() {
    applyStaticTranslations();
    renderHeroScore();
    renderKpis();
    renderRecommendations();
    renderFindingsBrowser();
    renderQuadrant();
    renderArchitectureStrips();
    renderTokens();
    setupFindingTagOptions();
    renderExplorer();
    refreshOpenSidesheet();
    renderStatsView();
  }

  function refreshOpenSidesheet() {
    const sheet = document.getElementById("sidesheet");
    if (!sheet.classList.contains("open") || !sheet.currentItem) return;
    const it = sheet.currentItem;
    document.getElementById("sidesheet-eyebrow").textContent = it.page_name;
    document.getElementById("sidesheet-badges").innerHTML = `${badgeForIdStatus(it.id_status)}${badgeForFamily(it.family_type)}`;
    document.getElementById("sidesheet-body").innerHTML = renderSidesheetBody(it);
    const row = document.querySelector(`#explorer-tbody tr.row-main[data-key="${CSS.escape(it.key || it.name)}"]`);
    if (row) { row.classList.add("active"); sidesheetActiveRow = row; }
  }

  function setLang(lang) {
    if (!I18N[lang] || lang === currentLang) return;
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    resetFilters();
    renderAll();
  }

  document.getElementById("lang-btn-de").addEventListener("click", () => setLang("de"));
  document.getElementById("lang-btn-en").addEventListener("click", () => setLang("en"));

  wireToolbarEvents();
  renderAll();
  setupScrollspy();
  setupViewTabs();

})();
