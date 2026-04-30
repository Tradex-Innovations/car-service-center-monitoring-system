import { normalizePlate } from "@/lib/utils";
import { nextStep, progressForStep, workflowForPackage } from "@/lib/workflow";
import type { Customer, ServiceOrder, StatusLog, Vehicle } from "@/lib/types";

type DemoStore = {
  customers: Customer[];
  vehicles: Vehicle[];
  serviceItems: unknown[];
  servicePackages: unknown[];
  serviceOrders: ServiceOrder[];
  statusLogs: StatusLog[];
  mechanics: unknown[];
  bays: unknown[];
  settings: { tvPrivacyMode: string };
};

const staticMode = process.env.NEXT_PUBLIC_STATIC_DEMO === "true";
const storageKey = "car-service-center-demo-db";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export async function api<T>(url: string, init?: RequestInit): Promise<T> {
  if (staticMode && typeof window !== "undefined") {
    return staticApi<T>(url, init);
  }

  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }
  return response.json() as Promise<T>;
}

async function loadStore(): Promise<DemoStore> {
  const cached = window.localStorage.getItem(storageKey);
  if (cached) return hydrate(JSON.parse(cached) as DemoStore);

  const response = await fetch(`${basePath}/demo-db.json`);
  const data = (await response.json()) as DemoStore;
  saveStore(data);
  return hydrate(data);
}

function saveStore(data: DemoStore) {
  window.localStorage.setItem(storageKey, JSON.stringify(stripHydrated(data)));
}

function stripHydrated(data: DemoStore): DemoStore {
  return {
    ...data,
    vehicles: data.vehicles.map(({ customer: _customer, orders: _orders, ...vehicle }) => vehicle),
    serviceOrders: data.serviceOrders.map(({ vehicle: _vehicle, customer: _customer, selectedPackage: _selectedPackage, statusLogs: _logs, ...order }) => order)
  };
}

function hydrate(data: DemoStore): DemoStore {
  const customers = new Map(data.customers.map((customer) => [customer.id, customer]));
  const vehicles = new Map(data.vehicles.map((vehicle) => [vehicle.id, { ...vehicle, customer: customers.get(vehicle.customerId) }]));
  const packages = new Map(data.servicePackages.map((servicePackage) => [(servicePackage as { id: string }).id, servicePackage]));

  const serviceOrders = data.serviceOrders.map((order) => ({
    ...order,
    vehicle: vehicles.get(order.vehicleId),
    customer: customers.get(order.customerId),
    selectedPackage: order.selectedPackageId ? (packages.get(order.selectedPackageId) as ServiceOrder["selectedPackage"]) ?? null : null,
    statusLogs: data.statusLogs.filter((log) => log.serviceOrderId === order.id)
  }));

  const hydratedVehicles = data.vehicles.map((vehicle) => ({
    ...vehicle,
    customer: customers.get(vehicle.customerId),
    orders: serviceOrders.filter((order) => order.vehicleId === vehicle.id)
  }));

  return { ...data, vehicles: hydratedVehicles, serviceOrders };
}

async function staticApi<T>(url: string, init?: RequestInit): Promise<T> {
  const data = await loadStore();
  const method = (init?.method ?? "GET").toUpperCase();
  const body = init?.body ? JSON.parse(String(init.body)) : {};

  if (url === "/api/packages") {
    return { packages: data.servicePackages, items: data.serviceItems } as T;
  }

  if (url === "/api/settings" && method === "GET") {
    return data.settings as T;
  }

  if (url === "/api/settings" && method === "PUT") {
    data.settings.tvPrivacyMode = body.tvPrivacyMode ?? "masked";
    saveStore(data);
    return data.settings as T;
  }

  if (url === "/api/vehicles" && method === "GET") {
    return data.vehicles as T;
  }

  if (url === "/api/vehicles" && method === "POST") {
    const existing = data.vehicles.find((vehicle) => vehicle.normalizedPlateNumber === normalizePlate(body.plateNumber ?? ""));
    if (existing) return existing as T;
    const timestamp = new Date().toISOString();
    const customer: Customer = {
      id: demoId("cus"),
      name: body.customerName,
      phone: body.phone,
      email: body.email || null,
      createdAt: timestamp
    };
    const vehicle: Vehicle = {
      id: demoId("veh"),
      plateNumber: String(body.plateNumber).toUpperCase(),
      normalizedPlateNumber: normalizePlate(body.plateNumber),
      make: body.make,
      model: body.model,
      color: body.color,
      year: body.year ? Number(body.year) : null,
      customerId: customer.id,
      customer,
      orders: [],
      createdAt: timestamp,
      updatedAt: timestamp
    };
    data.customers.push(customer);
    data.vehicles.push(vehicle);
    saveStore(data);
    return hydrate(data).vehicles.find((item) => item.id === vehicle.id) as T;
  }

  if (url.startsWith("/api/vehicles/") && method === "GET") {
    const plate = decodeURIComponent(url.replace("/api/vehicles/", ""));
    const vehicle = data.vehicles.find((item) => item.normalizedPlateNumber === normalizePlate(plate));
    if (!vehicle) throw new Error("Vehicle not found");
    return vehicle as T;
  }

  if (url === "/api/orders" && method === "GET") {
    return data.serviceOrders.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)) as T;
  }

  if (url === "/api/orders" && method === "POST") {
    const vehicle = data.vehicles.find((item) => item.id === body.vehicleId);
    if (!vehicle) throw new Error("Vehicle not found");
    const servicePackage = data.servicePackages.find((item) => (item as { id: string }).id === body.selectedPackageId) as ServiceOrder["selectedPackage"];
    const timestamp = new Date().toISOString();
    const duration = Number(body.estimatedDurationMinutes ?? servicePackage?.estimatedDurationMinutes ?? 60);
    const order: ServiceOrder = {
      id: demoId("ord"),
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
    const log: StatusLog = {
      id: demoId("log"),
      serviceOrderId: order.id,
      fromStatus: "New",
      toStatus: "Waiting",
      note: "Service order created",
      changedBy: "Reception",
      changedAt: timestamp
    };
    data.serviceOrders.push(order);
    data.statusLogs.push(log);
    saveStore(data);
    return hydrate(data).serviceOrders.find((item) => item.id === order.id) as T;
  }

  const statusMatch = url.match(/^\/api\/orders\/(.+)\/status$/);
  if (statusMatch && method === "POST") {
    const orderId = statusMatch[1];
    const index = data.serviceOrders.findIndex((order) => order.id === orderId);
    if (index < 0) throw new Error("Order not found");
    const order = data.serviceOrders[index];
    const workflow = workflowForPackage(order.selectedPackage?.name);
    const targetStatus = body.status ?? nextStep(workflow, order.currentStep);
    const normalizedTarget = targetStatus === "Ready" ? "Ready for Delivery" : targetStatus;
    const completed = normalizedTarget === "Completed";
    const timestamp = new Date().toISOString();
    data.serviceOrders[index] = {
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
    data.statusLogs.push({
      id: demoId("log"),
      serviceOrderId: orderId,
      fromStatus: order.status,
      toStatus: normalizedTarget,
      note: body.note ?? null,
      changedBy: body.changedBy ?? "Mechanic",
      changedAt: timestamp
    });
    saveStore(data);
    return hydrate(data).serviceOrders.find((item) => item.id === orderId) as T;
  }

  if (url === "/api/stats") {
    const orders = data.serviceOrders;
    const active = orders.filter((order) => order.status !== "Completed");
    const completed = orders.filter((order) => order.status === "Completed" || order.completedAt);
    const delayed = active.filter((order) => new Date(order.estimatedFinishTime).getTime() < Date.now() && order.status !== "Ready for Delivery");
    const statusCounts = Object.entries(orders.reduce<Record<string, number>>((acc, order) => ({ ...acc, [order.status]: (acc[order.status] ?? 0) + 1 }), {})).map(([name, value]) => ({ name, value }));
    const categoryCounts = Object.entries(orders.reduce<Record<string, number>>((acc, order) => {
      const key = order.selectedPackage?.category ?? "Custom";
      return { ...acc, [key]: (acc[key] ?? 0) + 1 };
    }, {})).map(([name, value]) => ({ name, value }));
    return {
      kpis: {
        todaysJobs: orders.length,
        activeJobs: active.length,
        completedJobs: completed.length,
        averageServiceTime: "1h 42m",
        delayedJobs: delayed.length,
        revenueEstimate: orders.reduce((sum, order) => sum + order.totalPrice, 0)
      },
      statusCounts,
      categoryCounts,
      dailyCompleted: Array.from({ length: 7 }).map((_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - index));
        return { name: date.toLocaleDateString("en-LK", { weekday: "short" }), value: completed.length + Math.floor(Math.random() * 3) };
      }),
      packages: data.servicePackages,
      mechanics: data.mechanics,
      bays: data.bays
    } as T;
  }

  throw new Error(`Static demo route not implemented: ${url}`);
}

function demoId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}
