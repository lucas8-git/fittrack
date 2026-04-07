"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Dumbbell,
  PlusCircle,
  BarChart2,
  ClipboardList,
} from "lucide-react";

const navItems = [
  { href: "/dashboard",  label: "Accueil",    Icon: LayoutDashboard },
  { href: "/exercises",  label: "Exercices",  Icon: Dumbbell        },
  { href: "/workout",    label: "Log",        Icon: PlusCircle      },
  { href: "/history",    label: "Historique", Icon: ClipboardList   },
  { href: "/stats",      label: "Stats",      Icon: BarChart2       },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-100 safe-area-pb">
      <div className="flex items-stretch h-[68px] max-w-lg mx-auto">
        {navItems.map(({ href, label, Icon }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 relative transition-colors tap-target",
                isActive ? "text-primary-500" : "text-neutral-300 hover:text-neutral-500"
              )}
            >
              {/* Active indicator dot */}
              {isActive && (
                <span className="absolute top-1 w-8 h-0.5 bg-primary-500 rounded-full" />
              )}

              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 1.8}
                className="mt-1"
              />
              <span
                className={cn(
                  "text-[10px] leading-none",
                  isActive ? "font-semibold" : "font-medium"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
