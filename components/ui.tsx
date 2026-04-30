import { cn } from "@/lib/utils";
import { statusColor } from "@/lib/workflow";

export function PageHeader({ title, eyebrow, action }: { title: string; eyebrow?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow ? <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">{eyebrow}</p> : null}
        <h1 className="text-3xl font-semibold tracking-tight text-ink">{title}</h1>
      </div>
      {action}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-2xl border border-line bg-white p-5 shadow-soft", className)}>{children}</div>;
}

export function Button({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-ink text-white shadow-sm hover:bg-slate-800",
        variant === "secondary" && "border border-line bg-white text-ink hover:bg-slate-50",
        variant === "ghost" && "text-slate-600 hover:bg-slate-100",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
        className
      )}
      {...props}
    />
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none ring-0 focus:border-slate-400", props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn("h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-slate-400", props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn("min-h-24 w-full rounded-xl border border-line bg-white px-3 py-3 text-sm outline-none focus:border-slate-400", props.className)} />;
}

export function StatusBadge({ status }: { status: string }) {
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1", statusColor[status] ?? statusColor.Waiting)}>{status}</span>;
}

export function Progress({ value }: { value: number }) {
  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
      <div className="h-full rounded-full bg-ink transition-all" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <p className="font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{body}</p>
    </div>
  );
}
