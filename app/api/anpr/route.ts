import { NextResponse } from "next/server";
import { detectPlateFromImage } from "@/lib/anpr";

export const dynamic = "force-static";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("image");
  const result = await detectPlateFromImage(file instanceof Blob ? file : null);
  return NextResponse.json(result);
}
