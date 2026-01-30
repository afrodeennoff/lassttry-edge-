"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TradeTableReview } from "./components/tables/trade-table-review";
import { AccountsOverview } from "./components/accounts/accounts-overview";
import WidgetCanvas from "./components/widget-canvas";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { clearReferralCode } from "@/lib/referral-storage";

export default function Home() {
  const searchParams = useSearchParams();

  // Clear referral code after successful subscription
  useEffect(() => {
    const success = searchParams.get("success");
    if (success === "true") {
      clearReferralCode();
    }
  }, [searchParams]);

  const activeTab = searchParams.get("tab") || "widgets";

  return (
    <main className="w-full h-full">
      <Tabs value={activeTab} className="w-full h-full">
        <TabsContent value="table" className="h-[calc(100vh-64px)] p-4">
          <TradeTableReview />
        </TabsContent>

        <TabsContent value="accounts" className="flex-1 mt-0">
          <AccountsOverview size="large" />
        </TabsContent>

        <TabsContent value="widgets" className="px-4">
          <WidgetCanvas />
        </TabsContent>
      </Tabs>
    </main>
  );
}

