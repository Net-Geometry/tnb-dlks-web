import { LucideIcon } from "lucide-react";

export interface SubMenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
  key: string;
}

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  path?: string; // Optional for parent items with submenus
  key: string;
  subItems?: SubMenuItem[]; // Optional submenus
}
