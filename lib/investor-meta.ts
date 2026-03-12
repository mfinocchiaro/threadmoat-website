/**
 * HQ location and short description for well-known investors.
 * Displayed in the investor network dialog when clicking a node.
 */

export const INVESTOR_META: Record<string, { hq: string; description: string }> = {
  // Accelerators & incubators
  "Y-Combinator": { hq: "San Francisco, CA", description: "Leading startup accelerator and seed funder" },
  "YC": { hq: "San Francisco, CA", description: "Leading startup accelerator and seed funder" },
  "Techstars": { hq: "Boulder, CO", description: "Global startup accelerator network" },
  "500 Global": { hq: "San Francisco, CA", description: "Early-stage venture fund and accelerator" },
  "Antler": { hq: "Singapore", description: "Global day-zero investor and accelerator" },
  "Plug and Play": { hq: "Sunnyvale, CA", description: "Corporate innovation and startup accelerator" },
  "MassChallenge": { hq: "Boston, MA", description: "Zero-equity startup accelerator" },
  "HAX": { hq: "Shenzhen / San Francisco", description: "Hardware and deep tech accelerator" },
  "SOSV": { hq: "Princeton, NJ", description: "Multi-stage VC operating accelerators" },

  // Top-tier VCs
  "Andreessen Horowitz": { hq: "Menlo Park, CA", description: "Top-tier venture capital firm (a16z)" },
  "a16z": { hq: "Menlo Park, CA", description: "Top-tier venture capital firm" },
  "Sequoia Capital": { hq: "Menlo Park, CA", description: "Iconic early and growth stage VC" },
  "Accel": { hq: "Palo Alto, CA", description: "Global venture capital, early to growth" },
  "Benchmark": { hq: "San Francisco, CA", description: "Early-stage venture capital partnership" },
  "Insight Partners": { hq: "New York, NY", description: "Growth-stage software investor" },
  "Khosla Ventures": { hq: "Menlo Park, CA", description: "Deep tech and sustainability VC" },
  "Kleiner Perkins": { hq: "Menlo Park, CA", description: "Pioneering Silicon Valley venture firm" },
  "Lightspeed Venture Partners": { hq: "Menlo Park, CA", description: "Multi-stage enterprise and consumer VC" },
  "General Catalyst": { hq: "Cambridge, MA", description: "Early and growth stage technology VC" },
  "Greylock": { hq: "Menlo Park, CA", description: "Enterprise software and consumer VC" },
  "Founders Fund": { hq: "San Francisco, CA", description: "Thiel-founded deep tech and frontier VC" },
  "Tiger Global": { hq: "New York, NY", description: "Crossover public/private tech investor" },
  "Coatue": { hq: "New York, NY", description: "Technology-focused crossover fund" },
  "Index Ventures": { hq: "London / San Francisco", description: "European and US venture capital firm" },
  "Bessemer Venture Partners": { hq: "San Francisco, CA", description: "Century-old venture firm, cloud focus" },
  "Battery Ventures": { hq: "Boston, MA", description: "Technology-focused investment firm" },
  "EQT Ventures": { hq: "Stockholm, Sweden", description: "European growth and venture investor" },
  "First Round Capital": { hq: "San Francisco, CA", description: "Seed-stage venture capital firm" },
  "NEA": { hq: "Menlo Park, CA", description: "New Enterprise Associates, multi-stage VC" },
  "Lux Capital": { hq: "New York, NY", description: "Deep tech and science venture fund" },
  "GV": { hq: "Mountain View, CA", description: "Google's venture capital arm" },
  "Spark Capital": { hq: "Boston, MA", description: "Early-stage tech venture capital" },
  "Union Square Ventures": { hq: "New York, NY", description: "Thesis-driven early stage VC" },
  "IVP": { hq: "Menlo Park, CA", description: "Late-stage venture and growth equity" },

  // Industrial & deep tech focused
  "Eclipse Ventures": { hq: "Palo Alto, CA", description: "Industrial tech venture capital" },
  "DCVC": { hq: "San Francisco, CA", description: "Deep tech and computational VC" },
  "The Engine": { hq: "Cambridge, MA", description: "MIT-backed tough tech venture fund" },
  "Playground Global": { hq: "Palo Alto, CA", description: "Deep tech venture and studio" },
  "Root Ventures": { hq: "San Francisco, CA", description: "Seed fund for hardware and infra" },
  "Piva Capital": { hq: "San Francisco, CA", description: "Industrial sustainability venture fund" },
  "Catapult Ventures": { hq: "London, UK", description: "Early-stage deep tech investor" },
  "Momenta": { hq: "Zurich, Switzerland", description: "Industry 4.0 focused venture fund" },
  "B Capital Group": { hq: "Los Angeles, CA", description: "Multi-stage enterprise tech investor" },

  // Corporate venture arms
  "Intel Capital": { hq: "Santa Clara, CA", description: "Intel's strategic venture arm" },
  "Google Ventures": { hq: "Mountain View, CA", description: "Alphabet's venture capital arm" },
  "Microsoft": { hq: "Redmond, WA", description: "Strategic corporate venture investor" },
  "NVIDIA": { hq: "Santa Clara, CA", description: "GPU leader, strategic AI investments" },
  "Siemens": { hq: "Munich, Germany", description: "Industrial conglomerate, strategic CVC" },
  "SAP": { hq: "Walldorf, Germany", description: "Enterprise software, strategic CVC" },
  "Autodesk": { hq: "San Francisco, CA", description: "Design software, strategic investments" },
  "Qualcomm Ventures": { hq: "San Diego, CA", description: "Qualcomm's strategic venture arm" },
  "Samsung Ventures": { hq: "Seoul, South Korea", description: "Samsung's strategic investment arm" },
  "Robert Bosch Venture Capital": { hq: "Stuttgart, Germany", description: "Bosch's corporate venture arm" },
  "Schneider Electric Ventures": { hq: "Rueil-Malmaison, France", description: "Schneider's energy tech CVC" },
  "ABB Technology Ventures": { hq: "Zurich, Switzerland", description: "ABB's industrial tech CVC" },
  "Honeywell Ventures": { hq: "Charlotte, NC", description: "Honeywell's strategic investment arm" },

  // European VCs
  "Atomico": { hq: "London, UK", description: "European technology venture firm" },
  "Balderton Capital": { hq: "London, UK", description: "European early-stage tech VC" },
  "HV Capital": { hq: "Munich, Germany", description: "Leading DACH region tech VC" },
  "Earlybird": { hq: "Berlin, Germany", description: "European venture capital firm" },
  "Northzone": { hq: "Stockholm, Sweden", description: "Nordic early-stage tech VC" },
  "Point Nine Capital": { hq: "Berlin, Germany", description: "European B2B SaaS seed fund" },
  "Partech": { hq: "Paris, France", description: "Franco-American venture capital" },

  // Growth & crossover
  "SoftBank Vision Fund": { hq: "London, UK", description: "Largest tech-focused vision fund" },
  "Sapphire Ventures": { hq: "Austin, TX", description: "Enterprise software growth investor" },
  "Meritech Capital": { hq: "Palo Alto, CA", description: "Late-stage enterprise tech VC" },
  "Norwest Venture Partners": { hq: "Palo Alto, CA", description: "Multi-stage venture and growth equity" },
  "Tribe Capital": { hq: "San Francisco, CA", description: "Data-driven venture capital firm" },
}
