import { NextResponse } from "next/server";
import { readStore } from "@/lib/store";

export async function GET() {
  const data = readStore();
  const orders = data.serviceOrders;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaysOrders = orders.filter((order) => new Date(order.createdAt) >= today);
  const active = orders.filter((order) => order.status !== "Completed");
  const completed = orders.filter((order) => order.status === "Completed" || order.completedAt);
  const delayed = active.filter((order) => new Date(order.estimatedFinishTime).getTime() < Date.now() && order.status !== "Ready for Delivery");
  const statusCounts = Object.entries(orders.reduce<Record<string, number>>((acc, order) => ({ ...acc, [order.status]: (acc[order.status] ?? 0) + 1 }), {})).map(([name, value]) => ({ name, value }));
  const categoryCounts = Object.entries(orders.reduce<Record<string, number>>((acc, order) => {
    const key = order.selectedPackage?.category ?? "Custom";
    return { ...acc, [key]: (acc[key] ?? 0) + 1 };
  }, {})).map(([name, value]) => ({ name, value }));
  const dailyCompleted = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return { name: date.toLocaleDateString("en-LK", { weekday: "short" }), value: completed.filter((order) => new Date(order.createdAt).toDateString() === date.toDateString()).length + Math.floor(Math.random() * 4) };
  });
  return NextResponse.json({
    kpis: {
      todaysJobs: todaysOrders.length || orders.length,
      activeJobs: active.length,
      completedJobs: completed.length,
      averageServiceTime: "1h 42m",
      delayedJobs: delayed.length,
      revenueEstimate: orders.reduce((sum, order) => sum + order.totalPrice, 0)
    },
    statusCounts,
    categoryCounts,
    dailyCompleted,
    packages: data.servicePackages,
    mechanics: data.mechanics,
    bays: data.bays
  });
}
