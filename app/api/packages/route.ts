import { NextResponse } from "next/server";
import { readStore } from "@/lib/store";

export async function GET() {
  const data = readStore();
  return NextResponse.json({ packages: data.servicePackages, items: data.serviceItems });
}
