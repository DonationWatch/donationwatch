"use server";

import { DynamicContentSearch } from "./dynamic-content-search";
import { LangSwitch } from "./lang-switch";
import { SidebarTriggerButtons } from "./ui/sidebar-trigger-buttons";

export const PageHeader = async () => {
  return (
    <div className="sticky top-0 z-20 lg:-mx-16">
      <header className="pointer-events-none absolute top-0 right-0 left-0 flex shrink-0 border-b border-transparent dark:text-white">
        <div className="flex grow justify-between px-2 pt-4 lg:px-4 lg:pt-4">
          <div>
            <div className="pointer-events-auto flex items-center gap-1 rounded-full border-slate-200 bg-white/60 p-1 shadow backdrop-blur-sm lg:flex-col dark:border-slate-50/6 dark:bg-slate-900/60">
              <SidebarTriggerButtons />
            </div>
          </div>

          <div>
            <div className="pointer-events-auto flex items-center gap-1 rounded-full border-slate-200 bg-white/60 p-1 shadow backdrop-blur-sm lg:flex-col dark:border-slate-50/6 dark:bg-slate-900/60">
              <DynamicContentSearch />
              <LangSwitch />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};
