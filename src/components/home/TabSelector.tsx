// src/components/game/TabSelector.tsx
"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { theme } from "@/styles/theme";

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
        <TabsList className="w-full grid grid-cols-2 gap-2 h-[40px]	 bg-white/90 border border-gray-300 rounded-xl shadow-inner">
          <TabsTrigger value="create" className={theme.tabSelector.trigger}>
            {t("createGame")}
          </TabsTrigger>
          <TabsTrigger value="join" className={theme.tabSelector.trigger}>
            {t("joinGame")}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
