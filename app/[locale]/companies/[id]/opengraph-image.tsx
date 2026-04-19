import { generateOgImage, ogSize, ogContentType } from '@/lib/og-image'
import { loadCompaniesFromCSV } from '@/lib/load-companies-server'

export const runtime = 'nodejs'
export const alt = 'ThreadMoat Company Profile'
export const size = ogSize
export const contentType = ogContentType

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const companies = await loadCompaniesFromCSV()
  const company = companies.find((c) => c.id === id)

  return generateOgImage({
    title: company?.name ?? 'Company Profile',
    description: company
      ? `${company.discipline || 'Engineering Software'} startup based in ${company.hqLocation || 'N/A'}`
      : '',
    section: 'Company',
    url: `threadmoat.com/companies/${id}`,
    accentColor: '#7c3aed',
  })
}
