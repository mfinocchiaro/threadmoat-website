"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Company, loadCompanyData } from "@/lib/company-data"

interface CompanyDataContextType {
  companies: Company[]
  totalAvailable: number
  isLoading: boolean
}

const CompanyDataContext = createContext<CompanyDataContextType | undefined>(undefined)

export function CompanyDataProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [totalAvailable, setTotalAvailable] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCompanyData().then(({ companies, totalAvailable }) => {
      setCompanies(companies)
      setTotalAvailable(totalAvailable)
      setIsLoading(false)
    })
  }, [])

  return (
    <CompanyDataContext.Provider value={{ companies, totalAvailable, isLoading }}>
      {children}
    </CompanyDataContext.Provider>
  )
}

export function useCompanyData(): CompanyDataContextType {
  const context = useContext(CompanyDataContext)
  if (context === undefined) {
    throw new Error("useCompanyData must be used within a CompanyDataProvider")
  }
  return context
}
