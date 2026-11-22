"use client";

import dynamic from "next/dynamic";

const AppSidebarSkeleton = () => (
  <aside
    className="group peer text-sidebar-foreground hidden md:block"
    data-state="expanded"
    data-variant="inset"
    data-slot="sidebar"
  >
    <div className="relative w-(--sidebar-width,16rem) bg-transparent transition-[width] duration-200 ease-linear" />
    <div className="bg-sidebar fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width,16rem) p-2 md:flex">
      <div className="bg-sidebar flex size-full flex-col" />
    </div>
  </aside>
);

const AppSidebarDynamic = dynamic(
  () =>
    import("./app-sidebar").then((mod) => {
      return mod.AppSidebar;
    }),
  {
    ssr: false,
    loading: AppSidebarSkeleton,
  },
);

export function DynamicAppSidebar() {
  return <AppSidebarDynamic />;
}
