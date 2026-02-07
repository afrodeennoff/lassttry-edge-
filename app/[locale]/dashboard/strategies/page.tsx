"use client"

import { useEffect } from "react"
import { TradeTableReview } from "../components/tables/trade-table-review"

export default function DashboardStrategiesPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="h-[calc(100vh-120px)] p-4 mt-2">
      <div className="w-full h-full glass rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
        <TradeTableReview />
      </div>
    </div>
  )
}
