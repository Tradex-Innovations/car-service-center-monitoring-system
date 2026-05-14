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
  Waiting: "bg-slate-100/70 text-slate-700 ring-slate-200/80",
  Inspection: "bg-blue-50/80 text-blue-700 ring-blue-200/80",
  "Service Bay": "bg-indigo-50/80 text-indigo-700 ring-indigo-200/80",
  "Oil Change": "bg-amber-50/80 text-amber-800 ring-amber-200/80",
  "Washing Bay": "bg-cyan-50/80 text-cyan-700 ring-cyan-200/80",
  Vacuuming: "bg-violet-50/80 text-violet-700 ring-violet-200/80",
  "Final Check": "bg-orange-50/80 text-orange-700 ring-orange-200/80",
  Ready: "bg-green-50/80 text-green-700 ring-green-200/80",
  "Ready for Delivery": "bg-green-50/80 text-green-700 ring-green-200/80",
  Delayed: "bg-red-50/80 text-red-700 ring-red-200/80",
  Completed: "bg-emerald-50/80 text-emerald-700 ring-emerald-200/80",
  "Diagnostic Scan": "bg-fuchsia-50/80 text-fuchsia-700 ring-fuchsia-200/80",
  "Interior Cleaning": "bg-teal-50/80 text-teal-700 ring-teal-200/80"
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
