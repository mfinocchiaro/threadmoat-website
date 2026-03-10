/**
 * Domain map for well-known VCs, corporate investors, and accelerators.
 * Uses the same Google favicon approach as customer-logos.ts.
 */

const INVESTOR_DOMAINS: Record<string, string> = {
  // Top-tier VCs
  "Y-Combinator": "ycombinator.com",
  "YC": "ycombinator.com",
  "Andreessen Horowitz": "a16z.com",
  "a16z": "a16z.com",
  "Sequoia Capital": "sequoiacap.com",
  "Sequoia": "sequoiacap.com",
  "Accel": "accel.com",
  "Benchmark": "benchmark.com",
  "Insight Partners": "insightpartners.com",
  "Khosla Ventures": "khoslaventures.com",
  "Kleiner Perkins": "kleinerperkins.com",
  "Lightspeed": "lightspeedvp.com",
  "General Catalyst": "generalcatalyst.com",
  "Greylock": "greylock.com",
  "Founders Fund": "foundersfund.com",
  "Tiger Global": "tigerglobal.com",
  "Coatue": "coatue.com",
  "Index Ventures": "indexventures.com",
  "Bessemer Venture Partners": "bvp.com",
  "Battery Ventures": "battery.com",
  "EQT Ventures": "eqtgroup.com",
  "First Round Capital": "firstround.com",
  "First Round": "firstround.com",
  "IVP": "ivp.com",
  "Lux Capital": "luxcapital.com",
  "LUX": "luxcapital.com",
  "Redpoint": "redpoint.com",
  "Point72 Ventures": "point72.com",
  "Point72": "point72.com",
  "New Enterprise Associates": "nea.com",
  "NEA": "nea.com",
  "USV": "usv.com",
  "Union Square Ventures": "usv.com",
  "Felicis": "felicis.vc",
  "CRV": "crv.com",
  "Sapphire Ventures": "sapphireventures.com",
  "Scale Venture Partners": "scalevp.com",
  "Addition": "additioncapital.com",
  "Atomico": "atomico.com",
  "Balderton Capital": "balderton.com",
  "Balderton": "balderton.com",
  "Aleph": "aleph.vc",
  "Creandum": "creandum.com",
  "LocalGlobe": "localglobe.vc",
  "Partech": "partechpartners.com",
  "Cherry Ventures": "cherry.vc",
  "Headline": "headline.com",
  "Angular Ventures": "angularventures.com",
  "Amplify Partners": "amplifypartners.com",
  "Eclipse Ventures": "eclipse.vc",
  "Geodesic Capital": "geodesiccap.com",
  "Georgian Partners": "georgian.io",
  "S28 Capital": "s28capital.com",
  "Amadeus Capital Partners": "amadeuscapital.com",
  "Altos Ventures": "altosvc.com",
  "Alumni Ventures": "av.vc",
  "Alven": "alven.com",
  "Anzu Partners": "anzupartners.com",
  "Antler": "antler.co",
  "500 Global": "500.co",
  "500 Startups": "500.co",
  "Capnamic": "capnamic.com",
  "Village Global": "villageglobal.vc",
  "Breakthrough Energy Ventures": "breakthroughenergy.org",
  "Next47": "next47.com",
  "Alchemist Accelerator": "alchemistaccelerator.com",
  "btov Partners": "btov.vc",
  "High-Tech Gründerfonds": "htgf.de",
  "High-Tech Gruenderfonds": "htgf.de",
  "SoftBank": "softbank.com",
  "Verve Ventures": "verve.vc",
  "Verve VC": "verve.vc",

  // Corporate / Strategic
  "Google Ventures": "gv.com",
  "GV": "gv.com",
  "Intel Capital": "intel.com",
  "Intel Ignite": "intel.com",
  "Intel": "intel.com",
  "Microsoft": "microsoft.com",
  "NVIDIA": "nvidia.com",
  "Nvidia": "nvidia.com",
  "Amazon Web Services": "aws.amazon.com",
  "Amazon Climate Pledge Fund": "amazon.com",
  "SAP.iO": "sap.com",
  "SAP": "sap.com",
  "Autodesk": "autodesk.com",
  "Autodesk Spark Investment Fund": "autodesk.com",
  "Airbus Ventures": "airbus.com",
  "GE Ventures": "ge.com",
  "Bosch Ventures": "bosch.com",
  "Bosch": "bosch.com",
  "Siemens": "siemens.com",
  "Porsche Ventures": "porsche.com",
  "Plug and Play": "plugandplaytechcenter.com",
  "AI Fund": "aifund.ai",
}

/**
 * Resolve a domain for an investor name, then return a Google favicon URL.
 */
export function getInvestorLogoUrl(name: string, size = 80): string | null {
  const domain = resolveInvestorDomain(name)
  if (!domain) return null
  const sz = size <= 32 ? 32 : size <= 64 ? 64 : size <= 128 ? 128 : 256
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${sz}`
}

function resolveInvestorDomain(name: string): string | null {
  // 1. Exact match
  if (INVESTOR_DOMAINS[name]) return INVESTOR_DOMAINS[name]

  const nameLower = name.toLowerCase().trim()

  // 2. Case-insensitive exact match
  for (const [key, domain] of Object.entries(INVESTOR_DOMAINS)) {
    if (key.toLowerCase() === nameLower) return domain
  }

  // 3. Prefix match — "Andreessen Horowitz (a16z)" → "Andreessen Horowitz"
  for (const [key, domain] of Object.entries(INVESTOR_DOMAINS)) {
    const keyLower = key.toLowerCase()
    if (
      nameLower.startsWith(keyLower) &&
      (nameLower.length === keyLower.length || /[\s\-,.(']/.test(nameLower[keyLower.length]))
    ) {
      return domain
    }
  }

  return null
}

/** Check if an investor has a known domain */
export function hasInvestorLogo(name: string): boolean {
  return getInvestorLogoUrl(name) !== null
}
