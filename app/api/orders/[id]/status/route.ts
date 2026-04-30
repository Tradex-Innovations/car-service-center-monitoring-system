import { NextResponse } from "next/server";
import { nextStep, progressForStep, workflowForPackage } from "@/lib/workflow";
import { readStore, writeStore } from "@/lib/store";
import type { StatusLog } from "@/lib/types";

const id = (prefix: string) => `${prefix}_${crypto.randomUUID().slice(0, 8)}`;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: orderId } = await params;
  const body = await request.json();
  const data = readStore();
  const index = data.serviceOrders.findIndex((order) => order.id === orderId);
  if (index < 0) return new NextResponse("Order not found", { status: 404 });
  const order = data.serviceOrders[index];
  const workflow = workflowForPackage(order.selectedPackage?.name);
  const targetStatus = body.status ?? nextStep(workflow, order.currentStep);
  const normalizedTarget = targetStatus === "Ready" ? "Ready for Delivery" : targetStatus;
  const completed = normalizedTarget === "Completed";
  const timestamp = new Date().toISOString();
  const updated = {
    ...order,
    status: normalizedTarget,
    currentStep: targetStatus,
    progressPercentage: completed || normalizedTarget === "Ready for Delivery" ? 100 : progressForStep(workflow, targetStatus),
    actualStartTime: order.actualStartTime ?? timestamp,
    actualFinishTime: completed ? timestamp : null,
    completedAt: completed ? timestamp : null,
    updatedAt: timestamp,
    notes: body.note ? [order.notes, body.note].filter(Boolean).join("\n") : order.notes
  };
  const log: StatusLog = {
    id: id("log"),
    serviceOrderId: orderId,
    fromStatus: order.status,
    toStatus: normalizedTarget,
    note: body.note ?? null,
    changedBy: body.changedBy ?? "Mechanic",
    changedAt: timestamp
  };
  data.serviceOrders[index] = updated;
  data.statusLogs.push(log);
  writeStore(data);
  return NextResponse.json(readStore().serviceOrders.find((item) => item.id === orderId));
}
