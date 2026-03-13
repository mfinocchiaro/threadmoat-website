/**
 * Metro area consolidation for geographic analysis.
 * Shared between the map chart (city bubbles) and the metro bar chart.
 */

/** US metro area groupings — maps individual cities to regional hubs */
export const US_METRO_MAP: Record<string, string> = {
  // Bay Area
  "San Francisco": "Bay Area", "Palo Alto": "Bay Area", "Mountain View": "Bay Area",
  "Redwood City": "Bay Area", "San Jose": "Bay Area", "San Mateo": "Bay Area",
  "Santa Clara": "Bay Area", "Berkeley": "Bay Area", "Oakland": "Bay Area",
  "Sunnyvale": "Bay Area", "Los Altos": "Bay Area", "Los Gatos": "Bay Area",
  "Pleasonton": "Bay Area", "Folsom": "Bay Area", "Concord": "Bay Area",
  "San Francisco Bay Area": "Bay Area",
  // LA / Southern California
  "Los Angeles": "LA / SoCal", "Santa Monica": "LA / SoCal",
  "Culver City": "LA / SoCal", "Inglewood": "LA / SoCal",
  "Hollywood": "LA / SoCal", "Malibu": "LA / SoCal",
  "Chatsworth": "LA / SoCal", "Irvine": "LA / SoCal",
  "Brea": "LA / SoCal", "Tustin": "LA / SoCal",
  "Chula Vista": "LA / SoCal",
  "San Diego": "LA / SoCal", "Carlsbad": "LA / SoCal",
  "Oceanside": "LA / SoCal", "Escondido": "LA / SoCal",
  "Riverside": "LA / SoCal", "Ontario": "LA / SoCal",
  "Anaheim": "LA / SoCal", "Long Beach": "LA / SoCal",
  "Pasadena": "LA / SoCal", "Torrance": "LA / SoCal",
  // Florida
  "Naples": "Florida", "Daytona Beach": "Florida", "Miami": "Florida",
  // Minneapolis
  "Minneaopolis": "Minneapolis", "Minneapolis": "Minneapolis",
  // Boston / New England
  "Boston": "Boston Area", "Cambridge": "Boston Area", "Somerville": "Boston Area",
  "Burlington": "Boston Area", "Northampton": "Boston Area",
  // NYC / Tri-State
  "New York": "New York Area", "New York City": "New York Area",
  "Brooklyn": "New York Area", "Jersey City": "New York Area",
  "Newark": "New York Area", "Hazlet": "New York Area",
  "New London": "New York Area", "Syracuse": "New York Area", "Rochester": "New York Area",
  // Seattle Area
  "Seattle": "Seattle Area", "Kent": "Seattle Area",
  // Denver Area
  "Denver": "Denver Area", "Boulder": "Denver Area",
  // DC / Mid-Atlantic
  "Washington": "DC Area", "Arlington": "DC Area", "Tysons": "DC Area",
  "Wilmington": "DC Area", "Delaware": "DC Area",
  // Chicago Area
  "Chicago": "Chicago Area", "Chicago IL": "Chicago Area", "Warrenville": "Chicago Area",
  // Ohio
  "Cleveland": "Ohio", "Akron": "Ohio", "Columbus": "Ohio", "Dayton": "Ohio",
  // Pittsburgh Area
  "Pittsburgh": "Pittsburgh Area", "Bethlehem": "Pittsburgh Area",
  // Research Triangle
  "Durham": "Research Triangle", "Raleigh": "Research Triangle",
  "Charlottesville": "Research Triangle",
  // Philadelphia
  "Philadelphia": "Philadelphia Area",
  // Catch-all
  "Nowhere": "Rest of USA", "St. Joseph": "Rest of USA", "California": "Rest of USA",
}

/** European metro area groupings */
export const EU_METRO_MAP: Record<string, string> = {
  // London
  "London": "London", "Oxford": "London Area", "Cambridge": "Cambridge, UK",
  "Bristol": "UK Other", "Edinburgh": "UK Other", "Manchester": "UK Other", "Leeds": "UK Other", "Sheffield": "UK Other", "Coventry": "UK Other",
  // Paris
  "Paris": "Paris", "Grenoble": "France Other", "Lyon": "France Other", "Toulouse": "France Other", "Sophia Antipolis": "France Other", "Nice": "France Other",
  // Germany
  "Munich": "Munich", "Berlin": "Berlin", "Stuttgart": "Stuttgart",
  "Hamburg": "Germany Other", "Aachen": "Germany Other", "Darmstadt": "Germany Other", "Karlsruhe": "Germany Other", "Dresden": "Germany Other", "Cologne": "Germany Other",
}

/** Canonical country name normalization */
const COUNTRY_ALIASES: Record<string, string> = {
  "United States": "US", "USA": "US", "US": "US",
  "United Kingdom": "UK", "UK": "UK", "England": "UK", "Scotland": "UK",
  "Germany": "DE", "France": "FR", "Israel": "IL",
  "Canada": "CA", "Netherlands": "NL", "Switzerland": "CH",
  "Sweden": "SE", "Finland": "FI", "Norway": "NO", "Denmark": "DK",
  "India": "IN", "China": "CN", "Japan": "JP", "South Korea": "KR",
  "Australia": "AU", "Singapore": "SG", "Ireland": "IE",
  "Austria": "AT", "Belgium": "BE", "Italy": "IT", "Spain": "ES",
  "Czech Republic": "CZ", "Poland": "PL", "Portugal": "PT",
}

export interface MetroEntry {
  metro: string
  country: string
  count: number
  totalFunding: number
  companies: string[]
}

/**
 * Extract metro name from a company's hqLocation + country.
 * Applies US and EU metro consolidation.
 */
export function getMetroName(hqLocation: string | undefined | null, country: string | undefined | null): string {
  if (!hqLocation) return "Unknown"
  const parts = hqLocation.split(",").map(s => s.trim())
  const city = parts[0] || "Unknown"

  const cleanCountry = (country || "").replace(/[\u{1F300}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu, "").trim()
  const countryCode = COUNTRY_ALIASES[cleanCountry] || cleanCountry

  if (countryCode === "US") {
    return US_METRO_MAP[city] || city
  }

  if (["UK", "FR", "DE"].includes(countryCode)) {
    return EU_METRO_MAP[city] || city
  }

  return city
}

/**
 * Get country label for display (short code → full name where useful)
 */
export function getCountryLabel(country: string | undefined | null): string {
  const raw = (country || "Unknown").replace(/[\u{1F300}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu, "").trim()
  return raw || "Unknown"
}

/**
 * Build metro-area aggregation from company data.
 * Returns sorted by count descending.
 */
export function buildMetroData(companies: { name: string; hqLocation?: string; country?: string; totalFunding?: number }[]): MetroEntry[] {
  const map = new Map<string, MetroEntry>()

  for (const c of companies) {
    const metro = getMetroName(c.hqLocation, c.country)
    const country = getCountryLabel(c.country)
    const key = `${metro}__${country}`

    const existing = map.get(key)
    if (existing) {
      existing.count++
      existing.totalFunding += c.totalFunding || 0
      existing.companies.push(c.name)
    } else {
      map.set(key, {
        metro,
        country,
        count: 1,
        totalFunding: c.totalFunding || 0,
        companies: [c.name],
      })
    }
  }

  return Array.from(map.values()).sort((a, b) => b.count - a.count)
}
