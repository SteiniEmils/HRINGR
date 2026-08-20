/**
 * HRINGR product data — swap waitlist for checkout later without rewriting layout.
 */
window.HRINGR = {
  product: {
    id: "anchor-hoodie",
    name: "Anchor Hoodie",
    collection: "Anchor Collection",
    season: "AW 2026",
    colorway: "Glacier Fractal",
    tagline: "LESS TO THINK ABOUT.",
    pitch:
      "A sensory-aware hoodie designed to reduce mental friction and bring you back to center.",
    fabricGsm: 480,
    fabric: "100% cotton fleece, brushed interior, pre-shrunk",
    fit: "Moderate oversized · drop shoulders · ribbed cuffs & hem · tagless",
    modelNote: "Model is 186 cm / 75 kg. Wearing size L.",
  },

  colors: [
    {
      id: "glacier-fractal",
      name: "Glacier Fractal",
      available: true,
      swatch: "linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 40%, #8a8a8a 55%, #2a2a2a 100%)",
    },
    {
      id: "midnight",
      name: "Midnight",
      available: false,
      swatch: "#0a0a0a",
    },
    {
      id: "bone",
      name: "Bone",
      available: false,
      swatch: "#e8e4dc",
    },
  ],

  sizes: ["S", "M", "L", "XL", "XXL"],

  sizeChart: {
    unit: "cm",
    tolerance: "±1.5 cm",
    headers: ["Size", "Chest", "Length", "Shoulder", "Sleeve"],
    rows: [
      ["S", "62", "68", "60", "58"],
      ["M", "64", "70", "62", "59"],
      ["L", "66", "72", "64", "60"],
      ["XL", "68", "74", "66", "61"],
      ["XXL", "70", "76", "68", "62"],
    ],
  },

  gallery: [
    {
      src: "assets/hoodie-front.png",
      alt: "Anchor Hoodie front view in Glacier Fractal pattern",
    },
    {
      src: "assets/hoodie-back.png",
      alt: "Anchor Hoodie back view with HRINGR mark at upper back",
    },
    {
      src: "assets/pocket-detail.png",
      alt: "Focus Pocket system and Anchor Hoodie lookbook detail",
    },
  ],

  hotspots: [
    {
      id: "focus-pocket",
      label: "Focus Pocket™",
      x: 48,
      y: 62,
      title: "Focus Pocket™ System",
      body: "Everything in its place. Nothing in the way. Four compartments keep essentials organized and out of sight.",
      details: [
        "Stabilized Phone Sleeve™ — top-entry phone pocket",
        "Secure Stretch Pockets — earbuds and small gear",
        "Hidden Zip Pocket — valuables secured",
        "Large Main Pocket — everyday carry",
      ],
    },
    {
      id: "anchor-hood",
      label: "Anchor Hood™",
      x: 50,
      y: 18,
      title: "Anchor Hood™",
      body: "Over-ear compatible. Distraction reducing. A three-part hood shaped to stay put when you move.",
      details: [
        "Fits over large headphones",
        "Generous depth without bulk",
        "Drawcord adjustment",
      ],
    },
    {
      id: "anchor-loop",
      label: "Anchor Loop™",
      x: 72,
      y: 48,
      title: "Anchor Loop™",
      body: "Secure your gear. Stay ready. A discreet anchor point for a removable retractable keychain.",
      details: ["Accessory-ready", "Reinforced attachment", "Low-profile when unused"],
    },
    {
      id: "fabric",
      label: "480 GSM",
      x: 28,
      y: 40,
      title: "Premium Fabrics",
      body: "480 GSM heavyweight cotton fleece. Dense, soft, and built to hold its shape.",
      details: [
        "480 GSM cotton fleece",
        "Brushed interior",
        "Pre-shrunk",
        "Double-needle stitching",
      ],
    },
  ],

  specs: [
    { label: "Fabric", value: "480 GSM, 100% cotton fleece" },
    { label: "Interior", value: "Brushed, pre-shrunk" },
    { label: "Fit", value: "Moderate oversized, drop shoulders" },
    { label: "Print", value: "Glacier Fractal — each piece unique" },
    { label: "Construction", value: "Double needle, reinforced seams, bar-tacked stress points" },
    { label: "Details", value: "Tagless · subtle embroidery · ribbed cuffs & hem" },
  ],

  faq: [
    {
      q: "When can I buy the Anchor Hoodie?",
      a: "The store is not open yet. Join the waitlist with your size and we will notify you when Glacier Fractal drops.",
    },
    {
      q: "How should I choose a size?",
      a: "The fit is moderate oversized. Use the size chart (cm). Our model is 186 cm / 75 kg and wears L. If you are between sizes and want more room, size up.",
    },
    {
      q: "What is the Focus Pocket™ System?",
      a: "A structured kangaroo pocket with a phone sleeve, stretch pockets for earbuds, a hidden zip compartment, and a large main pocket — so gear stays sorted without visual clutter.",
    },
    {
      q: "Will Midnight and Bone be available?",
      a: "Yes. Those colorways are planned. Select them on the waitlist to get notified when they open.",
    },
    {
      q: "How do I wash it?",
      a: "Wash cold, inside out, gentle cycle. Hang dry or tumble low. Avoid high heat to protect the Glacier Fractal print and fleece hand-feel.",
    },
    {
      q: "Do you ship internationally?",
      a: "Shipping details will be confirmed when the store opens. Designed in Iceland — we will share rates and regions with the first drop.",
    },
  ],
};
