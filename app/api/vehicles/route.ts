import { NextResponse } from "next/server";
import { normalizePlate } from "@/lib/utils";
import { readStore, writeStore } from "@/lib/store";
import type { Customer, Vehicle } from "@/lib/types";

const id = (prefix: string) => `${prefix}_${crypto.randomUUID().slice(0, 8)}`;

export async function GET() {
  return NextResponse.json(readStore().vehicles);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = readStore();
  const plateNumber = String(body.plateNumber ?? "").trim().toUpperCase();
  const normalizedPlateNumber = normalizePlate(plateNumber);
  if (!plateNumber || !body.customerName || !body.phone || !body.make || !body.model || !body.color) {
    return new NextResponse("Missing vehicle or customer fields", { status: 400 });
  }
  const existing = data.vehicles.find((vehicle) => vehicle.normalizedPlateNumber === normalizedPlateNumber);
  if (existing) return NextResponse.json(existing);

  const timestamp = new Date().toISOString();
  const customer: Customer = { id: id("cus"), name: body.customerName, phone: body.phone, email: body.email || null, createdAt: timestamp };
  const vehicle: Vehicle = {
    id: id("veh"),
    plateNumber,
    normalizedPlateNumber,
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
  writeStore(data);
  return NextResponse.json(vehicle);
}
