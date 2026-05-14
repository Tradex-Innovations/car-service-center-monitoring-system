"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, CarFront, ClipboardCheck, Monitor, Search, Wrench } from "lucide-react";
import { Card, PageHeader, Progress, StatCard, StatusBadge } from "@/components/ui";
import { api } from "@/lib/api";
import { formatCurrency, minutesRemaining } from "@/lib/utils";
import type { ServiceOrder } from "@/lib/types";

export default function HomePage() {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);

  useEffect(() => {
    api<ServiceOrder[]>("/api/orders").then(setOrders).catch(() => setOrders([]));
  }, []);

  const active = orders.filter((order) => order.status !== "Completed");
  const revenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  return (
    <>
      <PageHeader title="Operations Overview" eyebrow="Car Service Center" />
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Active jobs", active.length],
          ["Ready vehicles", orders.filter((job) => job.status.includes("Ready")).length],
          ["Completed today", orders.filter((job) => job.status === "Completed").length],
          ["Revenue estimate", formatCurrency(revenue)]
        ].map(([label, value]) => (
          <StatCard key={label} label={String(label)} value={value} />
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          ["/check-in", "New Vehicle Entry", "Detect or confirm a plate and create a service job.", CarFront],
          ["/mechanic", "Mechanic Board", "Move cars through live workflow stages.", Wrench],
          ["/tv", "TV Display", "Open the customer-facing live status board.", Monitor],
          ["/jobs", "Active Jobs", "Search and filter the current day queue.", ClipboardCheck],
          ["/vehicles", "Vehicle History", "Look up visits and service timelines by plate.", Search],
          ["/admin", "Admin Analytics", "Review KPIs, workload, utilization, and demand.", ArrowRight]
        ].map(([href, title, body, Icon]) => (
          <Link key={String(href)} href={String(href)}>
            <Card className="glass-hover h-full">
              <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/55 bg-white/28 text-ios-blue shadow-inner backdrop-blur-xl">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-lg font-semibold">{String(title)}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{String(body)}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Live Queue Snapshot</h2>
          <Link href="/jobs" className="text-sm font-semibold text-slate-600">
            View all
          </Link>
        </div>
        <div className="grid gap-3">
          {active.slice(0, 5).map((order) => (
            <div key={order.id} className="glass-surface grid gap-3 rounded-2xl p-4 md:grid-cols-[1.2fr_1fr_1fr_1.4fr] md:items-center">
              <div>
                <p className="font-semibold">{order.vehicle?.plateNumber}</p>
                <p className="text-sm text-slate-500">
                  {order.vehicle?.make} {order.vehicle?.model}
                </p>
              </div>
              <StatusBadge status={order.status} />
              <p className="text-sm text-slate-500">{minutesRemaining(order.estimatedFinishTime)} min remaining</p>
              <Progress value={order.progressPercentage} />
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
