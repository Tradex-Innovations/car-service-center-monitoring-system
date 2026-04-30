import { NextResponse } from "next/server";
import { readStore, writeStore } from "@/lib/store";
import type { ServiceOrder, StatusLog } from "@/lib/types";

const id = (prefix: string) => `${prefix}_${crypto.randomUUID().slice(0, 8)}`;

export async function GET() {
  return NextResponse.json(readStore().serviceOrders.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)));
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = readStore();
  const vehicle = data.vehicles.find((item) => item.id === body.vehicleId);
  if (!vehicle) return new NextResponse("Vehicle not found", { status: 404 });
  const servicePackage = data.servicePackages.find((item) => item.id === body.selectedPackageId) ?? null;
  const duration = Number(body.estimatedDurationMinutes ?? servicePackage?.estimatedDurationMinutes ?? 60);
  const timestamp = new Date().toISOString();
  const order: ServiceOrder = {
    id: id("ord"),
    orderNumber: `JOB-${Math.floor(1000 + Math.random() * 8999)}`,
    vehicleId: vehicle.id,
    customerId: vehicle.customerId,
    selectedPackageId: servicePackage?.id ?? null,
    selectedItemIds: JSON.stringify(body.selectedItemIds ?? []),
    status: "Waiting",
    currentStep: "Waiting",
    progressPercentage: 0,
    priority: body.priority ?? "Normal",
    assignedMechanic: body.assignedMechanic ?? "Saman",
    bay: body.bay ?? null,
    odometer: body.odometer ? Number(body.odometer) : null,
    notes: body.notes ?? null,
    estimatedStartTime: timestamp,
    estimatedFinishTime: new Date(Date.now() + duration * 60000).toISOString(),
    actualStartTime: null,
    actualFinishTime: null,
    totalPrice: Number(body.totalPrice ?? servicePackage?.basePrice ?? 0),
    createdAt: timestamp,
    updatedAt: timestamp,
    completedAt: null,
    vehicle,
    customer: vehicle.customer,
    selectedPackage: servicePackage,
    statusLogs: []
  };
  const log: StatusLog = { id: id("log"), serviceOrderId: order.id, fromStatus: "New", toStatus: "Waiting", note: "Service order created", changedBy: "Reception", changedAt: timestamp };
  data.serviceOrders.push(order);
  data.statusLogs.push(log);
  writeStore(data);
  return NextResponse.json({ ...order, statusLogs: [log] });
}
