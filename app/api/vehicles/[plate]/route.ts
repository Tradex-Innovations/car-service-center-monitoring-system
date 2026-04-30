import { NextResponse } from "next/server";
import { normalizePlate } from "@/lib/utils";
import { readStore } from "@/lib/store";

export const dynamic = "force-static";

export function generateStaticParams() {
  return ["CAB-4589", "WP-CAR-2211", "ABC-1234", "CAA-7788", "KI-9090", "CAR-6021", "WP-KD-8841"].map((plate) => ({ plate }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ plate: string }> }) {
  const { plate } = await params;
  const vehicle = readStore().vehicles.find((item) => item.normalizedPlateNumber === normalizePlate(decodeURIComponent(plate)));
  if (!vehicle) return new NextResponse("Vehicle not found", { status: 404 });
  return NextResponse.json(vehicle);
}
