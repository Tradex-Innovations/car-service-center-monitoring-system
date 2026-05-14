"use client";

import { useEffect, useState } from "react";
import { PackagePlus, Trash2 } from "lucide-react";
import { Button, Card, Input, PageHeader, Select, Textarea } from "@/components/ui";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { ServicePackage } from "@/lib/types";

export default function SettingsPage() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [privacy, setPrivacy] = useState("masked");
  const [draft, setDraft] = useState({ name: "", category: "", description: "", estimatedDurationMinutes: "60", basePrice: "7500" });

  useEffect(() => {
    api<{ packages: ServicePackage[] }>("/api/packages").then((data) => setPackages(data.packages));
    api<{ tvPrivacyMode: string }>("/api/settings").then((data) => setPrivacy(data.tvPrivacyMode));
  }, []);

  async function savePrivacy(value: string) {
    setPrivacy(value);
    await api("/api/settings", { method: "PUT", body: JSON.stringify({ tvPrivacyMode: value }) });
  }

  function addLocalPackage() {
    if (!draft.name) return;
    setPackages([
      ...packages,
      {
        id: crypto.randomUUID(),
        includedItemIds: "[]",
        name: draft.name,
        category: draft.category || "Custom",
        description: draft.description || "Prototype package",
        estimatedDurationMinutes: Number(draft.estimatedDurationMinutes),
        basePrice: Number(draft.basePrice)
      }
    ]);
    setDraft({ name: "", category: "", description: "", estimatedDurationMinutes: "60", basePrice: "7500" });
  }

  return (
    <>
      <PageHeader title="Settings" eyebrow="Prototype configuration" />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Service Packages</h2>
              <p className="mt-1 text-sm text-slate-500">Visual add/edit/delete prototype. Seeded packages are stored in SQLite.</p>
            </div>
            <PackagePlus className="h-5 w-5 text-slate-500" />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {packages.map((servicePackage) => (
              <div key={servicePackage.id} className="glass-surface rounded-[24px] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{servicePackage.name}</p>
                    <p className="text-sm text-slate-500">{servicePackage.category}</p>
                  </div>
                  <button onClick={() => setPackages(packages.filter((item) => item.id !== servicePackage.id))} className="rounded-xl p-2 transition hover:bg-white/28">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-500">{servicePackage.description}</p>
                <p className="mt-3 text-sm font-semibold">
                  {servicePackage.estimatedDurationMinutes} min · {formatCurrency(servicePackage.basePrice)}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold">Add Package</h2>
            <div className="mt-4 space-y-3">
              <Input placeholder="Package name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              <Input placeholder="Category" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
              <Textarea placeholder="Description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
              <Input type="number" placeholder="Duration" value={draft.estimatedDurationMinutes} onChange={(e) => setDraft({ ...draft, estimatedDurationMinutes: e.target.value })} />
              <Input type="number" placeholder="Price" value={draft.basePrice} onChange={(e) => setDraft({ ...draft, basePrice: e.target.value })} />
              <Button className="w-full" onClick={addLocalPackage}>
                Add visually
              </Button>
            </div>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold">TV Privacy</h2>
            <Select className="mt-4" value={privacy} onChange={(e) => savePrivacy(e.target.value)}>
              <option value="full">Show full plate</option>
              <option value="masked">Mask plate like ABC-***4</option>
              <option value="job">Show job number only</option>
            </Select>
          </Card>
        </div>
      </div>
    </>
  );
}
