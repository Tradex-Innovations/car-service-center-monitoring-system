"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Card, EmptyState, Input, PageHeader, Progress, Select, StatusBadge } from "@/components/ui";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import type { ServiceOrder } from "@/lib/types";

export default function JobsPage() {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    api<ServiceOrder[]>("/api/orders").then(setOrders);
  }, []);

  const filtered = useMemo(
    () =>
      orders.filter((order) => {
        const haystack = `${order.orderNumber} ${order.vehicle?.plateNumber} ${order.vehicle?.make} ${order.customer?.name} ${order.assignedMechanic} ${order.selectedPackage?.name}`.toLowerCase();
        return haystack.includes(query.toLowerCase()) && (status === "All" || order.status === status);
      }),
    [orders, query, status]
  );

  return (
    <>
      <PageHeader title="Active Jobs Dashboard" eyebrow="Advisor operations" />
      <Card className="mb-5">
        <div className="grid gap-3 md:grid-cols-[1fr_240px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <Input className="pl-9" placeholder="Search plate, job, customer, package, mechanic" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>All</option>
            {[...new Set(orders.map((order) => order.status))].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </div>
      </Card>

      <div className="grid gap-4">
        {filtered.length ? (
          filtered.map((order) => (
            <Card key={order.id}>
              <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1fr_1.2fr] lg:items-center">
                <div>
                  <p className="font-semibold">{order.orderNumber}</p>
                  <p className="text-sm text-slate-500">{order.vehicle?.plateNumber}</p>
                </div>
                <div>
                  <p className="font-medium">
                    {order.vehicle?.make} {order.vehicle?.model}
                  </p>
                  <p className="text-sm text-slate-500">{order.customer?.name}</p>
                </div>
                <div>
                  <StatusBadge status={order.status} />
                  <p className="mt-2 text-sm text-slate-500">{order.selectedPackage?.name ?? "Custom"}</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">{order.assignedMechanic}</p>
                  <p className="text-slate-500">Priority: {order.priority}</p>
                  <p className="text-slate-500">ETA: {formatDateTime(order.estimatedFinishTime)}</p>
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-sm font-medium">
                    <span>Progress</span>
                    <span>{order.progressPercentage}%</span>
                  </div>
                  <Progress value={order.progressPercentage} />
                </div>
              </div>
            </Card>
          ))
        ) : (
          <EmptyState title="No jobs found" body="Try a different search or status filter." />
        )}
      </div>
    </>
  );
}
