"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, CheckCircle2, Loader2, Upload } from "lucide-react";
import { Button, Card, Input, PageHeader } from "@/components/ui";
import { detectPlateFromImage } from "@/lib/anpr";
import { api } from "@/lib/api";
import type { Vehicle } from "@/lib/types";

type Detection = { plateNumber: string; confidence: number; provider: string; detectedAt: string };

export default function CheckInPage() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [detection, setDetection] = useState<Detection | null>(null);
  const [plate, setPlate] = useState("");
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState({ customerName: "", phone: "", make: "", model: "", color: "", odometer: "" });

  async function detectPlate() {
    setDetecting(true);
    const result = (await detectPlateFromImage(file)) as Detection;
    setDetection(result);
    setPlate(result.plateNumber);
    setDetecting(false);
  }

  async function confirmPlate() {
    setSaving(true);
    setVehicle(null);
    setNotFound(false);
    try {
      setVehicle(await api<Vehicle>(`/api/vehicles/${encodeURIComponent(plate)}`));
    } catch {
      setNotFound(true);
    }
    setSaving(false);
  }

  async function saveNewVehicle() {
    setSaving(true);
    const saved = await api<Vehicle>("/api/vehicles", {
      method: "POST",
      body: JSON.stringify({ ...form, plateNumber: plate })
    });
    router.push(`/service-selection?plate=${encodeURIComponent(saved.plateNumber)}&odometer=${form.odometer}`);
  }

  return (
    <>
      <PageHeader title="Vehicle Arrival Check-In" eyebrow="Reception tablet" />
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Plate Capture</h2>
              <p className="mt-1 text-sm text-slate-500">Upload a vehicle photo or use the camera simulation for the demo.</p>
            </div>
            <Camera className="h-6 w-6 text-slate-500" />
          </div>
          <label className="mt-5 grid min-h-72 cursor-pointer place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Vehicle preview" className="max-h-72 rounded-2xl object-contain" />
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-3 font-medium">Choose vehicle image</p>
                <p className="text-sm text-slate-500">Any image works for the mock ANPR pipeline</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const selected = event.target.files?.[0] ?? null;
                setFile(selected);
                setPreview(selected ? URL.createObjectURL(selected) : null);
              }}
            />
          </label>
          <Button className="mt-5 w-full" onClick={detectPlate} disabled={detecting}>
            {detecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            Detect Plate
          </Button>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Confirm Plate</h2>
          {detection ? (
            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">{detection.provider}</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight">{detection.plateNumber}</p>
              <p className="mt-1 text-sm font-medium text-emerald-700">{detection.confidence}% confidence</p>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">Detected plate details will appear here.</div>
          )}
          <div className="mt-5 space-y-3">
            <Input placeholder="Plate number" value={plate} onChange={(event) => setPlate(event.target.value.toUpperCase())} />
            <Button className="w-full" onClick={confirmPlate} disabled={!plate || saving}>
              <CheckCircle2 className="h-4 w-4" />
              Confirm Plate
            </Button>
          </div>

          {vehicle ? (
            <div className="mt-5 rounded-2xl border border-line p-4">
              <p className="font-semibold">Existing vehicle found</p>
              <p className="mt-1 text-sm text-slate-500">
                {vehicle.make} {vehicle.model} in {vehicle.color}, customer {vehicle.customer?.name}
              </p>
              <p className="mt-2 text-sm text-slate-500">Previous visits: {vehicle.orders?.length ?? 0}</p>
              <Button className="mt-4 w-full" onClick={() => router.push(`/service-selection?plate=${encodeURIComponent(vehicle.plateNumber)}`)}>
                Continue to Services
              </Button>
            </div>
          ) : null}

          {notFound ? (
            <div className="mt-5 space-y-3 rounded-2xl border border-line p-4">
              <p className="font-semibold">New Vehicle</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="Customer name" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
                <Input placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <Input placeholder="Vehicle make" value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} />
                <Input placeholder="Vehicle model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
                <Input placeholder="Color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
                <Input placeholder="Odometer reading" type="number" value={form.odometer} onChange={(e) => setForm({ ...form, odometer: e.target.value })} />
              </div>
              <Button className="w-full" onClick={saveNewVehicle} disabled={saving}>
                Save Vehicle and Continue
              </Button>
            </div>
          ) : null}
        </Card>
      </div>
    </>
  );
}
