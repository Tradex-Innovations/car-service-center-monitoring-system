"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Car, ClipboardList, History, LayoutDashboard, Monitor, Settings, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/check-in", label: "New Entry", icon: Car },
  { href: "/jobs", label: "Active Jobs", icon: ClipboardList },
  { href: "/mechanic", label: "Mechanic", icon: Wrench },
  { href: "/tv", label: "TV Display", icon: Monitor },
  { href: "/vehicles", label: "History", icon: History },
  { href: "/admin", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isTv = pathname === "/tv";
  if (isTv) return <main>{children}</main>;

  return (
    <div className="min-h-screen bg-mist">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-line bg-white/90 px-4 py-5 backdrop-blur lg:block">
        <Link href="/" className="mb-7 flex items-center gap-3 px-2">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-white shadow-soft">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight">Car Service Center</p>
            <p className="text-xs text-slate-500">Operations Platform</p>
          </div>
        </Link>
        <nav className="space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-ink",
                  active && "bg-ink text-white hover:bg-ink hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <header className="sticky top-0 z-10 border-b border-line bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2 overflow-x-auto">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn("whitespace-nowrap rounded-full px-3 py-2 text-sm text-slate-600", pathname === item.href && "bg-ink text-white")}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </header>
      <main className="lg:pl-72">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
