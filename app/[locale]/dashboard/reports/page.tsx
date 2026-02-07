"use client"

import { useEffect } from "react"
import { AnalysisOverview } from "../components/analysis/analysis-overview"

export default function DashboardReportsPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="w-full p-6">
      <AnalysisOverview />
    </div>
  )
}
