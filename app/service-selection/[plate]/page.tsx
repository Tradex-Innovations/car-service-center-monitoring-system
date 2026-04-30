import { Suspense } from "react";
import { ServiceSelectionClient } from "@/components/service-selection-client";

export function generateStaticParams() {
  return ["CAB-4589", "WP-CAR-2211", "ABC-1234", "CAA-7788", "KI-9090", "CAR-6021", "WP-KD-8841"].map((plate) => ({ plate }));
}

export default async function ServiceSelectionPage({ params }: { params: Promise<{ plate: string }> }) {
  const { plate } = await params;
  return (
    <Suspense fallback={null}>
      <ServiceSelectionClient plateFromPath={decodeURIComponent(plate)} />
    </Suspense>
  );
}
