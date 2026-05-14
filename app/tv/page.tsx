"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock, Monitor } from "lucide-react";
import { Progress, StatusBadge } from "@/components/ui";
import { api } from "@/lib/api";
import { maskPlate, minutesRemaining } from "@/lib/utils";
import { nextStep, workflowForPackage } from "@/lib/workflow";
import type { ServiceOrder } from "@/lib/types";

export default function TvPage() {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [privacy, setPrivacy] = useState("masked");
  const [now, setNow] = useState(new Date());

  async function load() {
    const [jobs, settings] = await Promise.all([api<ServiceOrder[]>("/api/orders"), api<{ tvPrivacyMode: string }>("/api/settings")]);
    setOrders(jobs.filter((job) => job.status !== "Completed"));
    setPrivacy(settings.tvPrivacyMode);
  }

  useEffect(() => {
    load();
    const interval = setInterval(() => {
      setNow(new Date());
      load();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const sections = useMemo(
    () => [
      ["Now Servicing", orders.filter((job) => !["Waiting", "Ready for Delivery"].includes(job.status) && job.progressPercentage < 80)],
      ["Waiting Queue", orders.filter((job) => job.status === "Waiting")],
      ["Almost Ready", orders.filter((job) => job.progressPercentage >= 80 && job.status !== "Ready for Delivery")],
      ["Ready for Delivery", orders.filter((job) => job.status === "Ready for Delivery")]
    ] as const,
    [orders]
  );

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f8fbff,#edf4ff_48%,#f8fafc)] p-4 text-ink sm:p-8">
      <header className="glass-panel mb-8 flex flex-col justify-between gap-5 rounded-[32px] p-5 sm:p-6 lg:flex-row lg:items-center">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[24px] bg-gradient-to-br from-[#111827] to-[#334155] text-white shadow-soft">
            <Monitor className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">Service Center Live Vehicle Status</h1>
            <p className="mt-2 text-xl text-slate-500">Updated every few seconds</p>
          </div>
        </div>
        <div className="text-left text-2xl font-semibold lg:text-right">
          <p>{now.toLocaleDateString("en-LK", { weekday: "long", month: "long", day: "numeric" })}</p>
          <p className="text-slate-500">{now.toLocaleTimeString("en-LK", { hour: "2-digit", minute: "2-digit" })}</p>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-4">
        {sections.map(([title, jobs]) => (
          <section key={title} className="glass-panel rounded-[32px] p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">{title}</h2>
              <span className="rounded-full border border-white/55 bg-white/28 px-3 py-1 text-lg font-semibold shadow-inner backdrop-blur-xl">{jobs.length}</span>
            </div>
            <div className="space-y-4">
              {jobs.map((job, index) => {
                const workflow = workflowForPackage(job.selectedPackage?.name);
                const plate = privacy === "job" ? job.orderNumber : maskPlate(job.vehicle?.plateNumber ?? "", privacy);
                return (
                  <div key={job.id} className="glass-surface rounded-[24px] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-4xl font-semibold tracking-tight">{plate}</p>
                        <p className="mt-2 text-xl text-slate-500">Queue #{index + 1}</p>
                      </div>
                      <StatusBadge status={job.status} />
                    </div>
                    <div className="mt-5">
                      <div className="mb-3 flex justify-between text-lg font-semibold">
                        <span>{job.progressPercentage}% complete</span>
                        <span className="flex items-center gap-2 text-slate-500">
                          <Clock className="h-5 w-5" />
                          {minutesRemaining(job.estimatedFinishTime)} min
                        </span>
                      </div>
                      <Progress value={job.progressPercentage} />
                    </div>
                    <p className="mt-4 text-xl text-slate-600">Next: {nextStep(workflow, job.currentStep)}</p>
                  </div>
                );
              })}
              {!jobs.length ? <p className="glass-surface rounded-[24px] p-6 text-center text-lg text-slate-500">No vehicles in this lane</p> : null}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
