import { DEFAULT_FILTERS } from '@/contexts/filter-context'

// Mock filter composition logic
function mergeArrays(sidebar: string[], top: string[]): string[] {
  if (sidebar.length === 0) return top
  if (top.length === 0) return sidebar
  return sidebar.filter(item => top.includes(item))
}

function getComposedFilters(sidebarFilters: any, topFilters: any) {
  return {
    search: topFilters.search || sidebarFilters.search,
    investmentLists: mergeArrays(sidebarFilters.investmentLists, topFilters.investmentLists),
    industries: mergeArrays(sidebarFilters.industries, topFilters.industries),
    countries: mergeArrays(sidebarFilters.countries, topFilters.countries),
    subsegments: mergeArrays(sidebarFilters.subsegments, topFilters.subsegments),
    subcategories: mergeArrays(sidebarFilters.subcategories, topFilters.subcategories),
    lifecycle: mergeArrays(sidebarFilters.lifecycle, topFilters.lifecycle),
    fundingRound: mergeArrays(sidebarFilters.fundingRound, topFilters.fundingRound),
    deploymentModel: mergeArrays(sidebarFilters.deploymentModel, topFilters.deploymentModel),
    operatingModel: mergeArrays(sidebarFilters.operatingModel, topFilters.operatingModel),
    categoryTags: mergeArrays(sidebarFilters.categoryTags, topFilters.categoryTags),
    differentiationTags: mergeArrays(sidebarFilters.differentiationTags, topFilters.differentiationTags),
    investmentTheses: mergeArrays(sidebarFilters.investmentTheses, topFilters.investmentTheses),
    metrics: topFilters.metrics || sidebarFilters.metrics,
    oceanStrategy: topFilters.oceanStrategy !== "all" ? topFilters.oceanStrategy : sidebarFilters.oceanStrategy,
    sizeCategory: mergeArrays(sidebarFilters.sizeCategory, topFilters.sizeCategory),
    ecosystemFlags: mergeArrays(sidebarFilters.ecosystemFlags, topFilters.ecosystemFlags),
    fundingRange: ([sidebarFilters.fundingRange[0] || 0, sidebarFilters.fundingRange[1] || 0] as [number, number]).every(x => x === 0)
      ? topFilters.fundingRange
      : ([topFilters.fundingRange[0] || 0, topFilters.fundingRange[1] || 0] as [number, number]).every(x => x === 0)
      ? sidebarFilters.fundingRange
      : [
          Math.max(sidebarFilters.fundingRange[0], topFilters.fundingRange[0]),
          Math.min(sidebarFilters.fundingRange[1], topFilters.fundingRange[1]),
        ] as [number, number],
  }
}

describe('Filter Composition', () => {
  describe('Array field merging (intersection)', () => {
    it('returns top filters if sidebar is empty', () => {
      const result = mergeArrays([], ['A', 'B'])
      expect(result).toEqual(['A', 'B'])
    })

    it('returns sidebar filters if top is empty', () => {
      const result = mergeArrays(['A', 'B'], [])
      expect(result).toEqual(['A', 'B'])
    })

    it('returns intersection when both have values', () => {
      const result = mergeArrays(['A', 'B', 'C'], ['B', 'C', 'D'])
      expect(result).toEqual(['B', 'C'])
    })

    it('returns empty array when no intersection', () => {
      const result = mergeArrays(['A', 'B'], ['C', 'D'])
      expect(result).toEqual([])
    })

    it('returns empty when both are empty', () => {
      const result = mergeArrays([], [])
      expect(result).toEqual([])
    })
  })

  describe('Filter composition', () => {
    const sidebarFilters = {
      ...DEFAULT_FILTERS,
      industries: ['CAD', 'CAM'],
      countries: ['US', 'UK'],
    }

    const topFilters = {
      ...DEFAULT_FILTERS,
      industries: ['CAD', 'AI'],
      lifecycle: ['Series A'],
    }

    it('intersects array filters (sidebar + top)', () => {
      const composed = getComposedFilters(sidebarFilters, topFilters)
      expect(composed.industries).toEqual(['CAD']) // intersection of both
      expect(composed.countries).toEqual(['US', 'UK']) // sidebar only
      expect(composed.lifecycle).toEqual(['Series A']) // top only
    })

    it('top filters take precedence for scalar fields', () => {
      const sidebar = { ...DEFAULT_FILTERS, search: 'initial', oceanStrategy: 'red' as const }
      const top = { ...DEFAULT_FILTERS, search: 'refined' }
      const composed = getComposedFilters(sidebar, top)
      expect(composed.search).toBe('refined')
      expect(composed.oceanStrategy).toBe('red')
    })

    it('handles empty top filters correctly', () => {
      const composed = getComposedFilters(sidebarFilters, DEFAULT_FILTERS)
      expect(composed.industries).toEqual(sidebarFilters.industries)
      expect(composed.countries).toEqual(sidebarFilters.countries)
    })

    it('handles empty sidebar filters correctly', () => {
      const composed = getComposedFilters(DEFAULT_FILTERS, topFilters)
      expect(composed.industries).toEqual(topFilters.industries)
      expect(composed.lifecycle).toEqual(topFilters.lifecycle)
    })

    it('intersects funding ranges correctly', () => {
      const sidebar = { ...DEFAULT_FILTERS, fundingRange: [1000000, 5000000] as [number, number] }
      const top = { ...DEFAULT_FILTERS, fundingRange: [2000000, 6000000] as [number, number] }
      const composed = getComposedFilters(sidebar, top)
      expect(composed.fundingRange).toEqual([2000000, 5000000])
    })

    it('uses sidebar range when top is inactive', () => {
      const sidebar = { ...DEFAULT_FILTERS, fundingRange: [1000000, 5000000] as [number, number] }
      const top = { ...DEFAULT_FILTERS, fundingRange: [0, 0] as [number, number] }
      const composed = getComposedFilters(sidebar, top)
      expect(composed.fundingRange).toEqual([1000000, 5000000])
    })

    it('uses top range when sidebar is inactive', () => {
      const sidebar = { ...DEFAULT_FILTERS, fundingRange: [0, 0] as [number, number] }
      const top = { ...DEFAULT_FILTERS, fundingRange: [2000000, 6000000] as [number, number] }
      const composed = getComposedFilters(sidebar, top)
      expect(composed.fundingRange).toEqual([2000000, 6000000])
    })

    it('returns inactive range when both inactive', () => {
      const sidebar = { ...DEFAULT_FILTERS, fundingRange: [0, 0] as [number, number] }
      const top = { ...DEFAULT_FILTERS, fundingRange: [0, 0] as [number, number] }
      const composed = getComposedFilters(sidebar, top)
      expect(composed.fundingRange).toEqual([0, 0])
    })
  })

  describe('Ocean strategy precedence', () => {
    it('uses sidebar when top is "all"', () => {
      const sidebar = { ...DEFAULT_FILTERS, oceanStrategy: 'red' as const }
      const top = { ...DEFAULT_FILTERS, oceanStrategy: 'all' as const }
      const composed = getComposedFilters(sidebar, top)
      expect(composed.oceanStrategy).toBe('red')
    })

    it('uses top when top is not "all"', () => {
      const sidebar = { ...DEFAULT_FILTERS, oceanStrategy: 'red' as const }
      const top = { ...DEFAULT_FILTERS, oceanStrategy: 'blue' as const }
      const composed = getComposedFilters(sidebar, top)
      expect(composed.oceanStrategy).toBe('blue')
    })

    it('uses "all" when both inactive', () => {
      const sidebar = { ...DEFAULT_FILTERS, oceanStrategy: 'all' as const }
      const top = { ...DEFAULT_FILTERS, oceanStrategy: 'all' as const }
      const composed = getComposedFilters(sidebar, top)
      expect(composed.oceanStrategy).toBe('all')
    })
  })
})
