import { NextResponse } from "next/server";
import { readStore, writeStore } from "@/lib/store";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(readStore().settings);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const data = readStore();
  data.settings.tvPrivacyMode = body.tvPrivacyMode ?? "masked";
  writeStore(data);
  return NextResponse.json(data.settings);
}
