import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { normalizePlate } from "@/lib/utils";
import { progressForStep, workflowForPackage } from "@/lib/workflow";
import type { Customer, ServiceItem, ServiceOrder, ServicePackage, StatusLog, Vehicle } from "@/lib/types";

type Mechanic = { id: string; name: string; role: string; activeJobs: number };
type Bay = { id: string; name: string; type: string; status: string };
export type Store = {
  customers: Customer[];
  vehicles: Vehicle[];
  serviceItems: ServiceItem[];
  servicePackages: ServicePackage[];
  serviceOrders: ServiceOrder[];
  statusLogs: StatusLog[];
  mechanics: Mechanic[];
  bays: Bay[];
  settings: { tvPrivacyMode: string };
};

const dbPath = path.join(process.cwd(), "data", "db.json");

function id(prefix: string) {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

function now(offsetMinutes = 0) {
  return new Date(Date.now() + offsetMinutes * 60000).toISOString();
}

export function createSeedData(): Store {
  const serviceItems: ServiceItem[] = [
    ["Exterior wash", "Quick Wash", 20, 1800, "Foam wash and rinse"],
    ["Drying", "Quick Wash", 10, 600, "Microfiber body drying"],
    ["Tyre shine", "Tyre & Wheel Service", 10, 700, "Tyre sidewall finishing"],
    ["Interior vacuum", "Interior Cleaning", 20, 1600, "Cabin and carpet vacuum"],
    ["Dashboard wipe", "Interior Cleaning", 10, 850, "Interior surface wipe down"],
    ["Floor mat cleaning", "Interior Cleaning", 15, 900, "Mat wash and dry"],
    ["Engine oil check/change", "Oil Change", 35, 8500, "Oil condition check and change"],
    ["Oil filter check", "Oil Change", 10, 1600, "Inspect oil filter condition"],
    ["Engine oil change", "Oil Change", 35, 9500, "Drain and replace engine oil"],
    ["Oil filter replacement", "Oil Change", 15, 2400, "Replace oil filter"],
    ["Air filter check", "Normal Service", 10, 1000, "Inspect and clean air filter"],
    ["Cabin filter check", "Full Service", 10, 1200, "Inspect cabin filter"],
    ["Fluid level check", "Normal Service", 10, 800, "Check brake, coolant, and washer fluids"],
    ["Tyre pressure check", "Tyre & Wheel Service", 10, 500, "Set tyre pressure"],
    ["Brake inspection", "Brake Inspection", 25, 3200, "Inspect pads, discs, and fluid"],
    ["Coolant check", "Full Service", 10, 900, "Coolant level and leak check"],
    ["Battery check", "Diagnostic Scan", 10, 850, "Battery health test"],
    ["Diagnostic scan", "Diagnostic Scan", 25, 4500, "OBD diagnostic report"],
    ["Interior deep vacuum", "Interior Cleaning", 30, 2600, "Detailed cabin vacuuming"],
    ["Seat cleaning", "Interior Cleaning", 35, 3600, "Seat shampoo and wipe"],
    ["Dashboard polish", "Interior Cleaning", 15, 1400, "Interior polish application"],
    ["Final quality check", "Full Service", 15, 1100, "Supervisor checklist"]
  ].map(([name, category, estimatedDurationMinutes, price, description]) => ({
    id: id("item"),
    name: String(name),
    category: String(category),
    estimatedDurationMinutes: Number(estimatedDurationMinutes),
    price: Number(price),
    description: String(description)
  }));
  const byName = new Map(serviceItems.map((item) => [item.name, item.id]));
  const itemIds = (names: string[]) => JSON.stringify(names.map((name) => byName.get(name)).filter(Boolean));
  const servicePackages: ServicePackage[] = [
    ["Quick Car Wash", "Quick Wash", "Fast exterior refresh for daily-drive vehicles.", 35, 2800, ["Exterior wash", "Drying", "Tyre shine"]],
    ["Wash + Vacuum", "Interior Cleaning", "Exterior wash with a practical cabin clean.", 65, 5800, ["Exterior wash", "Interior vacuum", "Dashboard wipe", "Floor mat cleaning"]],
    ["Normal Service", "Normal Service", "Routine maintenance with oil, fluids, filters, tyres, and wash.", 130, 18500, ["Engine oil check/change", "Oil filter check", "Air filter check", "Fluid level check", "Tyre pressure check", "Exterior wash"]],
    ["Full Service", "Full Service", "Comprehensive scheduled service with diagnostics and finishing.", 210, 38500, ["Engine oil change", "Oil filter replacement", "Air filter check", "Cabin filter check", "Brake inspection", "Coolant check", "Battery check", "Diagnostic scan", "Exterior wash", "Interior vacuum", "Final quality check"]],
    ["Premium Detail", "Interior Cleaning", "Presentation-focused detail for handover-ready vehicles.", 160, 24500, ["Exterior wash", "Interior deep vacuum", "Seat cleaning", "Dashboard polish", "Tyre shine", "Final quality check"]]
  ].map(([name, category, description, estimatedDurationMinutes, basePrice, included]) => ({
    id: id("pkg"),
    name: String(name),
    category: String(category),
    description: String(description),
    estimatedDurationMinutes: Number(estimatedDurationMinutes),
    basePrice: Number(basePrice),
    includedItemIds: itemIds(included as string[])
  }));
  const customers: Customer[] = [
    ["Nimal Perera", "0771234567"],
    ["Kasun Silva", "0715588001"],
    ["Amanda Fernando", "0764441199"],
    ["Ruwan Jayasinghe", "0752244668"],
    ["Chamath Wijesinghe", "0729854100"]
  ].map(([name, phone]) => ({ id: id("cus"), name, phone, createdAt: now() }));
  const vehicles: Vehicle[] = [
    ["CAB-4589", "Toyota", "Corolla", "White"],
    ["WP-CAR-2211", "Toyota", "Aqua", "Silver"],
    ["ABC-1234", "Honda", "Vezel", "Black"],
    ["CAA-7788", "Suzuki", "Swift", "Red"],
    ["KI-9090", "Nissan", "Leaf", "Blue"]
  ].map(([plateNumber, make, model, color], index) => ({
    id: id("veh"),
    plateNumber,
    normalizedPlateNumber: normalizePlate(plateNumber),
    make,
    model,
    color,
    customerId: customers[index].id,
    customer: customers[index],
    createdAt: now(),
    updatedAt: now()
  }));
  const jobs = [
    [vehicles[0], servicePackages[1], "Washing Bay", 60, "Saman", "Bay 01", "Normal"],
    [vehicles[2], servicePackages[3], "Oil Change", 45, "Lahiru", "Bay 02", "High"],
    [vehicles[1], servicePackages[2], "Waiting", 10, "Dilan", null, "Normal"],
    [vehicles[3], servicePackages[4], "Final Check", 85, "Pradeep", "Detail Bay", "Normal"],
    [vehicles[4], servicePackages[0], "Ready for Delivery", 100, "Saman", "Wash Bay", "High"]
  ] as const;
  const statusLogs: StatusLog[] = [];
  const serviceOrders: ServiceOrder[] = jobs.map(([vehicle, selectedPackage, status, seedProgress, mechanic, bay, priority], index) => {
    const workflow = workflowForPackage(selectedPackage.name);
    const createdAt = now(-(index + 1) * 43);
    const order: ServiceOrder = {
      id: id("ord"),
      orderNumber: `JOB-${String(1024 + index).padStart(4, "0")}`,
      vehicleId: vehicle.id,
      customerId: vehicle.customerId,
      selectedPackageId: selectedPackage.id,
      selectedItemIds: selectedPackage.includedItemIds,
      status,
      currentStep: status,
      progressPercentage: status === "Ready for Delivery" ? 100 : Math.max(seedProgress, progressForStep(workflow, status)),
      priority,
      assignedMechanic: mechanic,
      bay,
      odometer: 35000 + index * 12400,
      notes: "Seeded demo job",
      estimatedStartTime: createdAt,
      estimatedFinishTime: now(selectedPackage.estimatedDurationMinutes - index * 12),
      actualStartTime: status === "Waiting" ? null : createdAt,
      actualFinishTime: null,
      totalPrice: selectedPackage.basePrice,
      createdAt,
      updatedAt: now(),
      completedAt: null,
      vehicle,
      customer: vehicle.customer,
      selectedPackage,
      statusLogs: []
    };
    const log = { id: id("log"), serviceOrderId: order.id, fromStatus: "Waiting", toStatus: status, note: "Demo status initialized", changedBy: "System", changedAt: now() };
    statusLogs.push(log);
    order.statusLogs = [log];
    return order;
  });
  return {
    customers,
    vehicles,
    serviceItems,
    servicePackages,
    serviceOrders,
    statusLogs,
    mechanics: ["Saman", "Lahiru", "Dilan", "Pradeep"].map((name, index) => ({ id: id("mech"), name, role: index === 3 ? "Quality Lead" : "Technician", activeJobs: index + 1 })),
    bays: [
      { id: id("bay"), name: "Bay 01", type: "Service", status: "Busy" },
      { id: id("bay"), name: "Bay 02", type: "Service", status: "Available" },
      { id: id("bay"), name: "Wash Bay", type: "Wash", status: "Busy" },
      { id: id("bay"), name: "Detail Bay", type: "Detail", status: "Available" }
    ],
    settings: { tvPrivacyMode: "masked" }
  };
}

export function readStore(): Store {
  if (!existsSync(dbPath)) writeStore(createSeedData());
  const data = JSON.parse(readFileSync(dbPath, "utf8")) as Store;
  return hydrate(data);
}

export function writeStore(data: Store) {
  mkdirSync(path.dirname(dbPath), { recursive: true });
  writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export function hydrate(data: Store): Store {
  const customers = new Map(data.customers.map((customer) => [customer.id, customer]));
  const vehicles = new Map(data.vehicles.map((vehicle) => [vehicle.id, { ...vehicle, customer: customers.get(vehicle.customerId) }]));
  const packages = new Map(data.servicePackages.map((servicePackage) => [servicePackage.id, servicePackage]));
  data.serviceOrders = data.serviceOrders.map((order) => ({
    ...order,
    vehicle: vehicles.get(order.vehicleId),
    customer: customers.get(order.customerId),
    selectedPackage: order.selectedPackageId ? packages.get(order.selectedPackageId) ?? null : null,
    statusLogs: data.statusLogs.filter((log) => log.serviceOrderId === order.id)
  }));
  data.vehicles = data.vehicles.map((vehicle) => ({
    ...vehicle,
    customer: customers.get(vehicle.customerId),
    orders: data.serviceOrders.filter((order) => order.vehicleId === vehicle.id)
  }));
  return data;
}

export function resetStore() {
  const data = createSeedData();
  writeStore(data);
  return data;
}
