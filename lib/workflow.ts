export const statuses = [
  "Waiting",
  "Inspection",
  "Service Bay",
  "Oil Change",
  "Diagnostic Scan",
  "Washing Bay",
  "Interior Cleaning",
  "Vacuuming",
  "Final Check",
  "Ready",
  "Ready for Delivery",
  "Completed"
] as const;

export const kanbanStatuses = [
  "Waiting",
  "Inspection",
  "Service Bay",
  "Oil Change",
  "Washing Bay",
  "Vacuuming",
  "Final Check",
  "Ready",
  "Completed"
];

export const statusColor: Record<string, string> = {
  Waiting: "bg-slate-100 text-slate-700 ring-slate-200",
  Inspection: "bg-blue-50 text-blue-700 ring-blue-200",
  "Service Bay": "bg-indigo-50 text-indigo-700 ring-indigo-200",
  "Oil Change": "bg-amber-50 text-amber-800 ring-amber-200",
  "Washing Bay": "bg-cyan-50 text-cyan-700 ring-cyan-200",
  Vacuuming: "bg-violet-50 text-violet-700 ring-violet-200",
  "Final Check": "bg-orange-50 text-orange-700 ring-orange-200",
  Ready: "bg-green-50 text-green-700 ring-green-200",
  "Ready for Delivery": "bg-green-50 text-green-700 ring-green-200",
  Delayed: "bg-red-50 text-red-700 ring-red-200",
  Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "Diagnostic Scan": "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200",
  "Interior Cleaning": "bg-teal-50 text-teal-700 ring-teal-200"
};

export const serviceCategories = [
  "Quick Wash",
  "Interior Cleaning",
  "Normal Service",
  "Full Service",
  "Oil Change",
  "Brake Inspection",
  "AC Service",
  "Diagnostic Scan",
  "Tyre & Wheel Service"
];

export function workflowForPackage(packageName?: string | null) {
  switch (packageName) {
    case "Quick Car Wash":
      return ["Waiting", "Washing Bay", "Drying", "Ready", "Completed"];
    case "Wash + Vacuum":
      return ["Waiting", "Washing Bay", "Vacuuming", "Final Check", "Ready", "Completed"];
    case "Normal Service":
      return ["Waiting", "Inspection", "Service Bay", "Oil Change", "Washing Bay", "Final Check", "Ready", "Completed"];
    case "Full Service":
      return ["Waiting", "Inspection", "Service Bay", "Oil Change", "Diagnostic Scan", "Washing Bay", "Vacuuming", "Final Check", "Ready", "Completed"];
    case "Premium Detail":
      return ["Waiting", "Washing Bay", "Interior Cleaning", "Vacuuming", "Final Check", "Ready", "Completed"];
    default:
      return ["Waiting", "Inspection", "Service Bay", "Final Check", "Ready", "Completed"];
  }
}

export function nextStep(workflow: string[], current: string) {
  const index = workflow.indexOf(current);
  return index >= 0 && index < workflow.length - 1 ? workflow[index + 1] : "Completed";
}

export function progressForStep(workflow: string[], current: string) {
  const index = Math.max(0, workflow.indexOf(current));
  if (workflow.length <= 1) return 100;
  return Math.min(100, Math.round((index / (workflow.length - 1)) * 100));
}
