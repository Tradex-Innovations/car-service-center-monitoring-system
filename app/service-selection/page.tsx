import { Suspense } from "react";
import { ServiceSelectionClient } from "@/components/service-selection-client";

export default function ServiceSelectionQueryPage() {
  return (
    <Suspense fallback={null}>
      <ServiceSelectionClient />
    </Suspense>
  );
}
