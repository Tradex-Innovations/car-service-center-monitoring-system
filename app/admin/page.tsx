"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, PageHeader, StatusBadge } from "@/components/ui";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

type Stats = {
  kpis: {
    todaysJobs: number;
    activeJobs: number;
    completedJobs: number;
    averageServiceTime: string;
    delayedJobs: number;
    revenueEstimate: number;
  };
  statusCounts: { name: string; value: number }[];
  categoryCounts: { name: string; value: number }[];
  dailyCompleted: { name: string; value: number }[];
  mechanics: { id: string; name: string; role: string; activeJobs: number }[];
  bays: { id: string; name: string; type: string; status: string }[];
};

const colors = ["#111827", "#2563eb", "#0f766e", "#f59e0b", "#7c3aed", "#dc2626"];

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api<Stats>("/api/stats").then(setStats);
  }, []);

  if (!stats) return <PageHeader title="Admin Analytics" eyebrow="Loading" />;

  return (
    <>
      <PageHeader title="Admin Analytics" eyebrow="Manager dashboard" />
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {[
          ["Today’s jobs", stats.kpis.todaysJobs],
          ["Active jobs", stats.kpis.activeJobs],
          ["Completed", stats.kpis.completedJobs],
          ["Avg. service", stats.kpis.averageServiceTime],
          ["Delayed", stats.kpis.delayedJobs],
          ["Revenue", formatCurrency(stats.kpis.revenueEstimate)]
        ].map(([label, value]) => (
          <Card key={label}>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Jobs by Status</h2>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={stats.statusCounts}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#111827" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Most Requested Services</h2>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={stats.categoryCounts} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={4}>
                  {stats.categoryCounts.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Daily Completed Jobs</h2>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={stats.dailyCompleted}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#0f766e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Bay Utilization & Workload</h2>
          <div className="grid gap-3">
            {stats.bays.map((bay) => (
              <div key={bay.id} className="flex items-center justify-between rounded-xl border border-line p-3">
                <div>
                  <p className="font-semibold">{bay.name}</p>
                  <p className="text-sm text-slate-500">{bay.type}</p>
                </div>
                <StatusBadge status={bay.status === "Busy" ? "Service Bay" : "Ready"} />
              </div>
            ))}
            {stats.mechanics.map((mechanic) => (
              <div key={mechanic.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <div>
                  <p className="font-semibold">{mechanic.name}</p>
                  <p className="text-sm text-slate-500">{mechanic.role}</p>
                </div>
                <span className="font-semibold">{mechanic.activeJobs} active</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
