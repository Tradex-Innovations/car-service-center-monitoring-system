import { NextResponse } from "next/server";
import { readStore } from "@/lib/store";

export const dynamic = "force-static";

export async function GET() {
  const data = readStore();
  return NextResponse.json({ packages: data.servicePackages, items: data.serviceItems });
}
