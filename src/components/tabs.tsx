import { NavigationLink } from "./navigation-link";

import type { LucideIcon } from "lucide-react";
import type { PropsWithChildren, FC } from "react";

export interface TabItem {
  icon: LucideIcon;
  href: string;
  activeHref?: string;
  label: string;
}

export const TabList: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div
      role="tablist"
      className="items-center sm:flex sm:space-x-1 lg:space-x-4"
    >
      {children}
    </div>
  );
};

export const NavigationTabs: FC<{
  items: TabItem[];
}> = ({ items }) => {
  return (
    <TabList>
      {items.map((item) => (
        <NavigationLink
          key={item.href}
          icon={<item.icon size={16} aria-hidden={true} />}
          href={item.href}
          activeHref={item.activeHref}
          label={item.label}
        />
      ))}
    </TabList>
  );
};
