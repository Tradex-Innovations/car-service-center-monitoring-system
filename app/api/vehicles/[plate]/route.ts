import { NextResponse } from "next/server";
import { normalizePlate } from "@/lib/utils";
import { readStore } from "@/lib/store";

export async function GET(_request: Request, { params }: { params: Promise<{ plate: string }> }) {
  const { plate } = await params;
  const vehicle = readStore().vehicles.find((item) => item.normalizedPlateNumber === normalizePlate(decodeURIComponent(plate)));
  if (!vehicle) return new NextResponse("Vehicle not found", { status: 404 });
  return NextResponse.json(vehicle);
}
