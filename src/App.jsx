import { useState, useMemo, useCallback } from "react";

// ── Evidence Grading ──
const EG = {
  IFU: {
    label: "IFU",
    color: "#3b82f6",
    bg: "#1e3a5f",
    desc: "Manufacturer IFU",
  },
  STRONG: {
    label: "Strong",
    color: "#10b981",
    bg: "#064e3b",
    desc: "Multiple RCTs / meta-analyses",
  },
  MODERATE: {
    label: "Mod",
    color: "#f59e0b",
    bg: "#78350f",
    desc: "Limited trials / systematic reviews",
  },
  CONSENSUS: {
    label: "Cons",
    color: "#a78bfa",
    bg: "#3b1f6e",
    desc: "Expert consensus",
  },
  EMERGING: {
    label: "New",
    color: "#f472b6",
    bg: "#831843",
    desc: "Preliminary research",
  },
  CONFLICT: {
    label: "IFU≠Ev",
    color: "#ef4444",
    bg: "#7f1d1d",
    desc: "Evidence contradicts IFU",
  },
};

// ── Curing wavelength reference ──
const CURE_INFO = {
  standard:
    "Wavelength: 430–480 nm (camphorquinone peak ~468 nm). Minimum irradiance: 800 mW/cm². Ideal: ≥1000 mW/cm². Verify radiometer annually.",
  polywave:
    "Some materials use alternative initiators (TPO, Ivocerin) requiring 380–420 nm range. Polywave LEDs (e.g., Bluephase, VALO) recommended for broad-spectrum curing.",
};

// ── Isolation protocols ──
const ISOLATION = {
  rubberDam:
    "Gold standard. Required for all adhesive bonding where possible. Provides absolute moisture control and retraction.",
  isolite:
    "Isolite/Isodry/Mr. Thirsty: Acceptable for posterior composites, IDS, DME. Provides relative isolation + light + retraction + suction. Not equivalent to rubber dam for veneers/critical esthetics.",
  cottonRoll:
    "Cotton roll + high-volume suction + DryTips: Minimum acceptable for bonding. Requires vigilant moisture management. Not recommended for critical adhesive procedures.",
  evidence:
    "Systematic reviews show rubber dam isolation significantly improves longevity of adhesive restorations. Relative isolation (Isolite) is acceptable for routine posterior work but rubber dam preferred for anterior veneers, IDS, and complex bonded ceramics.",
};

// ── APA (airborne particle abrasion) intraoral notes ──
const APA_INTRAORAL = {
  ids: "For IDS/resin coat: intraoral APA (27–50 μm Al₂O₃) used DRY to roughen existing resin coat before impression/cementation. Wet APA not indicated intraorally — water interferes with particle abrasion and creates slurry.",
  core: "For core build-up surfaces: dry APA 50 μm acceptable intraorally to roughen composite core before impression. Protect adjacent teeth/soft tissue with Teflon tape or rubber dam.",
  extraoral:
    "All CAD/CAM restoration surface treatment (sandblasting) is done EXTRAORALLY in a sandblasting unit. Never sandblast glass-ceramic or RNC restorations intraorally.",
};

// ── Citations ──
const CIT = {
  "shen-2004": {
    pmid: "15182161",
    title: "Silane stability: 2-bottle vs pre-hydrolyzed single-bottle",
    authors: "Shen C, et al.",
    journal: "J Prosthet Dent",
    year: 2004,
    grade: "STRONG",
  },
  "lung-2012": {
    pmid: "22192253",
    title: "Silane coupling agents and surface conditioning: Overview",
    authors: "Lung CYK, Matinlinna JP",
    journal: "Dent Mater",
    year: 2012,
    grade: "STRONG",
  },
  "hooshmand-2004": {
    pmid: "15533457",
    title: "Silane + heat on shear bond strength",
    authors: "Hooshmand T, et al.",
    journal: "J Prosthodont",
    year: 2004,
    grade: "STRONG",
  },
  "takahashi-2021": {
    pmid: "33849770",
    title: "Pre-hydrolyzed silane aging on bond to LS₂",
    authors: "Takahashi A, et al.",
    journal: "Dent Mater J",
    year: 2021,
    grade: "STRONG",
  },
  "barghi-2000": {
    pmid: "11199559",
    title: "Air-drying and heat treatment of silane on bond",
    authors: "Barghi N",
    journal: "J Oral Rehabil",
    year: 2000,
    grade: "STRONG",
  },
  "sattabanasuk-2016": {
    pmid: "27187830",
    title: "Silane film thickness on resin-ceramic bond",
    authors: "Sattabanasuk V, et al.",
    journal: "Dent Mater",
    year: 2016,
    grade: "STRONG",
  },
  "matinlinna-2018": {
    pmid: "29397094",
    title: "Silane coupling agents in dental materials: Review",
    authors: "Matinlinna JP, et al.",
    journal: "Chin J Dent Res",
    year: 2018,
    grade: "STRONG",
  },
  "ozcan-2015-hf": {
    pmid: "25765377",
    title: "HF concentration on bonding to LS₂",
    authors: "Ozcan M, et al.",
    journal: "J Adhes Dent",
    year: 2015,
    grade: "STRONG",
  },
  "sundfeld-2018": {
    pmid: "29352880",
    title: "HF etch time on leucite ceramic bond",
    authors: "Sundfeld Neto D",
    journal: "Oper Dent",
    year: 2018,
    grade: "STRONG",
  },
  "neis-2015": {
    pmid: "25625264",
    title: "Surface treatments for glass ceramic repair",
    authors: "Neis CA, et al.",
    journal: "Oper Dent",
    year: 2015,
    grade: "STRONG",
  },
  "brentel-2007": {
    pmid: "17403766",
    title: "Residual HF on bond to leucite ceramic",
    authors: "Brentel AS, et al.",
    journal: "J Adhes Dent",
    year: 2007,
    grade: "STRONG",
  },
  "ozcan-2013": {
    pmid: "23188834",
    title: "Bond to air-abraded vs HF-treated RNC",
    authors: "Ozcan M, et al.",
    journal: "J Adhes Dent",
    year: 2013,
    grade: "STRONG",
  },
  "elsaka-2014": {
    pmid: "25411847",
    title: "Bond of resin CAD/CAM with different treatments",
    authors: "Elsaka SE",
    journal: "J Prosthodont",
    year: 2014,
    grade: "STRONG",
  },
  "ozcan-2015-mdp": {
    pmid: "25843258",
    title: "MDP primers on bond to zirconia",
    authors: "Ozcan M, Bernasconi M",
    journal: "J Adhes Dent",
    year: 2015,
    grade: "STRONG",
  },
  "yang-2010": {
    pmid: "20648250",
    title: "10-MDP on bond to zirconia after sandblasting",
    authors: "Yang B, et al.",
    journal: "Dent Mater",
    year: 2010,
    grade: "STRONG",
  },
  "kern-2015": {
    pmid: "26563238",
    title: "Bonding to oxide ceramics: Lab vs clinical",
    authors: "Kern M",
    journal: "Dent Mater",
    year: 2015,
    grade: "STRONG",
  },
  "ozcan-2019": {
    pmid: "30648958",
    title: "Surface conditioning and bond to PICN",
    authors: "Ozcan M, et al.",
    journal: "J Mech Behav Biomed",
    year: 2019,
    grade: "STRONG",
  },
  "perdigao-2020": {
    pmid: "31843019",
    title: "Current perspectives: Universal adhesives",
    authors: "Perdigao J, et al.",
    journal: "Jpn Dent Sci Rev",
    year: 2020,
    grade: "STRONG",
  },
  "peumans-2012": {
    pmid: "22192253",
    title: "Clinical effectiveness of adhesives for bonded ceramics",
    authors: "Peumans M, et al.",
    journal: "Dent Mater",
    year: 2012,
    grade: "STRONG",
  },
  "suh-2003": {
    pmid: "14520192",
    title: "DC cements with self-etching adhesives",
    authors: "Suh BI, et al.",
    journal: "J Esthet Restor Dent",
    year: 2003,
    grade: "STRONG",
  },
  "vanmeerbeek-2020": {
    pmid: "31980327",
    title: "Selective enamel etching: Meta-analysis",
    authors: "Van Meerbeek B, et al.",
    journal: "Dent Mater",
    year: 2020,
    grade: "STRONG",
  },
  "imazato-2010": {
    pmid: "20018720",
    title: "Antibacterial MDPB in self-etch adhesive",
    authors: "Imazato S, et al.",
    journal: "J Dent",
    year: 2010,
    grade: "MODERATE",
  },
  "daronch-2005": {
    pmid: "16153142",
    title: "Pre-heating on composite properties",
    authors: "Daronch M, et al.",
    journal: "J Dent Res",
    year: 2005,
    grade: "MODERATE",
  },
  "lohbauer-2009": {
    pmid: "19288024",
    title: "Heated composite cementation",
    authors: "Lohbauer U, et al.",
    journal: "Oper Dent",
    year: 2009,
    grade: "MODERATE",
  },
  "quun-2020": {
    pmid: "32012527",
    title: "Cleaning methods after saliva contamination",
    authors: "Quun L, et al.",
    journal: "J Prosthodont",
    year: 2020,
    grade: "MODERATE",
  },
  "al-hamdan-2019": {
    pmid: "31213517",
    title: "Er:YAG laser on glass ceramics: Systematic review",
    authors: "Al-Hamdan RS",
    journal: "Lasers Med Sci",
    year: 2019,
    grade: "EMERGING",
  },
  "elsaka-2016": {
    pmid: "26892037",
    title: "Bond of ZLS to resin composite",
    authors: "Elsaka SE, Elnaghy AM",
    journal: "Dent Mater",
    year: 2016,
    grade: "MODERATE",
  },
  "ellingsen-2021": {
    pmid: "33521154",
    title: "Bond of CAD/CAM to titanium bases",
    authors: "Ellingsen LA, et al.",
    journal: "J Prosthet Dent",
    year: 2021,
    grade: "MODERATE",
  },
  "graf-2022": {
    pmid: "34862055",
    title: "Ti-base cementation: Systematic review",
    authors: "Graf T, et al.",
    journal: "Int J Prosthodont",
    year: 2022,
    grade: "STRONG",
  },
  "abed-2015": {
    pmid: "25882878",
    title: "Fracture resistance of CAD/CAM resin composites",
    authors: "Abed YA, et al.",
    journal: "Dent Mater",
    year: 2015,
    grade: "MODERATE",
  },
  "monticelli-2006": {
    pmid: "16698931",
    title: "Self-adhesive cements into dentin",
    authors: "Monticelli F, et al.",
    journal: "J Dent Res",
    year: 2006,
    grade: "STRONG",
  },
  // Gold/alloy
  "ozcan-2004-alloy": {
    pmid: "15357048",
    title: "Bond strength to noble alloys with alloy primers",
    authors: "Ozcan M, et al.",
    journal: "J Dent",
    year: 2004,
    grade: "STRONG",
  },
  "matsumura-2003": {
    pmid: "12665766",
    title: "Bonding to gold alloy with VBATDT primers",
    authors: "Matsumura H, et al.",
    journal: "J Dent Res",
    year: 2003,
    grade: "STRONG",
  },
  // Rubber dam / isolation
  "wang-2019-dam": {
    pmid: "31177642",
    title: "Rubber dam isolation on longevity of composite restorations",
    authors: "Wang Y, et al.",
    journal: "J Dent",
    year: 2019,
    grade: "STRONG",
  },
  // IFUs
  "ifu-emax": {
    pmid: null,
    title: "IPS e.max CAD IFU",
    authors: "Ivoclar",
    journal: "IFU",
    year: 2024,
    grade: "IFU",
  },
  "ifu-tetric": {
    pmid: null,
    title: "Tetric CAD IFU",
    authors: "Ivoclar",
    journal: "IFU",
    year: 2024,
    grade: "IFU",
  },
  "ifu-enamic": {
    pmid: null,
    title: "VITA ENAMIC IFU",
    authors: "VITA",
    journal: "IFU",
    year: 2023,
    grade: "IFU",
  },
  "ifu-tessera": {
    pmid: null,
    title: "Tessera IFU",
    authors: "Dentsply Sirona",
    journal: "IFU",
    year: 2024,
    grade: "IFU",
  },
  "ifu-empress": {
    pmid: null,
    title: "IPS Empress CAD IFU",
    authors: "Ivoclar",
    journal: "IFU",
    year: 2023,
    grade: "IFU",
  },
  "ifu-katana": {
    pmid: null,
    title: "Katana Zirconia ONE IFU",
    authors: "Kuraray",
    journal: "IFU",
    year: 2024,
    grade: "IFU",
  },
  "ifu-cercon": {
    pmid: null,
    title: "Cercon 4D IFU",
    authors: "Dentsply Sirona",
    journal: "IFU",
    year: 2024,
    grade: "IFU",
  },
  "ifu-zircad": {
    pmid: null,
    title: "IPS e.max ZirCAD Prime IFU",
    authors: "Ivoclar",
    journal: "IFU",
    year: 2024,
    grade: "IFU",
  },
  "ifu-lava": {
    pmid: null,
    title: "Lava Ultimate IFU",
    authors: "3M/Solventum",
    journal: "IFU",
    year: 2023,
    grade: "IFU",
  },
  "ifu-grandio": {
    pmid: null,
    title: "Grandio Blocs IFU",
    authors: "VOCO",
    journal: "IFU",
    year: 2023,
    grade: "IFU",
  },
  "ifu-cerasmart": {
    pmid: null,
    title: "Cerasmart IFU",
    authors: "GC",
    journal: "IFU",
    year: 2023,
    grade: "IFU",
  },
  "ifu-3mzr": {
    pmid: null,
    title: "3M Lava Plus Zirconia IFU",
    authors: "3M/Solventum",
    journal: "IFU",
    year: 2024,
    grade: "IFU",
  },
  "3m-lava-restrict": {
    pmid: null,
    title: "Lava Ultimate — crown restriction",
    authors: "3M ESPE",
    journal: "Tech Bulletin",
    year: 2015,
    grade: "IFU",
  },
};

// ── Shared silane protocol ──
const SILANE_2B = {
  steps: [
    "Mix A+B at point of use",
    "Apply ONE thin coat",
    "React 60 sec",
    "AIR THIN aggressively 10–15 sec",
    "Optional: warm air ~60°C × 5 sec",
    "Verify: dry, tacky surface",
  ],
  warn: "Excess = siloxane multilayer = WEAK BOUNDARY LAYER. Monolayer is the goal.",
  heat: "Heat (50–100°C) promotes condensation, drives off solvents → more durable bond.",
  products: "Bis-silane (Bisco) · Porcelain Primer (Bisco)",
  rationale:
    "Pre-hydrolyzed universal primers (Monobond Plus, Clearfil Ceramic Primer Plus) degrade in solution. Shelf life + open-bottle time directly affect bond. 2-bottle mixes fresh → hydrolytically stable γ-MPS → superior long-term durability.",
  refs: [
    "shen-2004",
    "lung-2012",
    "hooshmand-2004",
    "sattabanasuk-2016",
    "barghi-2000",
    "takahashi-2021",
  ],
};

// ═══════════════════════════════════════════════
// COLOR + CATEGORY SYSTEM
// ═══════════════════════════════════════════════

const CC = {
  "Resin Nano-Ceramic (RNC)": { bg: "#0c2d3e", a: "#22d3ee", t: "#0e4457" },
  "Polymer-Infiltrated Ceramic (PICN)": {
    bg: "#1f1535",
    a: "#c084fc",
    t: "#2e1a5e",
  },
  "Nano-ceramic Hybrid (RNC)": { bg: "#0c2d3e", a: "#22d3ee", t: "#0e4457" },
  "Force-Absorbing Hybrid (RNC)": { bg: "#0c2d3e", a: "#22d3ee", t: "#0e4457" },
  "Advanced Lithium Disilicate (ZLS+)": {
    bg: "#2d0f1e",
    a: "#fb7185",
    t: "#4a1530",
  },
  "Lithium Disilicate (LS₂)": { bg: "#2d0f1e", a: "#fb7185", t: "#4a1530" },
  "Leucite Glass-Ceramic": { bg: "#2d1f0a", a: "#fbbf24", t: "#4a3510" },
  "Super-Translucent Zirconia (4Y-TZP STML)": {
    bg: "#0a1a2e",
    a: "#60a5fa",
    t: "#0f2a4a",
  },
  "Multilayered Zirconia (4Y/5Y-TZP)": {
    bg: "#0a1a2e",
    a: "#60a5fa",
    t: "#0f2a4a",
  },
  "Zirconia + Fusion Layer (4Y-TZP)": {
    bg: "#0a1a2e",
    a: "#60a5fa",
    t: "#0f2a4a",
  },
  "High-Translucency Zirconia (3Y/5Y-TZP)": {
    bg: "#0a1a2e",
    a: "#60a5fa",
    t: "#0f2a4a",
  },
  "Titanium Implant Interface": { bg: "#1a1a14", a: "#a8a29e", t: "#2e2e22" },
  "Gold / Noble Alloy": { bg: "#2a2008", a: "#eab308", t: "#3d3010" },
  "Self-Adhesive Resin Cement": { bg: "#1a2210", a: "#84cc16", t: "#2e3d14" },
  "Dual-Cure Adhesive Resin Cement": {
    bg: "#1a2210",
    a: "#84cc16",
    t: "#2e3d14",
  },
  "Light-Cure Resin Cement": { bg: "#22160a", a: "#f97316", t: "#3d2510" },
  "Hybrid Abutment Resin Cement": { bg: "#1a1a14", a: "#a8a29e", t: "#2e2e22" },
  "Resin-Modified Glass Ionomer (RMGI)": {
    bg: "#0f1a22",
    a: "#38bdf8",
    t: "#142a3d",
  },
  "Heated Packable Composite (Off-Label Luting)": {
    bg: "#22160a",
    a: "#f97316",
    t: "#3d2510",
  },
  "Fiber-Reinforced Flowable Composite": {
    bg: "#1a1022",
    a: "#e879f9",
    t: "#2e1a3d",
  },
  "Universal Flowable Composite": { bg: "#1a1022", a: "#e879f9", t: "#2e1a3d" },
  "Packable/Universal Composite": { bg: "#1a1022", a: "#e879f9", t: "#2e1a3d" },
  "Bulk Fill Composite": { bg: "#1a1022", a: "#e879f9", t: "#2e1a3d" },
  "Dual-Cure Core Build-Up": { bg: "#1a1022", a: "#e879f9", t: "#2e1a3d" },
  "Total-Etch 3-Step Adhesive": { bg: "#0a1a1a", a: "#2dd4bf", t: "#0f2e2e" },
  "Self-Etch 2-Step Adhesive": { bg: "#0a1a1a", a: "#2dd4bf", t: "#0f2e2e" },
  "Universal Adhesive": { bg: "#0a1a1a", a: "#2dd4bf", t: "#0f2e2e" },
};
const gc = (c) => CC[c] || { bg: "#111827", a: "#6b7280", t: "#1f2937" };
const getGroup = (c) => {
  if (
    c.includes("RNC") ||
    c.includes("PICN") ||
    (c.includes("Hybrid") && !c.includes("Abutment"))
  )
    return "Restorative Blocks";
  if (c.includes("Lithium") || c.includes("ZLS") || c.includes("Leucite"))
    return "Glass-Ceramics";
  if (c.includes("Zirconia") || c.includes("TZP") || c.includes("Fusion"))
    return "Zirconia";
  if (c.includes("Titanium")) return "Ti-Base";
  if (c.includes("Gold") || c.includes("Noble")) return "Gold / Metal";
  if (
    c.includes("Cement") ||
    c.includes("RMGI") ||
    c.includes("Off-Label Luting") ||
    c.includes("Abutment Resin")
  )
    return "Cements";
  if (
    c.includes("Flowable") ||
    c.includes("Packable") ||
    c.includes("Bulk Fill") ||
    c.includes("Core Build") ||
    c.includes("Fiber-Reinforced")
  )
    return "Composites";
  if (c.includes("Adhesive") || c.includes("adhesive")) return "Bonding Agents";
  return "Other";
};
const GROUPS = [
  "Restorative Blocks",
  "Glass-Ceramics",
  "Zirconia",
  "Ti-Base",
  "Gold / Metal",
  "Cements",
  "Composites",
  "Bonding Agents",
];

// ═══════════════════════════════════════════════
// UI PRIMITIVES
// ═══════════════════════════════════════════════

function ReadMore({ children, color }) {
  const [open, setOpen] = useState(false);
  if (!children) return null;
  return (
    <div style={{ marginTop: 4 }}>
      <span
        onClick={() => setOpen(!open)}
        style={{
          color: color || "#475569",
          fontSize: 10.5,
          cursor: "pointer",
          fontWeight: 600,
          textDecoration: "underline",
          textDecorationStyle: "dotted",
        }}
      >
        {open ? "▾ hide rationale" : "▸ read more"}
      </span>
      {open && (
        <div
          style={{
            color: "#64748b",
            fontSize: 11.5,
            lineHeight: 1.5,
            marginTop: 4,
            paddingLeft: 8,
            borderLeft: "2px solid #1e293b",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function Ref({ ids }) {
  const [show, setShow] = useState(false);
  if (!ids?.length) return null;
  const valid = ids.filter((id) => CIT[id]);
  if (!valid.length) return null;
  return (
    <span style={{ position: "relative", display: "inline" }}>
      <span
        onClick={(e) => {
          e.stopPropagation();
          setShow(!show);
        }}
        style={{ cursor: "pointer" }}
      >
        {valid.slice(0, 4).map((id, i) => {
          const g = EG[CIT[id]?.grade];
          return (
            <sup
              key={id}
              style={{
                fontSize: 8,
                fontWeight: 800,
                color: g?.color,
                background: g?.bg,
                padding: "1px 3px",
                borderRadius: 2,
                marginLeft: i ? 1 : 3,
              }}
            >
              {i + 1}
            </sup>
          );
        })}
        {valid.length > 4 && (
          <sup style={{ fontSize: 8, color: "#475569" }}>
            +{valid.length - 4}
          </sup>
        )}
      </span>
      {show && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            left: 0,
            top: "100%",
            zIndex: 50,
            width: 340,
            background: "#0c1222",
            border: "1px solid #1e293b",
            borderRadius: 10,
            padding: "10px 12px",
            marginTop: 4,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <span
              style={{
                color: "#64748b",
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
            >
              References
            </span>
            <span
              onClick={() => setShow(false)}
              style={{ color: "#475569", cursor: "pointer", fontSize: 14 }}
            >
              ×
            </span>
          </div>
          {valid.map((id, i) => {
            const c = CIT[id],
              g = EG[c.grade];
            const url = c.pmid
              ? `https://pubmed.ncbi.nlm.nih.gov/${c.pmid}/`
              : c.url || null;
            return (
              <div
                key={id}
                style={{
                  marginBottom: 6,
                  paddingBottom: 4,
                  borderBottom:
                    i < valid.length - 1 ? "1px solid #1e293b22" : "none",
                }}
              >
                <div
                  style={{ display: "flex", gap: 5, alignItems: "flex-start" }}
                >
                  <span
                    style={{
                      background: g?.bg,
                      color: g?.color,
                      fontSize: 7,
                      fontWeight: 800,
                      padding: "2px 4px",
                      borderRadius: 2,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {g?.label}
                  </span>
                  <div>
                    <div
                      style={{
                        color: "#cbd5e1",
                        fontSize: 10.5,
                        fontWeight: 600,
                        lineHeight: 1.3,
                      }}
                    >
                      {c.title}
                    </div>
                    <div style={{ color: "#475569", fontSize: 9.5 }}>
                      {c.authors} · <em>{c.journal}</em> {c.year}
                    </div>
                    {url && (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#3b82f6",
                          fontSize: 8.5,
                          textDecoration: "none",
                          fontWeight: 600,
                        }}
                      >
                        {c.pmid ? `PMID:${c.pmid}` : "View"} ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </span>
  );
}

function S({ children, color, refs }) {
  return (
    <h3
      style={{
        fontFamily: "'Newsreader',Georgia,serif",
        fontSize: 14,
        fontWeight: 700,
        color: color || "#e2e8f0",
        margin: "18px 0 6px",
        borderBottom: `1px solid ${color || "#334155"}33`,
        paddingBottom: 4,
        display: "flex",
        alignItems: "center",
        gap: 4,
        flexWrap: "wrap",
      }}
    >
      {children}
      <Ref ids={refs} />
    </h3>
  );
}

function R({ l, v, c, w }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 7,
        marginBottom: 3,
        alignItems: "flex-start",
      }}
    >
      <span
        style={{
          color: c || "#475569",
          fontWeight: 700,
          fontSize: 10,
          minWidth: 80,
          textTransform: "uppercase",
          letterSpacing: 0.4,
          paddingTop: 2,
          flexShrink: 0,
        }}
      >
        {l}
      </span>
      <span
        style={{ color: "#cbd5e1", fontSize: 12, flex: 1, lineHeight: 1.5 }}
      >
        {v}
        {w && (
          <span
            style={{
              display: "inline-block",
              background: "#7f1d1d",
              color: "#fca5a5",
              fontSize: 9,
              fontWeight: 700,
              padding: "1px 5px",
              borderRadius: 3,
              marginLeft: 5,
            }}
          >
            ⚠ {w}
          </span>
        )}
      </span>
    </div>
  );
}

function OL({ items, c }) {
  return (
    <ol style={{ margin: "4px 0", paddingLeft: 18, lineHeight: 1.6 }}>
      {items.map((s, i) => (
        <li
          key={i}
          style={{ color: c || "#94a3b8", fontSize: 12, marginBottom: 2 }}
        >
          {s}
        </li>
      ))}
    </ol>
  );
}

function Card({ bg, a, border, children }) {
  return (
    <div
      style={{
        background: bg || "rgba(255,255,255,0.03)",
        borderRadius: 7,
        padding: "8px 12px",
        marginBottom: 6,
        borderLeft: `3px solid ${border || a || "#334155"}`,
      }}
    >
      {children}
    </div>
  );
}

// Curing info callout — compact
function CureInfo({ text }) {
  return (
    <div
      style={{
        background: "#0f172a",
        borderRadius: 6,
        padding: "6px 10px",
        marginTop: 6,
        border: "1px solid #1e293b",
      }}
    >
      <span style={{ color: "#fbbf24", fontSize: 9, fontWeight: 800 }}>
        💡 CURING:{" "}
      </span>
      <span style={{ color: "#94a3b8", fontSize: 10.5 }}>
        {text || CURE_INFO.standard}
      </span>
    </div>
  );
}

// Isolation callout — compact
function IsolationInfo() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: 6 }}>
      <span
        onClick={() => setOpen(!open)}
        style={{
          color: "#2dd4bf",
          fontSize: 10,
          cursor: "pointer",
          fontWeight: 700,
          textDecoration: "underline",
          textDecorationStyle: "dotted",
        }}
      >
        {open ? "▾ hide isolation" : "▸ isolation protocols"}
      </span>
      {open && (
        <div
          style={{
            background: "#0a1a1a",
            borderRadius: 6,
            padding: "8px 10px",
            marginTop: 4,
            border: "1px solid #1e293b",
          }}
        >
          <R l="Rubber Dam" v={ISOLATION.rubberDam} c="#2dd4bf" />
          <R l="Isolite" v={ISOLATION.isolite} c="#2dd4bf" />
          <R l="Cotton" v={ISOLATION.cottonRoll} c="#2dd4bf" />
          <ReadMore color="#2dd4bf">{ISOLATION.evidence}</ReadMore>
        </div>
      )}
    </div>
  );
}

// ── Header component for all detail views ──
function DetailHeader({ item, onBack, extra }) {
  const col = gc(item.cat);
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,600;6..72,700&family=Outfit:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          color: col.a,
          cursor: "pointer",
          fontFamily: "'Outfit'",
          fontSize: 12,
          fontWeight: 700,
          padding: "8px 0",
          marginBottom: 8,
        }}
      >
        ← Back
      </button>
      <div
        style={{
          background: `linear-gradient(135deg, ${col.bg}, #080d19)`,
          borderRadius: 12,
          padding: "18px 22px",
          marginBottom: 12,
          border: `1px solid ${col.a}22`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <div>
            <div
              style={{
                color: col.a,
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 2,
              }}
            >
              {item.mfr}
            </div>
            <h1
              style={{
                fontFamily: "'Newsreader',Georgia,serif",
                fontSize: 24,
                color: "#f1f5f9",
                margin: "0 0 5px",
                fontWeight: 700,
              }}
            >
              {item.name}
            </h1>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              <span
                style={{
                  background: col.t,
                  color: col.a,
                  fontSize: 9,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 16,
                }}
              >
                {item.cat}
              </span>
              {extra}
            </div>
          </div>
          {item.strength && (
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  color: "#475569",
                  fontSize: 9,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Strength
              </div>
              <div
                style={{
                  color: "#f1f5f9",
                  fontSize: 17,
                  fontWeight: 900,
                  fontFamily: "'Outfit'",
                }}
              >
                {item.strength}
              </div>
            </div>
          )}
        </div>
        {item.composition && (
          <p
            style={{
              color: "#64748b",
              fontSize: 11,
              marginTop: 6,
              lineHeight: 1.4,
            }}
          >
            {item.composition}
          </p>
        )}
        {item.notes && (
          <p
            style={{
              color: "#fbbf24",
              fontSize: 11,
              marginTop: 4,
              lineHeight: 1.4,
              fontWeight: 500,
            }}
          >
            {item.notes}
          </p>
        )}
        {item.indications && (
          <div
            style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8 }}
          >
            {item.indications.map((ind) => (
              <span
                key={ind}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "#94a3b8",
                  fontSize: 9,
                  padding: "2px 7px",
                  borderRadius: 10,
                }}
              >
                {ind}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function TabBar({ tabs, active, setActive, color }) {
  return (
    <div
      style={{ display: "flex", gap: 3, marginBottom: 12, flexWrap: "wrap" }}
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => setActive(t.id)}
          style={{
            background: active === t.id ? color : "rgba(255,255,255,0.05)",
            color: active === t.id ? "#080d19" : "#64748b",
            border: "none",
            borderRadius: 7,
            padding: "6px 12px",
            fontFamily: "'Outfit'",
            fontSize: 11.5,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════
// MATERIALS DATA — CORRECTED
// Katana ONE/Speed → 4Y-TZP STML (not UTML)
// Gold bonding added
// ═══════════════════════════════════════════════

const MATERIALS = [
  {
    id: "tetric-cad",
    name: "Tetric CAD",
    mfr: "Ivoclar",
    cat: "Resin Nano-Ceramic (RNC)",
    composition: "UDMA/Bis-GMA + barium glass/SiO₂ nanofillers",
    strength: "273 MPa",
    indications: ["Inlay", "Onlay", "Veneer", "Crown (single)"],
    notes: "Shock absorbing — good for implant restorations. No HF.",
    surface: {
      etch: {
        m: "No HF",
        d: "HF degrades resin matrix",
        w: "Contraindicated",
        refs: ["ifu-tetric", "ozcan-2013"],
      },
      abrasion: {
        m: "Al₂O₃ 50 μm · 1.5–2 bar · 10 sec",
        refs: ["ozcan-2013", "elsaka-2014"],
      },
      clean: ["Ultrasonic × 5 min", "Steam", "Ivoclean if contaminated"],
      primer: {
        best: "2-Bottle Silane",
        mechanism: "Silane → SiO₂/barium glass filler",
        conflict: false,
        refs: ["shen-2004", "lung-2012", "sattabanasuk-2016"],
      },
      laser: false,
    },
    cement: {
      pref: [
        {
          t: "LC resin cement",
          ex: "Variolink Esthetic LC, RelyX Veneer",
          n: "Veneers/thin (<2mm)",
          cure: "20s/surface ≥1000 mW/cm²",
        },
        {
          t: "DC resin cement",
          ex: "Variolink DC, Panavia V5",
          n: ">2mm or limited light",
          dc: "DC activator with self-etch adhesives",
        },
      ],
      avoid: ["SA alone", "RMGI"],
      special: "Warmed APX (55°C) viable as luting agent",
      refs: ["suh-2003", "daronch-2005"],
    },
    tooth: {
      etch: "Selective enamel 37% H₃PO₄ 15–30s",
      adh: [
        {
          s: "Selective etch + Universal",
          ex: "Adhese Universal, Scotchbond Universal Plus",
          steps: [
            "Sel etch enamel 15–30s → rinse → blot",
            "Apply adhesive, scrub 20s",
            "Air thin 5s → cure 10s",
          ],
          dc: "DC activator for DC cements",
        },
        {
          s: "Total-etch 3-step (gold standard)",
          ex: "OptiBond FL",
          steps: [
            "37% H₃PO₄: enamel 15–30s, dentin 10–15s → rinse → blot moist",
            "Primer → air dry 5s",
            "Adhesive → air thin → cure 20s",
          ],
          dc: "Inherently DC compatible",
        },
        {
          s: "Self-etch 2-step (antibacterial)",
          ex: "Clearfil SE Protect",
          steps: [
            "SE primer scrub 20s → air dry",
            "Bond → air thin → cure 10s",
          ],
          dc: "MDPB antibacterial. DC Activator needed for DC cements",
        },
      ],
      contam: {
        saliva: "Re-etch enamel 10s, re-apply adhesive",
        tryIn:
          "2% CHX (Peridex) or SE Protect primer as decontaminant → re-bond",
        blood: "Ivoclean 20s → reprep",
      },
      refs: [
        "vanmeerbeek-2020",
        "perdigao-2020",
        "peumans-2012",
        "imazato-2010",
      ],
    },
  },
  {
    id: "vita-enamic",
    name: "Vita Enamic",
    mfr: "VITA",
    cat: "Polymer-Infiltrated Ceramic (PICN)",
    composition: "86 wt% feldspathic ceramic + 14 wt% UDMA/TEGDMA polymer",
    strength: "150–160 MPa",
    indications: ["Inlay", "Onlay", "Veneer", "Crown (ant/premolar)"],
    notes:
      "Dual-network: HF etch ceramic phase + silane. Kindest to opposing dentition.",
    surface: {
      etch: {
        m: "5% HF × 60 sec",
        d: "Targets ceramic network",
        w: "Do NOT use 9.5% — destroys polymer",
        refs: ["ifu-enamic", "ozcan-2019", "neis-2015"],
      },
      abrasion: {
        m: "Adjunct: Al₂O₃ 50 μm before HF (dual > either alone)",
        refs: ["ozcan-2019"],
      },
      clean: [
        "Ultrasonic × 5 min post-HF",
        "Steam",
        "Ivoclean if contaminated",
      ],
      primer: {
        best: "2-Bottle Silane",
        mechanism: "Silane → ceramic; methacrylate → polymer (dual bond)",
        conflict: false,
        refs: ["shen-2004", "ozcan-2019", "sattabanasuk-2016"],
      },
      laser: false,
    },
    cement: {
      pref: [
        {
          t: "LC resin cement",
          ex: "Variolink LC, RelyX Veneer",
          n: "Veneers <2mm",
          cure: "20s",
        },
        {
          t: "DC resin cement",
          ex: "Variolink DC, Panavia V5",
          n: "Full coverage",
          dc: "DC activator",
        },
      ],
      avoid: ["RMGI", "SA alone"],
      special: "Warmed APX viable for well-fitting inlays",
      refs: ["suh-2003", "ifu-enamic"],
    },
    tooth: {
      etch: "Selective enamel 37% H₃PO₄ 15–30s",
      adh: [
        {
          s: "Selective etch + Universal",
          ex: "Adhese Universal, Scotchbond Universal Plus",
          steps: [
            "Sel etch → rinse → blot",
            "Adhesive scrub 20s → air thin → cure 10s",
          ],
          dc: "DC activator for DC cements",
        },
        {
          s: "Total-etch 3-step",
          ex: "OptiBond FL",
          steps: ["Full etch → primer → adhesive → cure"],
          dc: "Inherently DC",
        },
      ],
      contam: {
        saliva: "Re-etch, re-bond",
        tryIn: "CHX or Ivoclean → re-bond",
        blood: "Ivoclean → re-etch if needed",
      },
      refs: ["vanmeerbeek-2020", "perdigao-2020"],
    },
  },
  {
    id: "lava-ultimate",
    name: "Lava Ultimate",
    mfr: "3M/Solventum",
    cat: "Resin Nano-Ceramic (RNC)",
    composition: "Silica + zirconia nanoparticles in resin matrix",
    strength: "200 MPa",
    indications: ["Inlay", "Onlay", "Veneer ONLY"],
    notes: "⚠ NO CROWNS — 3M restricted 2015 due to debonding.",
    surface: {
      etch: {
        m: "No HF",
        d: "Contraindicated for RNC",
        w: "HF destroys resin matrix",
        refs: ["ifu-lava", "ozcan-2013"],
      },
      abrasion: {
        m: "Al₂O₃ 50 μm · 2.0 bar · 10 sec",
        refs: ["ifu-lava", "elsaka-2014"],
      },
      clean: ["Ultrasonic", "Steam"],
      primer: {
        best: "2-Bottle Silane",
        mechanism: "Silane → silica/zirconia nano-fillers",
        conflict: false,
        refs: ["shen-2004", "ifu-lava"],
      },
      laser: false,
    },
    cement: {
      pref: [
        {
          t: "DC resin cement",
          ex: "RelyX Ultimate, Panavia V5",
          n: "Primary",
          dc: "Built into system",
        },
        {
          t: "LC resin cement",
          ex: "RelyX Veneer",
          n: "Thin veneers",
          cure: "20s",
        },
      ],
      avoid: ["SA alone", "RMGI", "Crown cementation"],
      special: "Consider Tetric CAD or Grandio for crowns instead.",
      refs: ["ifu-lava", "3m-lava-restrict"],
    },
    tooth: {
      etch: "Selective enamel 15–30s",
      adh: [
        {
          s: "Scotchbond Universal Plus",
          ex: "Scotchbond Universal Plus",
          steps: ["Sel etch → rinse → blot", "Scrub 20s → air thin → cure 10s"],
          dc: "Inherently DC",
        },
      ],
      contam: {
        saliva: "Re-etch, re-bond",
        tryIn: "CHX → re-bond",
        blood: "CHX → re-bond",
      },
      refs: ["perdigao-2020"],
    },
  },
  {
    id: "grandio-blocs",
    name: "Grandio Blocs",
    mfr: "VOCO",
    cat: "Nano-ceramic Hybrid (RNC)",
    composition: "86 wt% nano-ceramic in resin — highest filler RNC",
    strength: "333 MPa",
    indications: ["Inlay", "Onlay", "Veneer", "Crown"],
    notes: "Highest strength RNC. E-modulus ≈ dentin. Crown approved.",
    surface: {
      etch: {
        m: "No HF",
        d: "Resin-based",
        w: "HF contraindicated",
        refs: ["ifu-grandio"],
      },
      abrasion: {
        m: "Al₂O₃ 50 μm · 1.5–2 bar · 10 sec",
        refs: ["abed-2015", "elsaka-2014"],
      },
      clean: ["Ultrasonic 3–5 min", "Steam", "Ivoclean if contaminated"],
      primer: {
        best: "2-Bottle Silane",
        mechanism: "Silane → 86 wt% ceramic filler = max bonding substrate",
        conflict: false,
        refs: ["shen-2004", "ifu-grandio"],
      },
      laser: false,
    },
    cement: {
      pref: [
        {
          t: "DC resin cement",
          ex: "Bifix QM, Variolink DC, Panavia V5",
          n: "VOCO: Futurabond U + Bifix QM",
          dc: "Futurabond U inherently DC",
        },
        {
          t: "LC resin cement",
          ex: "Variolink LC",
          n: "Thin restorations",
          cure: "20s",
        },
      ],
      avoid: ["SA alone", "RMGI"],
      special: "High filler = excellent posterior wear resistance.",
      refs: ["ifu-grandio", "suh-2003"],
    },
    tooth: {
      etch: "Selective enamel 15–30s",
      adh: [
        {
          s: "Universal (selective etch)",
          ex: "Futurabond U, Adhese Universal",
          steps: [
            "Sel etch → rinse → blot",
            "Adhesive scrub 20s → air thin → cure 10s",
          ],
          dc: "Futurabond U inherently DC",
        },
      ],
      contam: {
        saliva: "Re-etch, re-bond",
        tryIn: "CHX or Ivoclean",
        blood: "Ivoclean",
      },
      refs: ["vanmeerbeek-2020"],
    },
  },
  {
    id: "cerasmart",
    name: "Cerasmart",
    mfr: "GC",
    cat: "Force-Absorbing Hybrid (RNC)",
    composition: "Silica + barium glass in UDMA/DMA (71 wt%)",
    strength: "231 MPa",
    indications: ["Inlay", "Onlay", "Veneer", "Crown", "Implant crown"],
    notes: "Force-absorbing — good on implants. Low chipping.",
    surface: {
      etch: {
        m: "No HF",
        d: "Resin-based",
        w: "HF contraindicated",
        refs: ["ifu-cerasmart"],
      },
      abrasion: {
        m: "Al₂O₃ 50 μm · 1.5–2 bar · 10 sec",
        refs: ["ifu-cerasmart", "elsaka-2014"],
      },
      clean: ["Ultrasonic", "Steam", "Ivoclean after try-in"],
      primer: {
        best: "2-Bottle Silane",
        mechanism: "Silane → glass filler",
        conflict: false,
        refs: ["shen-2004", "ifu-cerasmart"],
      },
      laser: false,
    },
    cement: {
      pref: [
        {
          t: "DC resin cement",
          ex: "G-CEM ONE, LinkForce, Variolink DC",
          n: "Simplified: sandblast → silane → G-CEM ONE",
          dc: "G-CEM ONE self-adhesive DC",
        },
      ],
      avoid: ["RMGI alone"],
      special: "G-CEM ONE simplified protocol acceptable for routine cases.",
      refs: ["ifu-cerasmart", "suh-2003"],
    },
    tooth: {
      etch: "Selective enamel 15–30s",
      adh: [
        {
          s: "Universal or SA cement",
          ex: "G-Premio Bond, G-CEM ONE",
          steps: [
            "Sel etch enamel (recommended even with SA)",
            "Adhesive or seat with G-CEM ONE",
          ],
          dc: "G-Premio inherently DC",
        },
      ],
      contam: {
        saliva: "Re-etch, re-bond",
        tryIn: "CHX or Ivoclean",
        blood: "Clean, re-prep",
      },
      refs: ["perdigao-2020"],
    },
  },
  {
    id: "tessera",
    name: "Tessera",
    mfr: "Dentsply Sirona",
    cat: "Advanced Lithium Disilicate (ZLS+)",
    composition:
      "ZrO₂-reinforced lithium silicate — pre-crystallized (no firing)",
    strength: "700 MPa (no furnace)",
    indications: ["Inlay", "Onlay", "Veneer", "Crown", "3-unit FPD (ant)"],
    notes:
      "No crystallization firing for CEREC. Mill → polish → seat. 700 MPa without furnace.",
    surface: {
      etch: {
        m: "5% HF × 20 sec",
        d: "20 sec NOT 60 sec (different from Empress)",
        w: "Do NOT use 9.5% HF or Empress timing",
        refs: ["ifu-tessera", "elsaka-2016", "neis-2015"],
      },
      abrasion: {
        m: "Not primary — HF preferred for glass-ceramics",
        refs: ["ifu-tessera"],
      },
      clean: [
        "Rinse HF ≥30 sec",
        "Ultrasonic × 5 min (remove fluorosilicate salts)",
        "Steam",
        "Ivoclean if contaminated",
      ],
      primer: {
        best: "2-Bottle Silane",
        mechanism: "Silane → SiO₂/glass phase exposed by HF",
        conflict: true,
        refs: ["shen-2004", "lung-2012", "hooshmand-2004", "ifu-tessera"],
      },
      laser: true,
      laserNote: "Er:YAG promising — not yet IFU standard",
    },
    cement: {
      pref: [
        {
          t: "LC resin cement",
          ex: "Calibra Ceram, Variolink LC, RelyX Veneer",
          n: "Veneers/thin. Best color stability.",
          cure: "20s",
        },
        {
          t: "DC resin cement",
          ex: "Calibra Universal, Variolink DC, Panavia V5",
          n: "Crowns, opaque preps, >2mm",
          dc: "DC activator with adhesive",
        },
      ],
      avoid: ["SA for veneers", "RMGI for bonded ceramics"],
      special: "DS system: Prime&Bond Active + Calibra Ceram.",
      refs: ["ifu-tessera", "suh-2003"],
    },
    tooth: {
      etch: "Selective enamel 15–30s — critical for glass-ceramic",
      adh: [
        {
          s: "Universal (selective etch)",
          ex: "Prime&Bond Active, Adhese Universal",
          steps: [
            "Sel etch enamel → rinse → blot",
            "Adhesive scrub 20s → air thin → cure 10s",
          ],
          dc: "Prime&Bond Active: Self-Cure Activator for DC",
        },
        {
          s: "Total-etch 3-step",
          ex: "OptiBond FL",
          steps: ["Full etch → primer → adhesive → cure"],
          dc: "Inherently DC",
        },
      ],
      contam: {
        saliva: "Re-etch, re-bond",
        tryIn: "Peridex or Ivoclean → re-silanate",
        blood: "Ivoclean → re-silanate",
      },
      refs: ["vanmeerbeek-2020", "peumans-2012"],
    },
  },
  {
    id: "emax-cad",
    name: "IPS e.max CAD",
    mfr: "Ivoclar",
    cat: "Lithium Disilicate (LS₂)",
    composition:
      "Lithium disilicate glass-ceramic — requires crystallization firing",
    strength: "530 MPa (crystallized)",
    indications: [
      "Inlay",
      "Onlay",
      "Veneer",
      "Crown",
      "3-unit FPD",
      "Implant abutment",
    ],
    notes:
      "Gold standard glass-ceramic. Blue=130 MPa → crystallized=530 MPa. Requires Programat.",
    surface: {
      etch: {
        m: "5% HF × 20 sec (crystallized only)",
        d: "Creates micro-retentive surface. Frosted/matte = adequate.",
        w: "Do NOT etch blue state. 5%/20s per IFU.",
        refs: ["ifu-emax", "ozcan-2015-hf", "neis-2015"],
      },
      abrasion: { m: "Not primary — HF standard for LS₂", refs: ["ifu-emax"] },
      clean: [
        "Rinse HF ≥30 sec",
        "Ultrasonic × 5 min (CRITICAL — remove fluorosilicates)",
        "Steam",
        "Ivoclean if contaminated",
      ],
      primer: {
        best: "2-Bottle Silane",
        mechanism:
          "Silane → SiO₂ in glass phase — THE critical bond for LS₂ longevity",
        conflict: true,
        refs: [
          "shen-2004",
          "takahashi-2021",
          "lung-2012",
          "hooshmand-2004",
          "sattabanasuk-2016",
          "ifu-emax",
        ],
      },
      laser: true,
      laserNote: "Er:YAG adjunctive — HF standard",
    },
    cement: {
      pref: [
        {
          t: "LC resin cement",
          ex: "Variolink Esthetic LC",
          n: "Veneers, thin inlays. Best color stability.",
          cure: "20s ≥1000 mW/cm²",
        },
        {
          t: "DC resin cement",
          ex: "Variolink DC, Multilink Automix, Panavia V5",
          n: "Crowns, FPDs, >2mm, limited light",
          dc: "Adhese Universal: DC activator 1:1 REQUIRED",
        },
      ],
      avoid: ["RMGI for bonded e.max", "SA for veneers"],
      special:
        "SpeedCEM Plus OK for retentive preps per IFU. Adhesive still outperforms.",
      refs: ["ifu-emax", "suh-2003"],
    },
    tooth: {
      etch: "Selective enamel 15–30s — NON-NEGOTIABLE for glass-ceramic",
      adh: [
        {
          s: "Adhese Universal + DC Activator (Ivoclar)",
          ex: "Adhese Universal + DC Activator",
          steps: [
            "Sel etch enamel 15–30s → rinse → blot",
            "Mix Adhese + DC Activator 1:1",
            "Scrub 20s → air thin → cure 10s",
          ],
          dc: "⚠ DC Activator REQUIRED for Variolink DC",
        },
        {
          s: "Total-etch 3-step (gold standard)",
          ex: "OptiBond FL",
          steps: ["Full etch → primer → adhesive → cure 20s"],
          dc: "Inherently DC — no activator",
        },
        {
          s: "Self-etch 2-step (antibacterial)",
          ex: "Clearfil SE Protect",
          steps: [
            "SE primer scrub 20s → air dry",
            "Bond → air thin → cure 10s",
          ],
          dc: "MDPB antibacterial. DC Activator for DC cements.",
        },
      ],
      contam: {
        saliva: "Re-isolate → re-etch enamel 10s → re-apply adhesive",
        tryIn:
          "Peridex scrub 20s → rinse → Ivoclean 20s on restoration → re-silanate",
        blood:
          "Ivoclean 20s on restoration, re-etch tooth if blood contacted prep",
      },
      refs: [
        "vanmeerbeek-2020",
        "perdigao-2020",
        "peumans-2012",
        "suh-2003",
        "imazato-2010",
      ],
    },
  },
  {
    id: "empress-cad-multi",
    name: "IPS Empress CAD Multi",
    mfr: "Ivoclar",
    cat: "Leucite Glass-Ceramic",
    composition: "Leucite-reinforced glass-ceramic with shade gradient",
    strength: "185 MPa",
    indications: ["Inlay", "Onlay", "Veneer", "Anterior crown"],
    notes:
      "Highest esthetics, lowest strength. ADHESIVE CEMENTATION MANDATORY — 185 MPa insufficient without bond.",
    surface: {
      etch: {
        m: "5% HF × 60 sec",
        d: "Leucite needs LONGER than LS₂. 60 sec NOT 20 sec.",
        w: "Do NOT confuse with e.max/Tessera timing",
        refs: ["ifu-empress", "sundfeld-2018", "neis-2015"],
      },
      abrasion: { m: "Not primary — HF standard", refs: [] },
      clean: [
        "Rinse thoroughly",
        "Ultrasonic × 5 min",
        "Steam",
        "Ivoclean if contaminated",
      ],
      primer: {
        best: "2-Bottle Silane",
        mechanism: "Silane → leucite crystals + glass phase",
        conflict: true,
        refs: ["shen-2004", "lung-2012", "sattabanasuk-2016", "ifu-empress"],
      },
      laser: true,
      laserNote: "Er:YAG under research",
    },
    cement: {
      pref: [
        {
          t: "LC resin cement",
          ex: "Variolink Esthetic LC",
          n: "Veneers — primary use",
          cure: "20s",
        },
        {
          t: "DC resin cement",
          ex: "Variolink Esthetic DC",
          n: "Anterior crowns",
          dc: "DC activator",
        },
      ],
      avoid: ["SA", "RMGI", "Conventional cement"],
      special: "ADHESIVE CEMENTATION MANDATORY.",
      refs: ["ifu-empress"],
    },
    tooth: {
      etch: "Selective enamel 15–30s — max enamel = max bond = survival",
      adh: [
        {
          s: "Selective etch + Universal",
          ex: "Adhese Universal",
          steps: [
            "Sel etch → rinse → blot",
            "Adhesive + DC activator → scrub → cure",
          ],
          dc: "DC activator for DC",
        },
        {
          s: "Total-etch 3-step",
          ex: "OptiBond FL",
          steps: ["Full etch → primer → adhesive → cure"],
          dc: "Best bond for critical esthetics",
        },
      ],
      contam: {
        saliva: "Re-etch, re-bond",
        tryIn: "Peridex/Ivoclean → re-silanate",
        blood: "Ivoclean → re-silanate",
      },
      refs: ["vanmeerbeek-2020", "peumans-2012"],
    },
  },
  {
    id: "katana-one",
    name: "Katana Zirconia ONE / Speed",
    mfr: "Kuraray Noritake",
    cat: "Super-Translucent Zirconia (4Y-TZP STML)",
    composition:
      "4 mol% yttria-stabilized zirconia — STML lineage (successor to Katana STML disc). Multi-layered with 4 gradient zones.",
    strength: "ONE: 933 MPa · Speed: 1023 MPa",
    indications: [
      "Crown (ant + post)",
      "Inlay",
      "Onlay",
      "Veneer",
      "Bridge (ONE Bridge block)",
    ],
    notes:
      "4Y-TZP STML — NOT UTML (5Y). Rep-confirmed and literature-verified (Kuraray FAQ, Sinha 2022). Speed = 9 min sinter, 1023 MPa. No HF — MDP required.",
    surface: {
      etch: {
        m: "No HF",
        d: "Polycrystalline — no glass phase. HF has zero effect.",
        w: "HF completely ineffective",
        refs: ["ifu-katana", "kern-2015"],
      },
      abrasion: {
        m: "Al₂O₃ 50 μm · 1.5–2.0 bar · 10–15 sec",
        refs: ["ifu-katana", "kern-2015", "yang-2010"],
      },
      clean: [
        "Katana Cleaner 20 sec (proprietary)",
        "Alternative: Ivoclean 20 sec",
        "Steam after sandblasting",
      ],
      primer: {
        best: "MDP Primer",
        mechanism:
          "MDP → ZrO₂ chemical bond. Silane has NO effect on polycrystalline zirconia.",
        conflict: false,
        refs: ["ozcan-2015-mdp", "yang-2010", "kern-2015", "ifu-katana"],
      },
      laser: false,
    },
    cement: {
      pref: [
        {
          t: "MDP-based DC resin cement",
          ex: "Panavia V5, Panavia SA",
          n: "MDP in primer AND cement = optimal",
          dc: "Built into Panavia",
        },
        {
          t: "Self-adhesive RC",
          ex: "Panavia SA, RelyX Unicem 2, SpeedCEM Plus",
          n: "Retentive preps. MDP-based SA (Panavia SA) > non-MDP.",
          cure: "DC",
        },
        {
          t: "RMGI",
          ex: "FujiCEM Evolve, RelyX Luting Plus",
          n: "Highly retentive conventional preps only",
          cure: "Chemical",
        },
      ],
      avoid: ["LC only (too opaque)"],
      special:
        "4Y-TZP has better fracture toughness than 5Y-TZP (UTML) due to retained transformation toughening from tetragonal phase.",
      refs: ["ifu-katana", "ozcan-2015-mdp", "kern-2015"],
    },
    tooth: {
      etch: "Selective enamel (if adhesive cementing). Even with SA: etch enamel margins.",
      adh: [
        {
          s: "Clearfil Universal Bond Quick 2 + Panavia V5",
          ex: "Clearfil UBQ2",
          steps: [
            "Sel etch enamel → rinse → blot",
            "Adhesive scrub 20s → air thin → cure 10s",
            "Seat with Panavia V5",
          ],
          dc: "UBQ2 inherently DC",
        },
        {
          s: "Self-adhesive (retentive preps)",
          ex: "Panavia SA",
          steps: [
            "Optional sel etch enamel margins",
            "Seat with Panavia SA → remove excess → cure margins",
          ],
          dc: "Inherently DC",
        },
      ],
      contam: {
        saliva: "Katana Cleaner or Ivoclean, re-etch tooth if needed",
        tryIn: "Katana Cleaner 20 sec → re-prime MDP",
        blood: "Katana Cleaner → re-prime",
      },
      refs: ["vanmeerbeek-2020", "perdigao-2020"],
    },
  },
  {
    id: "cercon-4d",
    name: "Cercon 4D",
    mfr: "Dentsply Sirona",
    cat: "Multilayered Zirconia (4Y/5Y-TZP)",
    composition:
      "Gradient yttria zirconia — cubic incisally (translucent) → tetragonal cervically (strong)",
    strength: "750–1200 MPa (by layer)",
    indications: ["Crown (all)", "FPD (3+)", "Implant abutment", "Full-arch"],
    notes:
      "Gradient: translucency incisally → strength cervically. High strength = cementation flexibility.",
    surface: {
      etch: {
        m: "No HF",
        d: "Polycrystalline",
        w: "HF ineffective",
        refs: ["ifu-cercon", "kern-2015"],
      },
      abrasion: {
        m: "Al₂O₃ 50 μm · 1.5–2.5 bar · 10–15 sec",
        refs: ["ifu-cercon", "kern-2015"],
      },
      clean: ["Steam", "Ivoclean or Katana Cleaner after try-in"],
      primer: {
        best: "MDP Primer",
        mechanism: "MDP → ZrO₂",
        conflict: false,
        refs: ["ozcan-2015-mdp", "ifu-cercon"],
      },
      laser: false,
    },
    cement: {
      pref: [
        {
          t: "SA resin cement",
          ex: "Calibra Universal, Panavia SA, RelyX Unicem 2",
          n: "Retentive preps",
          cure: "DC",
        },
        {
          t: "DC resin cement",
          ex: "Calibra Ceram, Panavia V5",
          n: "Non-retentive/adhesive",
          dc: "Per system",
        },
        {
          t: "RMGI",
          ex: "FujiCEM Evolve",
          n: "Retentive conventional",
          cure: "Chemical",
        },
      ],
      avoid: ["LC only"],
      special:
        "High strength = conventional cements acceptable on retentive preps.",
      refs: ["ifu-cercon", "kern-2015"],
    },
    tooth: {
      etch: "Selective etch if adhesive cementing",
      adh: [
        {
          s: "SA (most common)",
          ex: "Calibra Universal, Panavia SA",
          steps: [
            "Optional sel etch enamel margins",
            "Prime restoration MDP",
            "Seat with SA cement",
          ],
          dc: "Inherently DC",
        },
      ],
      contam: {
        saliva: "Ivoclean → re-prime",
        tryIn: "Ivoclean → re-prime",
        blood: "Ivoclean → re-prime",
      },
      refs: ["perdigao-2020"],
    },
  },
  {
    id: "ivoclar-zir-prime",
    name: "e.max ZirCAD Prime",
    mfr: "Ivoclar",
    cat: "Zirconia + Fusion Layer (4Y-TZP)",
    composition:
      "4Y-TZP gradient. Esthetic variant: glass-ceramic fusion layer facial/incisal.",
    strength: "650 MPa (body)",
    indications: ["Crown (all)", "FPD (3+)", "Implant crown"],
    notes:
      "UNIQUE: Fusion layer = glass-ceramic esthetics on zirconia core. Requires DUAL treatment: sandblast+MDP (intaglio) AND HF+silane (fusion).",
    surface: {
      etch: {
        m: "Standard: No HF. Esthetic: 5% HF × 20s on fusion layer ONLY",
        d: "Fusion responds like LS₂. Zirconia body does not.",
        w: "IDENTIFY ZONES before treatment",
        refs: ["ifu-zircad", "kern-2015"],
      },
      abrasion: {
        m: "Sandblast intaglio (zirconia): Al₂O₃ 50 μm · 1.5–2 bar",
        refs: ["ifu-zircad"],
      },
      clean: ["Ivoclean 20 sec", "Steam after sandblasting"],
      primer: {
        best: "DUAL: MDP (zirconia) + 2-Bottle Silane (fusion)",
        mechanism: "MDP → ZrO₂ body; Silane → SiO₂ fusion layer",
        conflict: true,
        refs: ["ozcan-2015-mdp", "shen-2004", "ifu-zircad"],
      },
      laser: false,
    },
    cement: {
      pref: [
        {
          t: "DC resin cement",
          ex: "Variolink DC, Multilink Automix",
          n: "Ivoclar: Monobond Plus + Adhese(DC) + Variolink DC",
          dc: "DC activator required",
        },
        {
          t: "SA resin cement",
          ex: "SpeedCEM Plus",
          n: "Retentive preps. Prime first.",
          cure: "DC",
        },
      ],
      avoid: ["LC only", "Conventional ZnPO₄"],
      special:
        "Fusion layer benefits from adhesive cementation to maximize esthetics.",
      refs: ["ifu-zircad", "suh-2003"],
    },
    tooth: {
      etch: "Selective enamel 15–30s",
      adh: [
        {
          s: "Adhese Universal + DC Activator",
          ex: "Adhese Universal",
          steps: [
            "Sel etch → rinse → blot",
            "Mix + DC Activator → scrub 20s → air thin → cure",
            "Seat with Variolink DC",
          ],
          dc: "DC Activator required",
        },
      ],
      contam: {
        saliva: "Ivoclean → re-prime both zones",
        tryIn: "Ivoclean → re-prime",
        blood: "Ivoclean → re-prime",
      },
      refs: ["vanmeerbeek-2020"],
    },
  },
  {
    id: "3m-zirconia",
    name: "Lava Plus / 3M Zirconia",
    mfr: "Solventum (3M)",
    cat: "High-Translucency Zirconia (3Y/5Y-TZP)",
    composition: "Yttria-stabilized ZrO₂, various translucency grades",
    strength: "800–1200 MPa",
    indications: ["Crown", "FPD", "Full-arch", "Implant abutment"],
    notes:
      "3M dental → Solventum. Full range: high-strength opaque → high-translucency.",
    surface: {
      etch: {
        m: "No HF",
        d: "Polycrystalline",
        w: "HF ineffective",
        refs: ["ifu-3mzr", "kern-2015"],
      },
      abrasion: {
        m: "Al₂O₃ 50 μm · 2.0–2.5 bar · 10–15 sec",
        refs: ["ifu-3mzr"],
      },
      clean: ["Steam", "Ivoclean after try-in"],
      primer: {
        best: "MDP Primer",
        mechanism: "MDP → ZrO₂. Scotchbond Universal Plus contains MDP.",
        conflict: false,
        refs: ["ozcan-2015-mdp", "ifu-3mzr"],
      },
      laser: false,
    },
    cement: {
      pref: [
        {
          t: "SA resin cement",
          ex: "RelyX Unicem 2",
          n: "3M: sandblast + primer + RelyX Unicem 2",
          cure: "DC",
        },
        {
          t: "DC resin cement",
          ex: "RelyX Ultimate, Panavia V5",
          n: "Non-retentive",
          dc: "Scotchbond has DC chemistry",
        },
        {
          t: "RMGI",
          ex: "RelyX Luting Plus",
          n: "Retentive conventional",
          cure: "Chemical",
        },
      ],
      avoid: ["LC only"],
      special: "Solventum rebrand — same products.",
      refs: ["ifu-3mzr", "kern-2015"],
    },
    tooth: {
      etch: "Selective enamel",
      adh: [
        {
          s: "Scotchbond Universal Plus",
          ex: "Scotchbond Universal Plus",
          steps: ["Sel etch → rinse → blot", "Scrub 20s → air thin → cure 10s"],
          dc: "Inherently DC",
        },
      ],
      contam: {
        saliva: "Ivoclean → re-prime",
        tryIn: "Ivoclean → re-prime",
        blood: "Ivoclean → re-prime",
      },
      refs: ["perdigao-2020"],
    },
  },
  {
    id: "ti-base",
    name: "Ti-Base Abutments",
    mfr: "Various",
    cat: "Titanium Implant Interface",
    composition: "Grade 4/5 Ti or Ti-6Al-4V — bonded to CAD/CAM suprastructure",
    strength: "N/A (metal)",
    indications: ["Implant crown", "Implant FPD", "Hybrid abutment"],
    notes:
      "Bond failure = catastrophic crown loss. BOTH surfaces must be treated. Clean implant connection before seating.",
    surface: {
      etch: {
        m: "No HF on titanium",
        d: "No role for HF",
        w: "No useful retention",
        refs: ["graf-2022"],
      },
      abrasion: {
        m: "Al₂O₃ 50 μm (or 110 μm) · 2.0–2.5 bar · 15 sec circumferentially",
        refs: ["graf-2022", "ellingsen-2021"],
      },
      clean: [
        "Ultrasonic 70% isopropanol × 3 min",
        "Steam",
        "NO glove contact after cleaning",
        "Prime IMMEDIATELY — TiO₂ reforms rapidly",
      ],
      primer: {
        best: "MDP (Ti-base) + Silane (suprastructure per material)",
        mechanism:
          "MDP → TiO₂. Silane → ceramic/RNC suprastructure. BOTH halves critical.",
        conflict: false,
        refs: ["ozcan-2015-mdp", "graf-2022", "shen-2004"],
      },
      laser: false,
    },
    cement: {
      pref: [
        {
          t: "DC resin cement",
          ex: "Multilink Hybrid Abutment, Panavia V5, RelyX Ultimate",
          n: "Multilink HB purpose-made. Apply to BOTH surfaces.",
          dc: "Multilink HB self-activating",
        },
      ],
      avoid: ["LC only", "RMGI", "SA alone"],
      special:
        "#1 failure: inadequate cleanup in implant connection → micromovement → screw loosening. Use magnification.",
      refs: ["graf-2022", "ellingsen-2021"],
    },
    tooth: {
      etch: "N/A — implant supported",
      adh: [
        {
          s: "Ti-Base + Suprastructure protocol",
          ex: "Multilink Hybrid Abutment",
          steps: [
            "Sandblast Ti chimney 50μm 2.0 bar 15s",
            "Ultrasonic isopropanol 3 min → steam",
            "Prep suprastructure intaglio per material",
            "Prime Ti: MDP primer 60s → air thin",
            "Prime suprastructure: 2-bottle silane or MDP per material → air thin",
            "Apply Multilink HB to BOTH surfaces",
            "Seat under firm pressure",
            "Remove ALL excess esp. implant connection",
            "Light cure 20s accessible + chemical cure ≥5 min",
            "VERIFY connection clean before implant seating",
          ],
          dc: "Chemical cure primary",
        },
      ],
      contam: {
        saliva: "Re-sandblast, re-prime",
        tryIn: "Isopropanol → re-sandblast → re-prime",
        blood: "Re-sandblast, re-prime",
      },
      refs: ["graf-2022"],
    },
  },
  // ── GOLD / NOBLE ALLOY ──
  {
    id: "gold-crown",
    name: "Gold / Noble Alloy Crowns",
    mfr: "Various (Argen, Jensen, etc.)",
    cat: "Gold / Noble Alloy",
    composition:
      "High noble (Au, Pt, Pd) or noble (Ag-Pd) alloys. Cast or CAD/milled.",
    strength: "Yield: 250–350 MPa (type III/IV)",
    indications: [
      "Full crown (post/molar)",
      "Onlay",
      "Inlay",
      "FPD",
      "Implant-supported crown",
    ],
    notes:
      "Proven longevity (30+ yr clinical data). Minimal tooth reduction. Kind to opposing dentition. Bonding requires special VBATDT/MDP primers — conventional cements work on retentive preps.",
    surface: {
      etch: {
        m: "No HF",
        d: "Metal — no acid etching",
        w: "HF has no role",
        refs: [],
      },
      abrasion: {
        m: "Al₂O₃ 50 μm · 2.0–2.5 bar · 10–15 sec (creates micro-roughness + oxide layer)",
        refs: ["ozcan-2004-alloy"],
      },
      clean: [
        "Ultrasonic in acetone or isopropanol",
        "Steam clean",
        "Do not touch fitting surface after cleaning",
      ],
      primer: {
        best: "Alloy Primer (Kuraray) or V-Primer (Sun Medical)",
        mechanism:
          "VBATDT (6-(4-vinylbenzyl-n-propyl)amino-1,3,5-triazine-2,4-dithione) bonds to noble metal surfaces via sulfur-metal interaction. MDP component bonds to base metal oxides. Alloy Primer contains BOTH VBATDT + MDP = universal metal primer.",
        conflict: false,
        refs: ["ozcan-2004-alloy", "matsumura-2003"],
      },
      laser: false,
    },
    cement: {
      pref: [
        {
          t: "Conventional: ZnPO₄ or GI",
          ex: "Fleck's ZnPO₄, Ketac Cem, FujiCEM",
          n: "Retentive preps — decades of clinical success",
          cure: "Chemical",
        },
        {
          t: "RMGI",
          ex: "RelyX Luting Plus, FujiCEM Evolve",
          n: "Retentive preps with fluoride benefit",
          cure: "Chemical + optional LC",
        },
        {
          t: "Resin cement (adhesive)",
          ex: "Panavia V5, RelyX Ultimate",
          n: "Non-retentive or short preps. REQUIRES Alloy Primer + tooth adhesive.",
          dc: "Standard DC protocol",
        },
      ],
      avoid: [
        "Resin cement without Alloy Primer (no bond to noble metals without VBATDT)",
      ],
      special:
        "For retentive preps: ZnPO₄ or RMGI is perfectly adequate and time-tested. Reserve adhesive cementation with Alloy Primer for short/non-retentive preps.",
      refs: ["ozcan-2004-alloy", "matsumura-2003"],
    },
    tooth: {
      etch: "Retentive preps: no etch needed (conventional cement). Non-retentive: selective enamel etch + adhesive.",
      adh: [
        {
          s: "Conventional cementation (retentive preps)",
          ex: "Fleck's ZnPO₄, Ketac Cem, FujiCEM Evolve",
          steps: [
            "Sandblast intaglio 50μm",
            "Clean fitting surface",
            "Mix cement per IFU",
            "Seat with firm pressure → hold",
            "Remove excess after initial set",
          ],
          dc: "N/A — chemical set",
        },
        {
          s: "Adhesive cementation (non-retentive)",
          ex: "Alloy Primer + Panavia V5",
          steps: [
            "Sandblast intaglio 50μm → clean",
            "Apply Alloy Primer (VBATDT+MDP) → 60 sec → air thin",
            "Sel etch enamel → adhesive on tooth (Clearfil UBQ2 or OptiBond FL)",
            "Seat with Panavia V5 → cure → oxyguard",
          ],
          dc: "Standard DC",
        },
      ],
      contam: {
        saliva: "Re-clean, re-prime if adhesive",
        tryIn: "Isopropanol clean → re-sandblast if possible",
        blood: "Clean thoroughly → re-prime",
      },
      refs: ["ozcan-2004-alloy", "matsumura-2003"],
    },
  },
];

// Cements, Composites, Bonding Agents — carried forward from v4 with tightened language
// (keeping same data structure but referencing the ReadMore component for rationale)

const CEMENTS = [
  {
    id: "panavia-sa",
    name: "Panavia SA Cement Universal",
    mfr: "Kuraray",
    cat: "Self-Adhesive Resin Cement",
    cureType: "Dual-cure",
    composition: "MDP-containing SA resin cement. 10-MDP → zirconia/metal.",
    strength: "Film: 22 μm",
    indications: ["Zirconia", "Metal/PFM", "Fiber posts", "Inlays (retentive)"],
    notes:
      "MDP = best SA cement for zirconia. No tooth adhesive needed. Sel etch enamel STILL recommended.",
    steps: [
      "Clean restoration: sandblast + primer (MDP for Zr, silane for glass-ceramic)",
      "Sel etch enamel margins 15s → rinse → blot (recommended)",
      "Apply to restoration intaglio",
      "Seat firmly",
      "Tack cure 2–3s/margin → gel cleanup",
      "Full cure 20s/surface. Self-cure 4–5 min where light can't reach",
    ],
    workTime: "2:30",
    setTime: "4:30 SC / 20s LC",
    cleanup: "Gel phase cleanup. Much easier than full set.",
    compat: {
      excellent: ["Zirconia (MDP bond)", "Metal/PFM", "Fiber posts"],
      good: ["RNC (with primer)"],
      avoid: ["Veneers", "Empress/leucite"],
    },
    adhesiveNeeded: "NO tooth adhesive. Sel etch enamel recommended.",
    restorationPrep:
      "ALWAYS prime restoration. Self-adhesive = tooth side only.",
    dcNote: "Inherently DC. No activator.",
    special:
      "Gold-standard SA for zirconia due to MDP. For glass-ceramics, adhesive cementation still outperforms.",
    refs: ["ozcan-2015-mdp", "kern-2015"],
  },
  {
    id: "variolink-dc",
    name: "Variolink Esthetic DC",
    mfr: "Ivoclar",
    cat: "Dual-Cure Adhesive Resin Cement",
    cureType: "Dual-cure",
    composition: "Bis-GMA/UDMA DC cement. No MDP. Requires tooth adhesive.",
    strength: "Film: 28 μm",
    indications: ["LS₂ crowns/FPDs", "Glass-ceramics", "PICN", "RNC crowns"],
    notes: "Ivoclar system. Shade-matched (Warm/Neutral/Cool).",
    steps: [
      "Prep restoration: HF or sandblast → 2-bottle silane → air thin",
      "Prep tooth: sel etch → Adhese Universal + DC ACTIVATOR 1:1 → scrub 20s → cure",
      "⚠ DC ACTIVATOR MANDATORY or cement WON'T self-cure",
      "Apply to restoration intaglio → seat → tack cure → gel cleanup",
      "Full cure 20s/surface",
      "Liquid Strip on margins → final cure",
    ],
    workTime: "3:00",
    setTime: "6:00 SC / 20s LC",
    cleanup: "Tack cure → gel cleanup → Liquid Strip (glycerin) on margins.",
    compat: {
      excellent: ["LS₂", "Leucite", "PICN"],
      good: ["RNC", "Zirconia (with MDP primer)"],
      avoid: ["Without DC activator", "Without tooth adhesive"],
    },
    adhesiveNeeded: "YES. Adhese Universal + DC Activator, or OptiBond FL.",
    restorationPrep:
      "HF + 2-bottle silane (glass-ceramic). Sandblast + silane (RNC). MDP (Zr).",
    dcNote:
      "⚠ Adhese Universal MUST mix with DC Activator 1:1. #1 failure with this system. OptiBond FL inherently DC.",
    special:
      "Evidence supports 2-bottle silane over Monobond Plus for long-term bond.",
    refs: ["ifu-emax", "suh-2003"],
  },
  {
    id: "nx3-lc",
    name: "NX3 Nexus LC",
    mfr: "Kerr",
    cat: "Light-Cure Resin Cement",
    cureType: "Light-cure only",
    composition: "Bis-GMA/TEGDMA LC cement. No chemical cure.",
    strength: "Film: 15 μm (thinnest)",
    indications: ["Porcelain veneers", "Thin inlays (<1.5mm)"],
    notes:
      "LC only = unlimited working time. Best for veneers. NOT for crowns >1.5mm. Best color stability (no amine yellowing).",
    steps: [
      "HF etch + 2-bottle silane → air thin",
      "Tooth: sel etch + OptiBond FL",
      "Apply thin layer to restoration intaglio",
      "Seat gently",
      "UNLIMITED time to verify position/margins",
      "Remove ALL excess before curing",
      "Cure 40s facial, 20s lingual, 20s each proximal",
      "Glycerin on margins → final cure 10s",
    ],
    workTime: "Unlimited",
    setTime: "40s LC. NO self-cure.",
    cleanup: "Pre-cure cleanup — major advantage.",
    compat: {
      excellent: ["Porcelain veneers", "Thin LS₂ veneers"],
      good: ["Thin PICN/RNC"],
      avoid: ["Full crowns", "Opaque (Zr/PFM)", ">1.5mm"],
    },
    adhesiveNeeded: "YES. LC adhesive fine.",
    restorationPrep: "HF + 2-bottle silane.",
    dcNote: "NO self-cure. If light can't reach it → stays uncured.",
    special:
      "Gold standard veneer cement. OptiBond FL + NX3 LC = best veneer protocol.",
    refs: [],
  },
  {
    id: "relyx-unicem",
    name: "RelyX Unicem 2",
    mfr: "Solventum (3M)",
    cat: "Self-Adhesive Resin Cement",
    cureType: "Dual-cure",
    composition: "Phosphoric acid methacrylate SA. No MDP.",
    strength: "Film: 20 μm",
    indications: ["Metal/PFM", "Zirconia (retentive)", "Fiber posts"],
    notes:
      "Workhorse SA. No MDP — inferior to Panavia SA for zirconia. OK for retentive preps.",
    steps: [
      "Sandblast + primer per material",
      "Optional sel etch enamel margins",
      "Apply to intaglio → seat firmly 3+ min",
      "Remove excess → cure 20s/surface",
    ],
    workTime: "2:00",
    setTime: "6:00 SC / 20s LC",
    cleanup: "Remove gross excess before/after tack.",
    compat: {
      excellent: ["Metal/PFM", "Fiber posts"],
      good: ["Zirconia retentive (Panavia SA better)"],
      avoid: ["Veneers", "Non-retentive preps"],
    },
    adhesiveNeeded: "NO. Sel etch improves seal.",
    restorationPrep: "Always prime. MDP for Zr, silane for glass-ceramic.",
    dcNote: "Inherently DC.",
    special:
      "No MDP = relies on prep retention. Panavia SA outperforms on zirconia.",
    refs: ["monticelli-2006"],
  },
  {
    id: "multilink-hb",
    name: "Multilink Hybrid Abutment",
    mfr: "Ivoclar",
    cat: "Hybrid Abutment Resin Cement",
    cureType: "DC (chemical dominant)",
    composition:
      "Dimethacrylate cement for Ti-base bonding. Chemical cure dominant.",
    strength: "Ti-ceramic optimized",
    indications: ["Ti-base → zirconia", "Ti-base → LS₂", "Ti-base → RNC"],
    notes:
      "PURPOSE-BUILT for ti-base. Chemical cure dominant (light can't reach Ti interface). BOTH surfaces primed.",
    steps: [
      "Sandblast Ti chimney 50μm 2.0 bar 15s",
      "Ultrasonic isopropanol 3 min → steam",
      "Prep suprastructure per material",
      "Prime Ti: Monobond Plus (MDP) 60s → air thin",
      "Prime suprastructure per material",
      "Apply to BOTH surfaces",
      "Seat firmly",
      "Remove ALL excess — esp. implant connection",
      "Cure accessible 20s + chemical ≥5 min",
      "VERIFY connection clean",
    ],
    workTime: "3:30",
    setTime: "5:00 SC + LC boost",
    cleanup: "METICULOUS connection cleanup. Loupes/microscope.",
    compat: {
      excellent: ["Ti → Zr", "Ti → LS₂", "Ti → RNC"],
      good: [],
      avoid: ["General cementation", "Direct crown on teeth"],
    },
    adhesiveNeeded: "MDP on Ti. Appropriate primer on suprastructure.",
    restorationPrep: "BOTH surfaces.",
    dcNote: "Chemical primary. Light supplementary.",
    special:
      "#1 failure: residual cement in connection → screw loosening. Magnification. Verify twice.",
    refs: ["graf-2022", "ellingsen-2021"],
  },
  {
    id: "relyx-luting",
    name: "RelyX Luting Plus",
    mfr: "Solventum (3M)",
    cat: "Resin-Modified Glass Ionomer (RMGI)",
    cureType: "GI + optional LC",
    composition: "Fluoroaluminosilicate glass + HEMA. Fluoride release.",
    strength: "Compressive: ~140 MPa",
    indications: [
      "PFM/Metal crowns (retentive)",
      "Zirconia (highly retentive)",
      "Pediatric",
      "Fluoride needed",
    ],
    notes:
      "NOT resin cement. Bonds via acid-base + HEMA. Fluoride. Moisture tolerant. Inferior bond to resin cements.",
    steps: [
      "Clean/dry tooth (moisture tolerant but excess water reduces bond)",
      "No etch or adhesive needed",
      "Mix capsule per IFU",
      "Apply to intaglio → seat",
      "Initial set ~3 min → remove excess",
      "Optional: cure margins 20s",
      "PROTECT from moisture 10 min",
    ],
    workTime: "2:30",
    setTime: "4:30 initial. 24 hr maturation.",
    cleanup:
      "After initial set. Easier than resin. Protect from early moisture.",
    compat: {
      excellent: ["Metal retentive", "PFM retentive"],
      good: ["Zirconia highly retentive", "SS crowns"],
      avoid: ["Veneers", "Non-retentive", "Bonded ceramics", "RNC/PICN"],
    },
    adhesiveNeeded: "NO. Direct acid-base bond.",
    restorationPrep: "Minimal. Sandblast recommended.",
    dcNote: "GI acid-base + resin LC. Light optional.",
    special:
      "Use when: retentive prep + fluoride + challenging moisture. Early moisture = #1 failure.",
    refs: [],
  },
  {
    id: "panavia-v5",
    name: "Panavia V5",
    mfr: "Kuraray",
    cat: "Dual-Cure Adhesive Resin Cement",
    cureType: "Dual-cure",
    composition:
      "MDP-containing DC adhesive cement. Bonds to Zr, metal, AND tooth.",
    strength: "Film: 20 μm",
    indications: [
      "Zirconia (adhesive)",
      "LS₂",
      "All-ceramic",
      "RNC",
      "Metal",
      "Posts",
    ],
    notes:
      "MDP → bonds everything. Most complete adhesive system with Clearfil UBQ2 (inherently DC).",
    steps: [
      "Prep restoration: primer (Clearfil Ceramic Primer Plus or 2-bottle silane) → air thin",
      "Sel etch enamel 15–30s → rinse → blot",
      "Clearfil UBQ2: scrub 20s → air thin → cure 10s",
      "⚠ UBQ2 inherently DC — NO activator needed",
      "Apply Panavia V5 to intaglio → seat",
      "Tack cure 3s/margin → gel cleanup",
      "Full cure 20s/surface",
      "Oxyguard on margins × 3 min → remove → polish",
    ],
    workTime: "2:30",
    setTime: "5:00 SC / 20s LC",
    cleanup: "Gel cleanup → cure → oxyguard for marginal integrity.",
    compat: {
      excellent: ["Zirconia (MDP)", "Metal/PFM", "LS₂", "RNC"],
      good: ["PICN", "Posts", "Leucite"],
      avoid: ["Veneers (use NX3 LC for working time)"],
    },
    adhesiveNeeded:
      "YES. Clearfil UBQ2 (inherently DC) or any DC-compatible adhesive.",
    restorationPrep: "Clearfil Ceramic Primer Plus or 2-bottle silane + MDP.",
    dcNote:
      "UBQ2 inherently DC — MAJOR advantage (no activator, no risk of forgetting).",
    special:
      "Most streamlined adhesive system: MDP + inherent DC + oxyguard. Evidence strongly supports for zirconia.",
    refs: ["ozcan-2015-mdp", "yang-2010", "kern-2015"],
  },
  {
    id: "apx-heated",
    name: "Clearfil APX (Heated)",
    mfr: "Kuraray",
    cat: "Heated Packable Composite (Off-Label Luting)",
    cureType: "Light-cure only (heated)",
    composition:
      "85 wt% filled Bis-GMA/TEGDMA packable. Heated 55–68°C → flows like flowable.",
    strength: "Flex: 149 MPa. Wear > cements.",
    indications: [
      "Well-fitting inlays/onlays",
      "RNC restorations",
      "Marginal wear priority",
    ],
    notes:
      "Off-label luting. At 55–68°C flows like flowable, sets with packable properties. Higher filler = better marginal wear. ~90 sec working window.",
    steps: [
      "Pre-heat Calset to 55–68°C (10+ min)",
      "Prep restoration + tooth per standard protocol",
      "Warm compule 2–3 min at temp",
      "Remove — ~90 sec of flow",
      "Express into intaglio (NOT tooth)",
      "IMMEDIATELY seat — viscosity increases fast",
      "Remove excess while warm",
      "Cure 40s facial, 20s lingual, 20s proximal",
      "Polish margins",
    ],
    workTime: "~90 sec from warmer",
    setTime: "40s LC. No self-cure.",
    cleanup:
      "Remove while warm. After cooling = set composite. Margins are polishable.",
    compat: {
      excellent: [
        "Well-fitting RNC inlays/onlays",
        "Thin glass-ceramic inlays",
      ],
      good: ["PICN"],
      avoid: ["Full crowns (no light)", "Opaque (Zr/PFM)", "Poor fit", ">2mm"],
    },
    adhesiveNeeded: "YES. Standard adhesive protocol.",
    restorationPrep: "Standard per material.",
    dcNote: "LC ONLY. Must transmit light.",
    special:
      "Growing evidence. Superior marginal wear, polishable margins. Narrow window from warmer.",
    refs: ["daronch-2005", "lohbauer-2009"],
  },
];

const COMPOSITES = [
  {
    id: "everx-flow",
    name: "EverX Flow",
    mfr: "GC",
    cat: "Fiber-Reinforced Flowable Composite",
    composition: "Short E-glass fiber + barium glass in Bis-GMA/TEGDMA",
    strength: "Fracture toughness: 2.6 MPa·m^½ (2–3× conventional)",
    indications: [
      "Core build-up base",
      "IDS resin coat",
      "DME base layer",
      "Post/core foundation",
      "Cusp replacement sub",
    ],
    notes:
      "NOT a final restorative — fiber sub covered by conventional composite. 'Rebar for your restoration.'",
    steps: [
      "Apply adhesive per protocol",
      "Dispense EverX Flow in ≤2mm increments as BASE",
      "Adapt with instrument",
      "Cure 20s/2mm (≥800 mW/cm²)",
      "Build to within 1–2mm of final contour",
      "Cover with conventional composite for anatomy + polish",
    ],
    layering:
      "Base: EverX Flow (fracture resistance) → Top: conventional composite (anatomy/polish)",
    cureTime: "20s/2mm. Bulk to 4mm with high-intensity.",
    ids: "Excellent IDS coat: ~0.5mm over bonded dentin → cure. Fiber layer protects sealed dentin during prep refinement.",
    dme: "DME base: build deep margin supra with EverX → cure → refine margin through resin.",
    apa: APA_INTRAORAL.ids,
    special:
      "E-glass fibers distribute crack energy. No other flowable provides this. NOT for final occlusal surface.",
    refs: [],
  },
  {
    id: "filtek-em-flow",
    name: "Filtek Easy Match Flowable",
    mfr: "Solventum (3M)",
    cat: "Universal Flowable Composite",
    composition: "Bis-GMA/UDMA + AFM technology nano-ceramic",
    strength: "Flex: ~120 MPa",
    indications: [
      "Liner",
      "IDS coat",
      "Small Class V",
      "Sealant-restorations",
      "Thin DME",
    ],
    notes: "Simplified shade system. Standard flowable — not fiber-reinforced.",
    steps: [
      "Apply adhesive",
      "Dispense 0.5–1mm liner → adapt → cure 20s",
      "Cover with packable for load-bearing",
    ],
    layering:
      "Liner 0.5–1mm under packable. Standalone for small non-load-bearing.",
    cureTime: "20s/2mm",
    ids: "Thin IDS coat (~0.5mm). EverX preferred when structural reinforcement matters.",
    dme: "Thin DME layers. EverX preferred for thick DME.",
    apa: APA_INTRAORAL.ids,
    special: "Solid workhorse. Simplified shades. Less structural than EverX.",
    refs: [],
  },
  {
    id: "filtek-em-pack",
    name: "Filtek Easy Match Packable",
    mfr: "Solventum (3M)",
    cat: "Packable/Universal Composite",
    composition: "Bis-GMA/UDMA + AFM + nano-ceramic/silica/zirconia",
    strength: "Flex: ~150 MPa",
    indications: [
      "Direct posterior",
      "Direct anterior",
      "Core build-up",
      "Cusp replacement",
    ],
    notes: "Simplified shade matching. Good sculptability, low stickiness.",
    steps: [
      "Adhesive + flowable liner",
      "Place in 2mm increments",
      "Sculpt → cure 20s/2mm",
      "Finish + polish",
    ],
    layering:
      "Over flowable liner for adaptation. Oblique layering for large restorations.",
    cureTime: "20s/2mm",
    ids: "N/A — use flowable for IDS.",
    dme: "Body over DME base.",
    apa: "",
    special: "Pairs with Filtek EM Flowable as liner-to-body system.",
    refs: [],
  },
  {
    id: "majesty-es-flow",
    name: "Clearfil Majesty ES Flow",
    mfr: "Kuraray",
    cat: "Universal Flowable Composite",
    composition: "Bis-GMA/TEGDMA + 75 wt% filler (HIGH for flowable)",
    strength: "Flex: ~130 MPa (high for flowable)",
    indications: [
      "IDS coat (excellent)",
      "Liner",
      "Small restorations",
      "Thin DME",
      "Margin seal",
    ],
    notes:
      "75 wt% filler = bridges flowable/packable gap. Less shrinkage than typical flowables. Excellent polish.",
    steps: [
      "Apply adhesive (Clearfil SE Bond 2 or UBQ2)",
      "Dispense 0.5–1.5mm → self-levels → cure 20s",
      "Polish with Sof-Lex — high gloss",
    ],
    layering: "Liner/IDS under packable. Standalone for small restorations.",
    cureTime: "20s/2mm",
    ids: "Excellent IDS material: high filler = less shrinkage stress on sealed dentin. Apply 0.5mm → cure.",
    dme: "Good for thin DME where polishability of margin matters.",
    apa: APA_INTRAORAL.ids,
    special:
      "75 wt% filler bridges flowable/packable. Less shrinkage than typical flowables. Strong IDS choice.",
    refs: [],
  },
  {
    id: "clearfil-apx",
    name: "Clearfil APX",
    mfr: "Kuraray",
    cat: "Packable/Universal Composite",
    composition: "85 wt% barium glass/SiO₂ in Bis-GMA/TEGDMA",
    strength: "Flex: 149 MPa. Top-tier wear resistance.",
    indications: [
      "Direct posterior",
      "Core build-up",
      "Cusp replacement",
      "Heated luting (55–68°C)",
    ],
    notes:
      "85 wt% filler = best wear resistance. Dense handling — flowable liner recommended. Also used heated as luting (see Cements).",
    steps: [
      "Adhesive + flowable liner (recommended)",
      "APX in 2mm oblique increments — firm condensation",
      "Cure 20s/2mm",
      "Finish with fine diamonds → polish",
    ],
    layering: "Flowable liner → APX body increments → polish.",
    cureTime: "20s/2mm",
    ids: "Too viscous for IDS coat. Use flowable.",
    dme: "Body over DME base but flowable preferred at margin.",
    apa: "",
    special:
      "85 wt% = most wear-resistant direct composite. When heated to 55–68°C → off-label luting (see Cements).",
    refs: ["daronch-2005", "lohbauer-2009"],
  },
  {
    id: "filtek-z250",
    name: "Filtek Z250",
    mfr: "Solventum (3M)",
    cat: "Packable/Universal Composite",
    composition: "Bis-GMA/UDMA + zirconia/silica (82 wt%). Microhybrid.",
    strength: "Flex: 160 MPa",
    indications: ["Direct posterior", "Core build-up", "Large stress-bearing"],
    notes:
      "Decades of clinical validation. Not newest but among most proven. Microhybrid finish good but not nano-gloss.",
    steps: [
      "Adhesive + optional liner",
      "Z250 in 2mm increments → cure 20s",
      "Finish and polish",
    ],
    layering: "Standard incremental. Flowable liner in deep boxes.",
    cureTime: "20s/2mm",
    ids: "N/A.",
    dme: "Body build-up over base.",
    apa: "",
    special:
      "Clinical validation is Z250's strongest argument — decades of peer-reviewed data.",
    refs: [],
  },
  {
    id: "filtek-supreme",
    name: "Filtek Supreme Ultra",
    mfr: "Solventum (3M)",
    cat: "Packable/Universal Composite",
    composition:
      "Bis-GMA/UDMA + nano-cluster/nano-filler (78.5 wt%). Nanofilled.",
    strength: "Flex: 155 MPa",
    indications: [
      "Anterior (III, IV, V)",
      "Posterior",
      "Veneer repairs",
      "Diastema closures",
    ],
    notes:
      "Nanofiller = superior polish + gloss retention vs microhybrid. Extensive shade system for polychromatic layering.",
    steps: [
      "Adhesive + liner if needed",
      "Shade layering: dentin → body → enamel in increments",
      "Cure 20s/2mm",
      "Multi-step polish to high gloss",
    ],
    layering:
      "Polychromatic: dentin (deep) → body → enamel (superficial) for natural depth.",
    cureTime: "20s/2mm",
    ids: "N/A.",
    dme: "Esthetic zone if margin visible.",
    apa: "",
    special:
      "Superior polish retention. Extensive shades for polychromatic layering. Go-to when esthetics > raw strength.",
    refs: [],
  },
  {
    id: "one-bulk",
    name: "3M One Bulk Fill",
    mfr: "Solventum (3M)",
    cat: "Bulk Fill Composite",
    composition:
      "AUDMA/AFM + ternary initiator. Single shade, self-matching. 4mm+ depth.",
    strength: "Flex: ~140 MPa",
    indications: [
      "Posterior Class I/II",
      "Core build-up",
      "Efficiency priority",
    ],
    notes:
      "One shade fits most. 4mm cure depth. Significant time savings. Not for critical anterior esthetics.",
    steps: [
      "Adhesive per protocol",
      "Place in single increment ≤4mm",
      "Adapt to walls → verify margins",
      "Cure 20s from occlusal (≥800 mW/cm²)",
      "For >4mm: two increments",
      "Finish + polish — shade blends after polish",
    ],
    layering: "SINGLE INCREMENT ≤4mm. No liner needed per IFU.",
    cureTime: "20s/4mm ≥800 mW/cm². 40s if lower intensity.",
    ids: "N/A.",
    dme: "Possible if sufficient depth. Standard DME preferred.",
    apa: "",
    special:
      "Single shade + single increment + 20s cure = dramatically faster posterior work. Shade matching genuinely works.",
    refs: [],
  },
  {
    id: "dc-core-plus",
    name: "DC Core Plus",
    mfr: "Kuraray",
    cat: "Dual-Cure Core Build-Up",
    composition: "DC core composite. Paste-paste automix. Fluoride.",
    strength: "Flex: ~130 MPa. Comp: ~300 MPa.",
    indications: [
      "Post/core",
      "Large core build-ups",
      "Foundations under crowns",
    ],
    notes:
      "DUAL-CURE = chemical self-cure + LC boost. Critical when deepest portions get no light. Uses Clearfil adhesive system.",
    steps: [
      "Place post if applicable",
      "Apply Clearfil SE Bond 2 or UBQ2",
      "⚠ SE Bond 2 needs DC Activator; UBQ2 is inherently DC",
      "Dispense DC Core Plus into preparation",
      "Build up (chemical cure handles depth)",
      "Cure accessible surfaces 20s",
      "Chemical cure 4–5 min for deep areas",
      "Prep core for crown as natural tooth",
    ],
    layering: "Bulk acceptable (DC handles depth). Cure all accessible.",
    cureTime: "20s LC/surface. SC: 4–5 min. Full: 24 hr.",
    ids: "N/A.",
    dme: "Large post/core + DME combo if needed.",
    apa: APA_INTRAORAL.core,
    special:
      "DC guarantees polymerization at depth. Fluoride release under crown margins. Automix = consistent ratio.",
    refs: [],
  },
];

const BONDING_AGENTS = [
  {
    id: "optibond-fl",
    name: "OptiBond FL",
    mfr: "Kerr",
    cat: "Total-Etch 3-Step Adhesive",
    gen: "4th gen (etch → primer → bond)",
    composition: "Filled adhesive (48 wt% barium glass). HEMA/GPDM primer.",
    strength: "Enamel: ~45 MPa. Dentin: ~30 MPa.",
    indications: [
      "Veneer cementation (gold standard)",
      "All adhesive ceramic",
      "Direct composites",
      "Max bond situations",
    ],
    notes:
      "THE gold standard. Decades of validation. Filled adhesive = stress-absorbing elastic layer. Inherently DC.",
    steps: [
      "ISOLATE: Rubber dam preferred. Isolite acceptable for posterior.",
      "Etch: 37% H₃PO₄ — enamel 15–30s, dentin 10–15s",
      "Rinse thoroughly ≥15s",
      "Blot dry — dentin MOIST (shiny, not pooled, not desiccated)",
      "Primer (bottle 1): scrub 15s → air dry gently 5s",
      "Adhesive (bottle 2): apply → air thin → cure 20s",
      "Verify: glossy, uniform coat",
    ],
    etchProtocol:
      "TOTAL ETCH. H₃PO₄ both enamel + dentin. Enamel 15–30s, dentin 10–15s (shorter = don't over-etch collagen).",
    moisture:
      "WET BONDING: Leave dentin 'shiny wet' after rinse. Over-drying collapses collagen → dramatically reduced bond.",
    dcCompat:
      "✅ INHERENTLY DC. No activator. Works with ANY DC cement without modification.",
    layers:
      "3 steps: Etch → Prime (unfilled) → Bond (FILLED, 50–100 μm). Thickest hybrid layer of any adhesive.",
    isolation:
      "Rubber dam strongly recommended for OptiBond FL due to wet bonding technique sensitivity. Isolite acceptable for routine posterior.",
    wavelength: CURE_INFO.standard,
    antibacterial: false,
    special:
      "Why it's still gold standard: (1) Filled adhesive = thickest, most durable hybrid layer. (2) Inherently DC — no activator hassle. (3) Decades of validation. (4) Highest mean bond in meta-analyses. Trade-off: 3 steps, technique-sensitive moisture.",
    refs: ["peumans-2012", "perdigao-2020"],
  },
  {
    id: "clearfil-se2",
    name: "Clearfil SE Bond 2",
    mfr: "Kuraray",
    cat: "Self-Etch 2-Step Adhesive",
    gen: "6th gen (SE primer → bond)",
    composition:
      "10-MDP + HEMA primer. Bis-GMA/HEMA/MDP bond. MDP nanolayer → hydroxyapatite.",
    strength: "Enamel: ~35 MPa (with sel etch). Dentin: ~28 MPa.",
    indications: [
      "Direct composites",
      "IDS",
      "Core build-ups",
      "Indirect cementation (with DC activator)",
    ],
    notes:
      "MDP → stable nanolayer bond to HA. Most studied SE adhesive. Mild pH ~2.0.",
    steps: [
      "ISOLATE: Rubber dam or Isolite.",
      "Optional: sel etch enamel 10–15s → rinse → blot",
      "Primer: active scrub 20s — agitation critical",
      "Air dry gently 5s (glossy, not wet)",
      "Bond: thin coat → air thin → cure 10s",
    ],
    etchProtocol:
      "SELF-ETCH dentin. SELECTIVE ETCH enamel recommended: H₃PO₄ 10–15s on intact/uncut enamel.",
    moisture:
      "Less technique-sensitive. No wet bonding needed. Self-etch simultaneously etches + primes.",
    dcCompat:
      "⚠ NOT inherently DC. For DC cements/DC Core Plus: add DC Activator to primer (1 drop each).",
    layers: "2 steps: SE Primer → Bond.",
    isolation:
      "Rubber dam or Isolite. Less moisture-sensitive than total-etch.",
    wavelength: CURE_INFO.standard,
    antibacterial: false,
    special:
      "MDP-calcium nanolayer = exceptionally stable over time (10+ yr data). With sel etch, approaches OptiBond FL. Less technique-sensitive. For IDS: preferred because SE doesn't over-etch exposed dentin.",
    refs: ["perdigao-2020", "vanmeerbeek-2020"],
  },
  {
    id: "clearfil-se-protect",
    name: "Clearfil SE Protect",
    mfr: "Kuraray",
    cat: "Self-Etch 2-Step Adhesive",
    gen: "6th gen + antibacterial + fluoride",
    composition:
      "MDP + MDPB (antibacterial monomer) primer. Bond with NaF filler. MDPB polymerizes INTO adhesive = permanent contact-kill.",
    strength: "Enamel: ~33 MPa. Dentin: ~26 MPa.",
    indications: [
      "High caries-risk",
      "Deep dentin near pulp",
      "Poor oral hygiene",
      "IDS in caries-prone",
      "Decontamination after try-in",
    ],
    notes:
      "MDPB = permanent antibacterial at interface. Not leaching — contact-kill lasting life of restoration. Plus fluoride from NaF.",
    steps: [
      "Same as SE Bond 2:",
      "Optional sel etch enamel 10–15s",
      "Primer (contains MDPB): active scrub 20s — simultaneously etching, priming, AND disinfecting",
      "Air dry 5s",
      "Bond → air thin → cure 10s",
      "Also: use as DECONTAMINANT after try-in (scrub primer as quaternary ammonium agent)",
    ],
    etchProtocol:
      "Self-etch dentin. Optional sel etch enamel. Same as SE Bond 2.",
    moisture: "Same as SE Bond 2. Less sensitive than total-etch.",
    dcCompat: "⚠ NOT inherently DC. Same: add DC Activator for DC cements.",
    layers:
      "2 steps: Antibacterial SE Primer (MDPB+MDP) → Fluoride-releasing Bond.",
    isolation:
      "Rubber dam or Isolite. Less moisture-sensitive than total-etch.",
    wavelength: CURE_INFO.standard,
    antibacterial: true,
    special:
      "Use primer as decontaminant: after try-in paste/saliva, scrub SE Protect primer on prep → air dry → proceed. MDPB kills bacteria + becomes permanent part of adhesive. Reduced secondary caries at margins. Trade-off: slightly lower bond than SE Bond 2 due to MDPB volume.",
    refs: ["imazato-2010"],
  },
  {
    id: "clearfil-ubq2",
    name: "Clearfil Universal Bond Quick 2",
    mfr: "Kuraray",
    cat: "Universal Adhesive",
    gen: "8th gen (all etch modes)",
    composition:
      "10-MDP + Bis-GMA + HEMA + hydrophilic amide. Single bottle. MDP → tooth/Zr/metal.",
    strength: "Enamel: ~35 MPa (sel etch). Dentin: ~25 MPa.",
    indications: [
      "All direct",
      "All indirect",
      "IDS",
      "Core build-ups",
      "Zirconia (MDP)",
      "Metal (MDP)",
      "Universal",
    ],
    notes:
      "Most versatile in Kuraray system. MDP = bonds everything. INHERENTLY DC — no activator. Major workflow advantage.",
    steps: [
      "ISOLATE: Rubber dam or Isolite.",
      "Mode: SELECTIVE ETCH recommended (best balance)",
      "Sel etch enamel 10–15s → rinse → blot",
      "Apply ONE coat, active scrub 20s",
      "Air dry 5s — thin uniform film",
      "Cure 10s (≥800 mW/cm²)",
      "Single coat sufficient — do NOT multi-coat",
    ],
    etchProtocol:
      "VERSATILE: Self-etch, selective etch, or total-etch. Selective etch = best balance.",
    moisture: "Moderate sensitivity. Selective etch mode most forgiving.",
    dcCompat:
      "✅ INHERENTLY DC. No activator. Works with Panavia V5, DC Core Plus, any DC cement. #1 advantage over Adhese Universal.",
    layers: "1 step: Single-bottle universal.",
    isolation: "Rubber dam or Isolite. Selective etch mode tolerant.",
    wavelength: CURE_INFO.standard,
    antibacterial: false,
    special:
      "Single bottle bonds to tooth (HA) + zirconia (ZrO₂) + metal (oxide) + serves as tooth-side adhesive for Panavia V5 — no extra primers or activators. Most streamlined system available.",
    refs: ["perdigao-2020", "vanmeerbeek-2020"],
  },
  {
    id: "scotchbond-univ",
    name: "Scotchbond Universal Plus",
    mfr: "Solventum (3M)",
    cat: "Universal Adhesive",
    gen: "8th gen (all modes)",
    composition:
      "10-MDP + Bis-GMA + HEMA + silane + Vitrebond copolymer. Single bottle. MDP + silane = bonds tooth/Zr/metal/glass-ceramic.",
    strength: "Enamel: ~35 MPa. Dentin: ~24 MPa.",
    indications: [
      "All direct",
      "All indirect",
      "IDS",
      "Zirconia",
      "Glass-ceramic (contains silane)",
      "Metal",
      "Repair bonding",
    ],
    notes:
      "MDP + silane + Vitrebond = most multi-functional single-bottle adhesive. Contains silane for ceramic bonding (but 2-bottle still preferred long-term).",
    steps: [
      "ISOLATE: Rubber dam or Isolite.",
      "Selective etch recommended",
      "Sel etch enamel 10–15s → rinse → blot",
      "Apply ONE coat, scrub 20s",
      "Air dry 5s — thin film",
      "Cure 10s",
      "For ceramic: serves as primer + adhesive (but 2-bottle silane better long-term)",
    ],
    etchProtocol: "Universal. Selective etch recommended.",
    moisture: "Moderate. Selective etch most forgiving.",
    dcCompat:
      "✅ INHERENTLY DC. Contains DC chemistry. Works with RelyX Ultimate, all 3M cements.",
    layers: "1 step: Single-bottle with MDP + silane.",
    isolation: "Rubber dam or Isolite.",
    wavelength: CURE_INFO.standard,
    antibacterial: false,
    special:
      "Built-in silane = convenience but pre-hydrolyzed → degrades over time. For routine bonding: one-bottle-does-everything is significant. For long-term critical ceramic bonds: supplement with 2-bottle silane. Vitrebond copolymer = chemical bond to tooth + fluoride. 3M system: Scotchbond + RelyX Ultimate.",
    refs: ["perdigao-2020", "vanmeerbeek-2020"],
  },
];

// ═══════════════════════════════════════════════
// DETAIL VIEWS
// ═══════════════════════════════════════════════

// ── Material Detail ──
function MatDetail({ mat, onBack }) {
  const col = gc(mat.cat);
  const [tab, setTab] = useState("surface");
  const s = mat.surface;
  const tabs = [
    { id: "surface", label: "Surface Tx" },
    { id: "cement", label: "Cementation" },
    { id: "tooth", label: "Tooth Prep" },
  ];

  return (
    <div style={{ maxWidth: 820, margin: "0 auto" }}>
      <DetailHeader item={mat} onBack={onBack} />
      <TabBar tabs={tabs} active={tab} setActive={setTab} color={col.a} />
      <div
        style={{
          background: "#080d19",
          borderRadius: 11,
          padding: "16px 20px",
          border: "1px solid #1e293b",
          minHeight: 280,
        }}
      >
        {tab === "surface" && (
          <div>
            <S color={col.a} refs={s.etch.refs}>
              1 · Etching
            </S>
            <R l="Method" v={s.etch.m} c={col.a} />
            <R l="Detail" v={s.etch.d} c={col.a} />
            {s.etch.w && <R l="Warning" v="" c="#ef4444" w={s.etch.w} />}

            <S color={col.a} refs={s.abrasion.refs}>
              2 · Abrasion
            </S>
            <R l="Protocol" v={s.abrasion.m} c={col.a} />

            <S color={col.a}>3 · Cleaning</S>
            <OL items={s.clean} c={col.a} />

            <S color={col.a} refs={s.primer.refs}>
              4 · Primer
            </S>
            <R l="Evidence" v={s.primer.best} c="#10b981" />
            <R l="Mechanism" v={s.primer.mechanism} c={col.a} />
            {s.primer.conflict && (
              <div
                style={{
                  background: "#7f1d1d",
                  borderRadius: 6,
                  padding: "6px 10px",
                  marginTop: 6,
                  borderLeft: "3px solid #ef4444",
                }}
              >
                <span
                  style={{ color: "#ef4444", fontSize: 9, fontWeight: 800 }}
                >
                  IFU CONFLICT — EVIDENCE PREVAILS
                </span>
                <ReadMore color="#fca5a5">{SILANE_2B.rationale}</ReadMore>
              </div>
            )}

            {/* 2-bottle silane protocol (for silane materials) or MDP note */}
            {s.primer.best.includes("Silane") && (
              <Card border="#10b981">
                <div
                  style={{
                    color: "#10b981",
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: 1,
                    marginBottom: 4,
                  }}
                >
                  ✓ 2-BOTTLE SILANE PROTOCOL
                </div>
                <div
                  style={{ color: "#6ee7b7", fontSize: 10, marginBottom: 3 }}
                >
                  {SILANE_2B.products}
                </div>
                <OL items={SILANE_2B.steps} c="#6ee7b7" />
                <div
                  style={{
                    background: "#450a0a",
                    borderRadius: 4,
                    padding: "4px 8px",
                    marginTop: 4,
                  }}
                >
                  <span
                    style={{ color: "#ef4444", fontSize: 9, fontWeight: 800 }}
                  >
                    ⚠{" "}
                  </span>
                  <span style={{ color: "#fca5a5", fontSize: 10 }}>
                    {SILANE_2B.warn}
                  </span>
                </div>
                <ReadMore color="#6ee7b7">{SILANE_2B.heat}</ReadMore>
              </Card>
            )}

            {s.primer.best.includes("MDP") &&
              !s.primer.best.includes("DUAL") && (
                <Card border="#60a5fa">
                  <div
                    style={{
                      color: "#60a5fa",
                      fontSize: 9,
                      fontWeight: 800,
                      marginBottom: 3,
                    }}
                  >
                    MDP PRIMER PROTOCOL
                  </div>
                  <div
                    style={{
                      color: "#93c5fd",
                      fontSize: 10.5,
                      lineHeight: 1.5,
                    }}
                  >
                    Apply MDP primer → 60 sec → air thin (monolayer principle
                    applies). Verify dry, uniform film.
                  </div>
                </Card>
              )}

            {s.primer.best.includes("DUAL") && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 6,
                  marginTop: 6,
                }}
              >
                <Card border="#60a5fa">
                  <div
                    style={{ color: "#60a5fa", fontSize: 9, fontWeight: 800 }}
                  >
                    ZIRCONIA (Intaglio)
                  </div>
                  <div style={{ color: "#93c5fd", fontSize: 10.5 }}>
                    MDP → 60s → air thin
                  </div>
                </Card>
                <Card border="#fb7185">
                  <div
                    style={{ color: "#fb7185", fontSize: 9, fontWeight: 800 }}
                  >
                    FUSION (Facial/Incisal)
                  </div>
                  <div style={{ color: "#fda4af", fontSize: 10.5 }}>
                    2-bottle silane → 60s → air thin + heat
                  </div>
                </Card>
              </div>
            )}

            {s.primer.best.includes("VBATDT") ||
            s.primer.best.includes("Alloy") ? (
              <Card border="#eab308">
                <div
                  style={{
                    color: "#eab308",
                    fontSize: 9,
                    fontWeight: 800,
                    marginBottom: 3,
                  }}
                >
                  ALLOY PRIMER PROTOCOL (VBATDT + MDP)
                </div>
                <div
                  style={{ color: "#fde68a", fontSize: 10.5, lineHeight: 1.5 }}
                >
                  Apply Alloy Primer (Kuraray) or V-Primer to sandblasted noble
                  metal surface → 60 sec → air thin. VBATDT bonds to noble
                  metals via sulfur-metal interaction. MDP handles base metal
                  oxides.
                </div>
                <ReadMore color="#fde68a">
                  Alloy Primer contains BOTH VBATDT (for noble) and MDP (for
                  base metals) = universal metal primer. Without it, resin
                  cements have virtually no chemical bond to gold/noble alloys.
                  Essential for adhesive cementation of non-retentive gold/noble
                  preps.
                </ReadMore>
              </Card>
            ) : null}

            {s.laser && (
              <div style={{ marginTop: 8 }}>
                <R
                  l="Laser"
                  v={s.laserNote || "Not recommended"}
                  c={s.laser === true ? "#fbbf24" : "#ef4444"}
                />
              </div>
            )}
            <CureInfo />
          </div>
        )}

        {tab === "cement" && (
          <div>
            <S color={col.a} refs={mat.cement.refs}>
              Recommended
            </S>
            {mat.cement.pref.map((c, i) => (
              <Card key={i} border={col.a}>
                <div
                  style={{
                    fontWeight: 700,
                    color: col.a,
                    fontSize: 12,
                    marginBottom: 2,
                  }}
                >
                  {c.t}
                </div>
                <div style={{ color: "#64748b", fontSize: 11 }}>{c.ex}</div>
                <div
                  style={{ color: "#94a3b8", fontSize: 11, lineHeight: 1.4 }}
                >
                  {c.n}
                </div>
                {c.dc && (
                  <div
                    style={{
                      color: "#fbbf24",
                      fontSize: 10,
                      marginTop: 2,
                      fontWeight: 600,
                    }}
                  >
                    ⚡ {c.dc}
                  </div>
                )}
                {c.cure && (
                  <div style={{ color: "#22d3ee", fontSize: 10, marginTop: 1 }}>
                    ⏱ {c.cure}
                  </div>
                )}
              </Card>
            ))}
            <S color="#ef4444">Avoid</S>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {mat.cement.avoid.map((a, i) => (
                <li
                  key={i}
                  style={{ color: "#fca5a5", fontSize: 11.5, marginBottom: 2 }}
                >
                  {a}
                </li>
              ))}
            </ul>
            {mat.cement.special && (
              <>
                <S color="#fbbf24">Notes</S>
                <p
                  style={{
                    color: "#fde68a",
                    fontSize: 11.5,
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {mat.cement.special}
                </p>
              </>
            )}
          </div>
        )}

        {tab === "tooth" && (
          <div>
            <S color={col.a} refs={mat.tooth.refs}>
              Enamel Etching
            </S>
            <R l="Protocol" v={mat.tooth.etch} c={col.a} />
            <IsolationInfo />
            <S color={col.a}>Adhesive Systems</S>
            {mat.tooth.adh.map((a, i) => (
              <Card key={i} border={col.a}>
                <div
                  style={{
                    fontWeight: 700,
                    color: col.a,
                    fontSize: 12,
                    marginBottom: 1,
                  }}
                >
                  {a.s}
                </div>
                <div
                  style={{ color: "#c084fc", fontSize: 10.5, marginBottom: 4 }}
                >
                  {a.ex}
                </div>
                <OL items={a.steps} c={col.a} />
                {a.dc && (
                  <div
                    style={{
                      color: "#fbbf24",
                      fontSize: 10,
                      marginTop: 2,
                      fontWeight: 600,
                    }}
                  >
                    ⚡ {a.dc}
                  </div>
                )}
              </Card>
            ))}
            <S color="#ef4444">Contamination</S>
            <R l="Saliva" v={mat.tooth.contam.saliva} c="#ef4444" />
            <R l="Try-in" v={mat.tooth.contam.tryIn} c="#ef4444" />
            <R l="Blood" v={mat.tooth.contam.blood} c="#ef4444" />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Cement Detail ──
function CemDetail({ cem, onBack }) {
  const col = gc(cem.cat);
  const [tab, setTab] = useState("protocol");
  const tabs = [
    { id: "protocol", label: "Protocol" },
    { id: "compat", label: "Compatibility" },
    { id: "clinical", label: "Clinical" },
  ];
  return (
    <div style={{ maxWidth: 820, margin: "0 auto" }}>
      <DetailHeader
        item={cem}
        onBack={onBack}
        extra={
          <span
            style={{
              background: "#1e293b",
              color: "#fbbf24",
              fontSize: 9,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 16,
            }}
          >
            {cem.cureType}
          </span>
        }
      />
      <TabBar tabs={tabs} active={tab} setActive={setTab} color={col.a} />
      <div
        style={{
          background: "#080d19",
          borderRadius: 11,
          padding: "16px 20px",
          border: "1px solid #1e293b",
          minHeight: 280,
        }}
      >
        {tab === "protocol" && (
          <div>
            <S color={col.a} refs={cem.refs}>
              Application
            </S>
            <OL items={cem.steps} c={col.a} />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginTop: 12,
              }}
            >
              <Card border="#22d3ee">
                <div style={{ color: "#22d3ee", fontSize: 9, fontWeight: 800 }}>
                  WORKING TIME
                </div>
                <div
                  style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 700 }}
                >
                  {cem.workTime}
                </div>
              </Card>
              <Card border="#f59e0b">
                <div style={{ color: "#f59e0b", fontSize: 9, fontWeight: 800 }}>
                  SETTING TIME
                </div>
                <div
                  style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 700 }}
                >
                  {cem.setTime}
                </div>
              </Card>
            </div>
            <S color={col.a}>Cleanup</S>
            <p
              style={{
                color: "#cbd5e1",
                fontSize: 11.5,
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {cem.cleanup}
            </p>
            <CureInfo />
          </div>
        )}
        {tab === "compat" && (
          <div>
            {cem.compat.excellent.length > 0 && (
              <>
                <S color="#10b981">Excellent</S>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {cem.compat.excellent.map((s, i) => (
                    <li
                      key={i}
                      style={{
                        color: "#a7f3d0",
                        fontSize: 11.5,
                        marginBottom: 3,
                      }}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {cem.compat.good.length > 0 && (
              <>
                <S color="#fbbf24">Good</S>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {cem.compat.good.map((s, i) => (
                    <li
                      key={i}
                      style={{
                        color: "#fde68a",
                        fontSize: 11.5,
                        marginBottom: 3,
                      }}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </>
            )}
            <S color="#ef4444">Avoid</S>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {cem.compat.avoid.map((s, i) => (
                <li
                  key={i}
                  style={{ color: "#fca5a5", fontSize: 11.5, marginBottom: 3 }}
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
        {tab === "clinical" && (
          <div>
            <R l="Tooth Adh" v={cem.adhesiveNeeded} c={col.a} />
            <R l="Rest Prep" v={cem.restorationPrep} c={col.a} />
            <S color="#fbbf24">DC Considerations</S>
            <Card
              border={
                cem.dcNote.includes("⚠") || cem.dcNote.includes("MANDATORY")
                  ? "#ef4444"
                  : "#fbbf24"
              }
            >
              <p
                style={{
                  color: cem.dcNote.includes("⚠") ? "#fca5a5" : "#fde68a",
                  fontSize: 11.5,
                  lineHeight: 1.5,
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                {cem.dcNote}
              </p>
            </Card>
            {cem.special && (
              <>
                <S color="#c084fc">Clinical Pearls</S>
                <p
                  style={{
                    color: "#d8b4fe",
                    fontSize: 11.5,
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {cem.special}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Composite Detail ──
function CompDetail({ comp, onBack }) {
  const col = gc(comp.cat);
  const [tab, setTab] = useState("protocol");
  const tabs = [
    { id: "protocol", label: "Application" },
    { id: "ids", label: "IDS / DME / Core" },
    { id: "clinical", label: "Clinical" },
  ];
  return (
    <div style={{ maxWidth: 820, margin: "0 auto" }}>
      <DetailHeader item={comp} onBack={onBack} />
      <TabBar tabs={tabs} active={tab} setActive={setTab} color={col.a} />
      <div
        style={{
          background: "#080d19",
          borderRadius: 11,
          padding: "16px 20px",
          border: "1px solid #1e293b",
          minHeight: 280,
        }}
      >
        {tab === "protocol" && (
          <div>
            <S color={col.a} refs={comp.refs}>
              Placement
            </S>
            <OL items={comp.steps} c={col.a} />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginTop: 12,
              }}
            >
              <Card border="#e879f9">
                <div style={{ color: "#e879f9", fontSize: 9, fontWeight: 800 }}>
                  LAYERING
                </div>
                <div
                  style={{ color: "#e2e8f0", fontSize: 11, lineHeight: 1.4 }}
                >
                  {comp.layering}
                </div>
              </Card>
              <Card border="#f59e0b">
                <div style={{ color: "#f59e0b", fontSize: 9, fontWeight: 800 }}>
                  CURE
                </div>
                <div
                  style={{ color: "#e2e8f0", fontSize: 11, lineHeight: 1.4 }}
                >
                  {comp.cureTime}
                </div>
              </Card>
            </div>
            <CureInfo />
          </div>
        )}
        {tab === "ids" && (
          <div>
            <S color="#22d3ee">IDS / Resin Coat</S>
            <p
              style={{
                color: "#cbd5e1",
                fontSize: 11.5,
                lineHeight: 1.5,
                margin: "0 0 10px",
              }}
            >
              {comp.ids}
            </p>
            <S color="#60a5fa">DME</S>
            <p
              style={{
                color: "#cbd5e1",
                fontSize: 11.5,
                lineHeight: 1.5,
                margin: "0 0 10px",
              }}
            >
              {comp.dme}
            </p>
            {comp.apa && (
              <>
                <S color="#fbbf24">Intraoral APA</S>
                <p
                  style={{
                    color: "#fde68a",
                    fontSize: 11.5,
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {comp.apa}
                </p>
              </>
            )}
          </div>
        )}
        {tab === "clinical" && (
          <div>
            {comp.special && (
              <>
                <S color="#c084fc">Clinical Pearls</S>
                <p
                  style={{
                    color: "#d8b4fe",
                    fontSize: 11.5,
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {comp.special}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Bonding Agent Detail ──
function BondDetail({ bond, onBack }) {
  const col = gc(bond.cat);
  const [tab, setTab] = useState("protocol");
  const tabs = [
    { id: "protocol", label: "Steps" },
    { id: "technique", label: "Technique" },
    { id: "clinical", label: "Clinical" },
  ];
  return (
    <div style={{ maxWidth: 820, margin: "0 auto" }}>
      <DetailHeader
        item={bond}
        onBack={onBack}
        extra={
          <>
            <span
              style={{
                background: "#1e293b",
                color: "#fbbf24",
                fontSize: 9,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 16,
              }}
            >
              {bond.gen}
            </span>
            {bond.antibacterial && (
              <span
                style={{
                  background: "#064e3b",
                  color: "#10b981",
                  fontSize: 9,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 16,
                }}
              >
                MDPB Antibacterial
              </span>
            )}
          </>
        }
      />
      <TabBar tabs={tabs} active={tab} setActive={setTab} color={col.a} />
      <div
        style={{
          background: "#080d19",
          borderRadius: 11,
          padding: "16px 20px",
          border: "1px solid #1e293b",
          minHeight: 280,
        }}
      >
        {tab === "protocol" && (
          <div>
            <S color={col.a} refs={bond.refs}>
              Application
            </S>
            <OL items={bond.steps} c={col.a} />
            <R l="Strength" v={bond.strength} c={col.a} />
            <R l="Layers" v={bond.layers} c={col.a} />
            <CureInfo text={bond.wavelength} />
          </div>
        )}
        {tab === "technique" && (
          <div>
            <S color="#22d3ee">Etch Protocol</S>
            <p
              style={{
                color: "#cbd5e1",
                fontSize: 11.5,
                lineHeight: 1.5,
                margin: "0 0 10px",
              }}
            >
              {bond.etchProtocol}
            </p>
            <S color="#60a5fa">Moisture Control</S>
            <p
              style={{
                color: "#cbd5e1",
                fontSize: 11.5,
                lineHeight: 1.5,
                margin: "0 0 10px",
              }}
            >
              {bond.moisture}
            </p>
            <S color="#2dd4bf">Isolation</S>
            <p
              style={{
                color: "#cbd5e1",
                fontSize: 11.5,
                lineHeight: 1.5,
                margin: "0 0 10px",
              }}
            >
              {bond.isolation}
            </p>
            <S color="#fbbf24">DC Compatibility</S>
            <Card border={bond.dcCompat.includes("✅") ? "#10b981" : "#ef4444"}>
              <p
                style={{
                  color: bond.dcCompat.includes("✅") ? "#a7f3d0" : "#fca5a5",
                  fontSize: 11.5,
                  lineHeight: 1.5,
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                {bond.dcCompat}
              </p>
            </Card>
          </div>
        )}
        {tab === "clinical" && (
          <div>
            {bond.special && (
              <>
                <S color="#c084fc">Clinical Pearls</S>
                <p
                  style={{
                    color: "#d8b4fe",
                    fontSize: 11.5,
                    lineHeight: 1.5,
                    margin: "0 0 10px",
                  }}
                >
                  {bond.special}
                </p>
              </>
            )}
            {bond.antibacterial && (
              <>
                <S color="#10b981">Antibacterial</S>
                <p
                  style={{
                    color: "#a7f3d0",
                    fontSize: 11.5,
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  MDPB polymerizes INTO adhesive = permanent contact-kill. Not
                  leaching. Lasts life of restoration. Also useful as
                  decontaminant after try-in.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════

export default function App() {
  const [sel, setSel] = useState(null);
  const [selType, setSelType] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const allItems = useMemo(
    () => [
      ...MATERIALS.map((m) => ({ ...m, _type: "material" })),
      ...CEMENTS.map((c) => ({ ...c, _type: "cement" })),
      ...COMPOSITES.map((c) => ({ ...c, _type: "composite" })),
      ...BONDING_AGENTS.map((b) => ({ ...b, _type: "bonding" })),
    ],
    []
  );

  const filtered = useMemo(() => {
    let items = allItems;
    if (filter !== "All")
      items = items.filter((x) => getGroup(x.cat) === filter);
    if (search.trim()) {
      const s = search.toLowerCase();
      items = items.filter(
        (x) =>
          x.name.toLowerCase().includes(s) ||
          x.mfr.toLowerCase().includes(s) ||
          x.cat.toLowerCase().includes(s) ||
          (x.composition || "").toLowerCase().includes(s) ||
          (x.cureType || "").toLowerCase().includes(s) ||
          (x.gen || "").toLowerCase().includes(s)
      );
    }
    return items;
  }, [filter, search, allItems]);

  const groups = useMemo(() => {
    const g = {};
    filtered.forEach((m) => {
      const grp = getGroup(m.cat);
      if (!g[grp]) g[grp] = [];
      g[grp].push(m);
    });
    return g;
  }, [filtered]);

  const fl = (
    <link
      href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,600;6..72,700&family=Outfit:wght@400;500;600;700;800;900&display=swap"
      rel="stylesheet"
    />
  );
  const goBack = () => {
    setSel(null);
    setSelType(null);
  };

  if (sel && selType === "material")
    return (
      <div
        style={{
          fontFamily: "'Outfit',system-ui",
          background: "#060a14",
          minHeight: "100vh",
          padding: "20px 16px",
          color: "#e2e8f0",
        }}
      >
        {fl}
        <MatDetail mat={sel} onBack={goBack} />
      </div>
    );
  if (sel && selType === "cement")
    return (
      <div
        style={{
          fontFamily: "'Outfit',system-ui",
          background: "#060a14",
          minHeight: "100vh",
          padding: "20px 16px",
          color: "#e2e8f0",
        }}
      >
        {fl}
        <CemDetail cem={sel} onBack={goBack} />
      </div>
    );
  if (sel && selType === "composite")
    return (
      <div
        style={{
          fontFamily: "'Outfit',system-ui",
          background: "#060a14",
          minHeight: "100vh",
          padding: "20px 16px",
          color: "#e2e8f0",
        }}
      >
        {fl}
        <CompDetail comp={sel} onBack={goBack} />
      </div>
    );
  if (sel && selType === "bonding")
    return (
      <div
        style={{
          fontFamily: "'Outfit',system-ui",
          background: "#060a14",
          minHeight: "100vh",
          padding: "20px 16px",
          color: "#e2e8f0",
        }}
      >
        {fl}
        <BondDetail bond={sel} onBack={goBack} />
      </div>
    );

  return (
    <div
      style={{
        fontFamily: "'Outfit',system-ui",
        background: "#060a14",
        minHeight: "100vh",
        padding: "24px 16px",
        color: "#e2e8f0",
      }}
    >
      {fl}
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: 4,
              color: "#475569",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Evidence-Based Clinical Quick Reference
          </div>
          <h1
            style={{
              fontFamily: "'Newsreader',Georgia,serif",
              fontSize: 32,
              fontWeight: 700,
              color: "#f1f5f9",
              margin: "0 0 4px",
              lineHeight: 1.1,
            }}
          >
            Dental Materials
            <br />
            Protocol Reference
          </h1>
          <p
            style={{
              color: "#475569",
              fontSize: 11,
              maxWidth: 500,
              margin: "6px auto 0",
              lineHeight: 1.4,
            }}
          >
            {allItems.length} products across {GROUPS.length} categories.
            Evidence over IFU. 2-bottle silane over universal primers.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 5,
            marginBottom: 12,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {["All", ...GROUPS].map((g) => (
            <button
              key={g}
              onClick={() => setFilter(g)}
              style={{
                background: filter === g ? "#e2e8f0" : "rgba(255,255,255,0.04)",
                color: filter === g ? "#060a14" : "#64748b",
                border: "none",
                borderRadius: 16,
                padding: "5px 12px",
                fontSize: 10.5,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {g}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 8,
            padding: "8px 12px",
            color: "#e2e8f0",
            fontSize: 12,
            fontFamily: "'Outfit'",
            outline: "none",
            marginBottom: 16,
          }}
        />

        {GROUPS.filter((g) => groups[g]).map((gn) => (
          <div key={gn} style={{ marginBottom: 20 }}>
            <h2
              style={{
                fontFamily: "'Outfit'",
                fontSize: 10,
                fontWeight: 900,
                color: "#334155",
                letterSpacing: 2.5,
                textTransform: "uppercase",
                marginBottom: 8,
                paddingLeft: 4,
              }}
            >
              {gn}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
                gap: 8,
              }}
            >
              {groups[gn].map((item) => {
                const c = gc(item.cat);
                const isMat = item._type === "material";
                const isCem = item._type === "cement";
                const isComp = item._type === "composite";
                const isBond = item._type === "bonding";
                const hasConflict = isMat && item.surface?.primer?.conflict;

                let badge;
                if (isCem) badge = item.cureType;
                else if (isComp)
                  badge = item.cat.includes("Bulk")
                    ? "Bulk Fill"
                    : item.cat.includes("Flow") || item.cat.includes("Fiber")
                    ? "Flowable"
                    : item.cat.includes("Core")
                    ? "DC Core"
                    : "Packable";
                else if (isBond) badge = item.gen?.split("(")[0]?.trim();
                else if (isMat) {
                  const isHf =
                    item.surface?.etch?.m?.includes("HF") &&
                    !item.surface?.etch?.m?.includes("No");
                  badge = isHf
                    ? "HF Etch"
                    : item.surface?.primer?.best?.includes("MDP")
                    ? "MDP"
                    : item.surface?.primer?.best?.includes("Alloy")
                    ? "VBATDT"
                    : "Sandblast";
                }

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSel(item);
                      setSelType(item._type);
                    }}
                    style={{
                      background: `linear-gradient(145deg, ${c.bg}, #060a14)`,
                      borderRadius: 8,
                      padding: "12px 14px",
                      cursor: "pointer",
                      border: `1px solid ${c.a}12`,
                      transition: "all 0.15s",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = c.a + "44";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = c.a + "12";
                      e.currentTarget.style.transform = "none";
                    }}
                  >
                    <div
                      style={{
                        fontSize: 8,
                        fontWeight: 800,
                        color: c.a,
                        letterSpacing: 1.5,
                        textTransform: "uppercase",
                        marginBottom: 2,
                      }}
                    >
                      {item.mfr}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: "#f1f5f9",
                        marginBottom: 4,
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 3,
                        flexWrap: "wrap",
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          background: c.t,
                          color: c.a,
                          fontSize: 8,
                          padding: "2px 6px",
                          borderRadius: 6,
                          fontWeight: 700,
                        }}
                      >
                        {badge}
                      </span>
                      {item.strength && (
                        <span
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            color: "#475569",
                            fontSize: 8,
                            padding: "2px 6px",
                            borderRadius: 6,
                          }}
                        >
                          {item.strength}
                        </span>
                      )}
                      {hasConflict && (
                        <span
                          style={{
                            background: "#7f1d1d",
                            color: "#fca5a5",
                            fontSize: 7,
                            padding: "2px 5px",
                            borderRadius: 6,
                            fontWeight: 800,
                          }}
                        >
                          IFU≠Ev
                        </span>
                      )}
                      {isBond && item.antibacterial && (
                        <span
                          style={{
                            background: "#064e3b",
                            color: "#10b981",
                            fontSize: 7,
                            padding: "2px 5px",
                            borderRadius: 6,
                            fontWeight: 700,
                          }}
                        >
                          MDPB
                        </span>
                      )}
                    </div>
                    <div
                      style={{ color: "#3d4555", fontSize: 9, lineHeight: 1.2 }}
                    >
                      {item.indications?.slice(0, 3).join(" · ")}
                      {(item.indications?.length || 0) > 3 &&
                        ` +${item.indications.length - 3}`}
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        color: c.a,
                        fontSize: 12,
                        opacity: 0.25,
                      }}
                    >
                      →
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div
          style={{
            textAlign: "center",
            padding: "24px 0 10px",
            color: "#1e293b",
            fontSize: 9,
            letterSpacing: 1.5,
          }}
        >
          EVIDENCE-BASED · IFU CONFLICTS NOTED · 2-BOTTLE SILANE PREFERRED ·
          VERIFY WITH CURRENT LITERATURE
        </div>
      </div>
    </div>
  );
}
