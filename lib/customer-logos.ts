/**
 * Map well-known customer names to their domains for logo fetching.
 * Uses Clearbit Logo API: https://logo.clearbit.com/{domain}
 */

const CUSTOMER_DOMAINS: Record<string, string> = {
  // Automotive
  "BMW": "bmw.com",
  "Volkswagen": "volkswagen.com",
  "Audi": "audi.com",
  "Ford": "ford.com",
  "Toyota": "toyota.com",
  "Tesla": "tesla.com",
  "Porsche": "porsche.com",
  "Mercedes": "mercedes-benz.com",
  "GM": "gm.com",
  "Stellantis": "stellantis.com",
  "Volvo": "volvo.com",
  "Hyundai": "hyundai.com",
  "Rivian": "rivian.com",
  "Lucid": "lucidmotors.com",

  // Aerospace & Defense
  "Airbus": "airbus.com",
  "Boeing": "boeing.com",
  "NASA": "nasa.gov",
  "Safran": "safrangroup.com",
  "Rolls-Royce": "rolls-royce.com",
  "Lockheed Martin": "lockheedmartin.com",
  "Northrop Grumman": "northropgrumman.com",
  "Raytheon": "rtx.com",
  "BAE Systems": "baesystems.com",
  "SpaceX": "spacex.com",
  "US Air Force": "af.mil",

  // Industrial / Manufacturing
  "Siemens": "siemens.com",
  "Bosch": "bosch.com",
  "ABB": "abb.com",
  "Schneider Electric": "se.com",
  "Caterpillar": "caterpillar.com",
  "GE": "ge.com",
  "Honeywell": "honeywell.com",
  "3M": "3m.com",
  "BASF": "basf.com",
  "DMG MORI": "dmgmori.com",
  "Schaeffler": "schaeffler.com",
  "Trumpf": "trumpf.com",
  "EOS": "eos.info",
  "Hexagon": "hexagon.com",
  "Cummins": "cummins.com",
  "Parker Hannifin": "parker.com",
  "Emerson": "emerson.com",
  "Rockwell": "rockwellautomation.com",
  "Fanuc": "fanuc.com",
  "KUKA": "kuka.com",

  // Tech
  "Google": "google.com",
  "Microsoft": "microsoft.com",
  "Amazon": "amazon.com",
  "Meta": "meta.com",
  "Apple": "apple.com",
  "HP": "hp.com",
  "Dell": "dell.com",
  "Intel": "intel.com",
  "AMD": "amd.com",
  "NVIDIA": "nvidia.com",
  "Qualcomm": "qualcomm.com",
  "Oracle": "oracle.com",
  "SAP": "sap.com",
  "Salesforce": "salesforce.com",
  "Autodesk": "autodesk.com",
  "PTC": "ptc.com",
  "Dassault": "3ds.com",
  "Dassault Systemes": "3ds.com",
  "Ansys": "ansys.com",

  // Consumer / Other
  "Adidas": "adidas.com",
  "Nike": "nike.com",
  "Samsung": "samsung.com",
  "Philips": "philips.com",
  "L'Oréal": "loreal.com",
  "P&G": "pg.com",
  "Merck": "merck.com",
  "Johnson & Johnson": "jnj.com",
  "Medtronic": "medtronic.com",
  "Thales": "thalesgroup.com",
  "Roche": "roche.com",
}

/** Get Clearbit logo URL for a customer name. Returns null if no domain mapping exists. */
export function getCustomerLogoUrl(name: string, size = 80): string | null {
  const domain = CUSTOMER_DOMAINS[name]
  if (!domain) return null
  return `https://logo.clearbit.com/${domain}?size=${size}`
}

/** Check if a customer has a known domain for logo fetching */
export function hasCustomerLogo(name: string): boolean {
  return name in CUSTOMER_DOMAINS
}
