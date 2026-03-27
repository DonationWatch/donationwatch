import type { LucideIcon } from "lucide-react";
import type { PropsWithChildren } from "react";

import { NavigationLink } from "@/components/layout/navigation-link";

export interface TabItem {
  icon: LucideIcon;
  href: string;
  activeHref?: string;
  label: string;
}

export const TabList = ({ children }: PropsWithChildren) => {
  return (
    <div
      role="tablist"
      className="items-center sm:flex sm:space-x-1 lg:space-x-4"
    >
      {children}
    </div>
  );
};

export const NavigationTabs = ({ items }: { items: TabItem[] }) => {
  return (
    <TabList>
      {items.map((item) => (
        <NavigationLink
          key={item.href}
          icon={<item.icon size={16} />}
          href={item.href}
          activeHref={item.activeHref}
          label={item.label}
        />
      ))}
    </TabList>
  );
};
