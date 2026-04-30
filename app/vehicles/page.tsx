"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Card, EmptyState, Input, PageHeader, Progress, StatusBadge } from "@/components/ui";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import type { Vehicle } from "@/lib/types";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Vehicle | null>(null);

  useEffect(() => {
    api<Vehicle[]>("/api/vehicles").then((data) => {
      setVehicles(data);
      setSelected(data[0] ?? null);
    });
  }, []);

  const filtered = useMemo(
    () =>
      vehicles.filter((vehicle) =>
        `${vehicle.plateNumber} ${vehicle.make} ${vehicle.model} ${vehicle.color} ${vehicle.customer?.name}`.toLowerCase().includes(query.toLowerCase())
      ),
    [vehicles, query]
  );

  return (
    <>
      <PageHeader title="Vehicle History" eyebrow="Plate-based service record" />
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="h-fit">
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <Input className="pl-9" placeholder="Search by plate" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="space-y-2">
            {filtered.map((vehicle) => (
              <button
                key={vehicle.id}
                className="w-full rounded-xl border border-line p-3 text-left transition hover:bg-slate-50"
                onClick={() => setSelected(vehicle)}
              >
                <p className="font-semibold">{vehicle.plateNumber}</p>
                <p className="text-sm text-slate-500">
                  {vehicle.make} {vehicle.model} · {vehicle.customer?.name}
                </p>
              </button>
            ))}
          </div>
        </Card>

        {selected ? (
          <div className="space-y-5">
            <Card>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <p className="text-sm text-slate-500">Plate</p>
                  <p className="text-3xl font-semibold">{selected.plateNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Vehicle</p>
                  <p className="font-semibold">
                    {selected.color} {selected.make} {selected.model}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Customer</p>
                  <p className="font-semibold">{selected.customer?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total visits</p>
                  <p className="text-3xl font-semibold">{selected.orders?.length ?? 0}</p>
                </div>
              </div>
            </Card>

            {(selected.orders ?? []).map((order) => (
              <Card key={order.id}>
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                  <div>
                    <p className="text-lg font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-slate-500">
                      {order.selectedPackage?.name ?? "Custom service"} · {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="mt-4">
                  <Progress value={order.progressPercentage} />
                </div>
                <div className="mt-5 space-y-3">
                  {(order.statusLogs ?? []).map((log) => (
                    <div key={log.id} className="border-l-2 border-slate-200 pl-4">
                      <p className="font-medium">
                        {log.fromStatus} to {log.toStatus}
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatDateTime(log.changedAt)} by {log.changedBy}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState title="No vehicle selected" body="Search and select a plate to view its service timeline." />
        )}
      </div>
    </>
  );
}
