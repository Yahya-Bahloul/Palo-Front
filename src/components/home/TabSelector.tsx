// src/components/game/TabSelector.tsx
"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { theme } from "@/styles/theme";

export type HomeTab = "create" | "join" | "online";

export default function TabSelector({
  activeTab,
  setActiveTab,
}: {
  activeTab: HomeTab;
  setActiveTab: (tab: HomeTab) => void;
}) {
  const { t } = useTranslation("common");

  return (
    <div>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as HomeTab)}
        className="w-full"
      >
        <TabsList className={theme.tabSelector.list}>
          <TabsTrigger value="create" className={theme.tabSelector.trigger}>
            {t("createGame")}
          </TabsTrigger>
          <TabsTrigger value="join" className={theme.tabSelector.trigger}>
            {t("joinGame")}
          </TabsTrigger>
          <TabsTrigger value="online" className={theme.tabSelector.trigger}>
            {t("online.tab", "En ligne")}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
