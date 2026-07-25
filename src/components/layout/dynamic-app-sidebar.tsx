"use client";

import dynamic from "next/dynamic";

const AppSidebarSkeleton = () => (
  <aside
    className="group peer text-sidebar-foreground hidden lg:block"
    data-state="expanded"
  >
    <div className="border-sidebar-border relative w-64 bg-transparent transition-[width] duration-200 ease-linear" />
    <div className="border-sidebar-border bg-sidebar fixed inset-y-0 z-10 hidden h-svh w-64 border-r lg:flex" />
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
