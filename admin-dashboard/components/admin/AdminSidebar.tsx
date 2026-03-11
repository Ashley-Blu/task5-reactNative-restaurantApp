"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "./sidebarLinks";
import clsx from "clsx";

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r h-screen px-4 py-6">
      <h2 className="text-xl font-bold mb-8">Foodie Admin</h2>

      <nav className="flex flex-col gap-2">
        {sidebarLinks.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-md transition",
                active
                  ? "bg-yellow-400 text-black font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
