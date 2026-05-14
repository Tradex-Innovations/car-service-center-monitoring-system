"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Car, ClipboardList, History, LayoutDashboard, Monitor, Settings, Sparkles, Wrench } from "lucide-react";
import { GlassNavbar, GlassSidebar } from "@/components/ui";
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
    <div className="relative isolate min-h-screen overflow-hidden bg-[linear-gradient(115deg,rgba(255,255,255,0.9)_0%,rgba(240,247,255,0.78)_34%,rgba(235,244,255,0.86)_64%,rgba(250,252,255,0.94)_100%),linear-gradient(45deg,rgba(0,122,255,0.08),rgba(52,199,89,0.05),rgba(88,86,214,0.07))]">
      <GlassSidebar className="fixed inset-y-5 left-5 z-20 hidden w-72 lg:block">
        <Link href="/" className="mb-7 flex items-center gap-3 px-2">
          <div className="grid h-12 w-12 place-items-center rounded-[22px] bg-gradient-to-br from-[#111827] to-[#334155] text-white shadow-soft">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-ink">Car Service Center</p>
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
                  "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-600 transition duration-200 hover:bg-white/28 hover:text-ink",
                  active && "bg-white/36 text-ink shadow-soft ring-1 ring-white/70 backdrop-blur-xl"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
      </GlassSidebar>
      <header className="sticky top-0 z-10 px-3 py-3 backdrop-blur lg:hidden">
        <GlassNavbar>
          <div className="mb-3 flex items-center gap-3 px-1">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-ink text-white">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Car Service Center</p>
              <p className="text-xs text-slate-500">Operations Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition",
                  pathname === item.href && "bg-white/38 text-ink shadow-soft ring-1 ring-white/70 backdrop-blur-xl"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </GlassNavbar>
      </header>
      <main className="lg:pl-80">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
