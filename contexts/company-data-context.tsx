"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Company, loadCompanyData } from "@/lib/company-data"

interface CompanyDataContextType {
  companies: Company[]
  isLoading: boolean
}

const CompanyDataContext = createContext<CompanyDataContextType | undefined>(undefined)

export function CompanyDataProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCompanyData().then(data => {
      setCompanies(data)
      setIsLoading(false)
    })
  }, [])

  return (
    <CompanyDataContext.Provider value={{ companies, isLoading }}>
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
