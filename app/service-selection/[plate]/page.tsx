"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Check, PlusCircle } from "lucide-react";
import { Button, Card, PageHeader, StatusBadge } from "@/components/ui";
import { api } from "@/lib/api";
import { cn, formatCurrency } from "@/lib/utils";
import type { ServiceItem, ServicePackage, Vehicle } from "@/lib/types";

export default function ServiceSelectionPage() {
  const params = useParams<{ plate: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    api<Vehicle>(`/api/vehicles/${encodeURIComponent(params.plate)}`).then(setVehicle);
    api<{ packages: ServicePackage[]; items: ServiceItem[] }>("/api/packages").then((data) => {
      setPackages(data.packages);
      setItems(data.items);
    });
  }, [params.plate]);

  const total = useMemo(() => {
    const itemTotal = items.filter((item) => selectedItems.includes(item.id)).reduce((sum, item) => sum + item.price, 0);
    return selectedPackage ? Math.max(selectedPackage.basePrice, itemTotal) : itemTotal;
  }, [items, selectedItems, selectedPackage]);

  const duration = useMemo(() => {
    const itemDuration = items.filter((item) => selectedItems.includes(item.id)).reduce((sum, item) => sum + item.estimatedDurationMinutes, 0);
    return selectedPackage ? Math.max(selectedPackage.estimatedDurationMinutes, itemDuration) : itemDuration;
  }, [items, selectedItems, selectedPackage]);

  async function createOrder() {
    if (!vehicle) return;
    setCreating(true);
    await api("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        vehicleId: vehicle.id,
        selectedPackageId: selectedPackage?.id,
        selectedItemIds: selectedItems,
        estimatedDurationMinutes: duration,
        totalPrice: total,
        odometer: search.get("odometer")
      })
    });
    router.push("/jobs");
  }

  return (
    <>
      <PageHeader title="Service Selection" eyebrow={vehicle ? `${vehicle.plateNumber} · ${vehicle.make} ${vehicle.model}` : "Loading vehicle"} />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-lg font-semibold">Packages</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {packages.map((servicePackage) => {
                const included = JSON.parse(servicePackage.includedItemIds) as string[];
                const active = selectedPackage?.id === servicePackage.id;
                return (
                  <button
                    key={servicePackage.id}
                    onClick={() => {
                      setSelectedPackage(servicePackage);
                      setSelectedItems(included);
                    }}
                    className={cn(
                      "rounded-2xl border bg-white p-5 text-left shadow-soft transition hover:-translate-y-0.5",
                      active ? "border-ink ring-2 ring-ink/10" : "border-line"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <StatusBadge status={servicePackage.category} />
                        <h3 className="mt-3 text-lg font-semibold">{servicePackage.name}</h3>
                      </div>
                      {active ? <Check className="h-5 w-5" /> : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{servicePackage.description}</p>
                    <div className="mt-4 flex justify-between text-sm font-semibold">
                      <span>{servicePackage.estimatedDurationMinutes} min</span>
                      <span>{formatCurrency(servicePackage.basePrice)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">Custom Items & Add-ons</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {items.map((item) => {
                const checked = selectedItems.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItems(checked ? selectedItems.filter((id) => id !== item.id) : [...selectedItems, item.id])}
                    className={cn("flex items-center justify-between rounded-xl border border-line bg-white p-4 text-left", checked && "border-ink bg-slate-50")}
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.category}</p>
                    </div>
                    <p className="text-sm font-semibold">{formatCurrency(item.price)}</p>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <Card className="h-fit lg:sticky lg:top-6">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Package</span>
              <span className="font-medium">{selectedPackage?.name ?? "Custom"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Selected items</span>
              <span className="font-medium">{selectedItems.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Estimated time</span>
              <span className="font-medium">{duration || 0} min</span>
            </div>
            <div className="border-t border-line pt-4">
              <p className="text-sm text-slate-500">Estimated price</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight">{formatCurrency(total)}</p>
            </div>
          </div>
          <Button className="mt-5 w-full" disabled={!selectedItems.length || creating} onClick={createOrder}>
            <PlusCircle className="h-4 w-4" />
            Create Service Order
          </Button>
        </Card>
      </div>
    </>
  );
}
