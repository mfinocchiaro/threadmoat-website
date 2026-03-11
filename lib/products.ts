export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  interval?: "month" | "year"
  features: string[]
}

// Self-serve plans removed — all paid access is Enterprise-only.
export const PRODUCTS: Product[] = []

export function getProduct(productId: string): Product | undefined {
  return PRODUCTS.find(p => p.id === productId)
}
