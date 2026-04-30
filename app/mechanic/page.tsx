"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, MessageSquare, Play } from "lucide-react";
import { Button, Card, PageHeader, Progress, StatusBadge, Textarea } from "@/components/ui";
import { api } from "@/lib/api";
import { kanbanStatuses, nextStep, workflowForPackage } from "@/lib/workflow";
import type { ServiceOrder } from "@/lib/types";

export default function MechanicPage() {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [note, setNote] = useState<Record<string, string>>({});

  async function load() {
    setOrders(await api<ServiceOrder[]>("/api/orders"));
  }

  useEffect(() => {
    load();
  }, []);

  async function move(order: ServiceOrder, explicitStatus?: string, delay?: boolean) {
    await api(`/api/orders/${order.id}/status`, {
      method: "POST",
      body: JSON.stringify({
        status: delay ? "Delayed" : explicitStatus,
        note: note[order.id] ?? (delay ? "Marked as delayed" : undefined),
        changedBy: order.assignedMechanic
      })
    });
    setNote({ ...note, [order.id]: "" });
    await load();
  }

  const grouped = useMemo(() => {
    const groups: Record<string, ServiceOrder[]> = {};
    kanbanStatuses.forEach((status) => (groups[status] = []));
    orders.forEach((order) => {
      const key = order.status === "Ready for Delivery" ? "Ready" : order.status === "Final Quality Check" ? "Final Check" : order.status;
      if (groups[key]) groups[key].push(order);
    });
    return groups;
  }, [orders]);

  return (
    <>
      <PageHeader title="Mechanic Tablet Board" eyebrow="Live workflow control" />
      <div className="flex gap-4 overflow-x-auto pb-4">
        {kanbanStatuses.map((status) => (
          <div key={status} className="min-w-[320px] flex-1">
            <div className="mb-3 flex items-center justify-between">
              <StatusBadge status={status === "Ready" ? "Ready for Delivery" : status} />
              <span className="text-sm font-semibold text-slate-500">{grouped[status]?.length ?? 0}</span>
            </div>
            <div className="space-y-3">
              {(grouped[status] ?? []).map((order) => {
                const workflow = workflowForPackage(order.selectedPackage?.name);
                const next = nextStep(workflow, order.currentStep);
                return (
                  <Card key={order.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold">{order.vehicle?.plateNumber}</p>
                        <p className="text-sm text-slate-500">
                          {order.vehicle?.color} {order.vehicle?.make} {order.vehicle?.model}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold">{order.priority}</span>
                    </div>
                    <p className="mt-3 text-sm font-medium">{order.selectedPackage?.name ?? "Custom service"}</p>
                    <p className="mt-1 text-sm text-slate-500">Next: {next}</p>
                    <div className="mt-3">
                      <Progress value={order.progressPercentage} />
                    </div>
                    <Textarea
                      className="mt-3 min-h-16"
                      placeholder="Add note"
                      value={note[order.id] ?? ""}
                      onChange={(event) => setNote({ ...note, [order.id]: event.target.value })}
                    />
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Button variant="secondary" onClick={() => move(order, order.status)}>
                        <Play className="h-4 w-4" />
                        Start
                      </Button>
                      <Button variant="secondary" onClick={() => move(order, next)}>
                        <CheckCircle2 className="h-4 w-4" />
                        Complete
                      </Button>
                      <Button variant="secondary" onClick={() => move(order, undefined)}>
                        <MessageSquare className="h-4 w-4" />
                        Move Next
                      </Button>
                      <Button variant="danger" onClick={() => move(order, undefined, true)}>
                        <AlertTriangle className="h-4 w-4" />
                        Delay
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
