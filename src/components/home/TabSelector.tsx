// src/components/game/TabSelector.tsx
"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";

export default function TabSelector({
  activeTab,
  setActiveTab,
}: {
  activeTab: "create" | "join";
  setActiveTab: (tab: "create" | "join") => void;
}) {
  const { t } = useTranslation("common");

  return (
    <div>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "create" | "join")}
        className="w-full"
      >
        <TabsList className="w-full grid grid-cols-2 gap-2 bg-white/90  border border-gray-300 rounded-xl p-1 shadow-inner">
          <TabsTrigger
            value="create"
            className="text-sm font-semibold tracking-wide data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all"
          >
            {t("createGame")}
          </TabsTrigger>
          <TabsTrigger
            value="join"
            className="text-sm font-semibold tracking-wide data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all"
          >
            {t("joinGame")}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
