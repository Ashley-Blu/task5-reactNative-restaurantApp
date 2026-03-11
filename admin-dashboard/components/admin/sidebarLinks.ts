import {
  LayoutDashboard,
  ShoppingCart,
  Utensils,
  Users,
  Settings,
} from "lucide-react";

export const sidebarLinks = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Menu",
    href: "/admin/menu",
    icon: Utensils,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];
