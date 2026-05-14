import { cn } from "@/lib/utils";
import { statusColor } from "@/lib/workflow";

export function PageHeader({ title, eyebrow, action }: { title: string; eyebrow?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow ? <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">{eyebrow}</p> : null}
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h1>
      </div>
      {action}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <GlassCard className={className}>{children}</GlassCard>;
}

export function GlassCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("glass-panel rounded-[30px] p-5 ring-1 ring-white/20 sm:p-6", className)}>{children}</div>;
}

export function StatCard({ label, value, detail, className }: { label: string; value: React.ReactNode; detail?: React.ReactNode; className?: string }) {
  return (
    <GlassCard className={cn("relative overflow-hidden", className)}>
      <p className="relative text-sm font-medium text-slate-500">{label}</p>
      <p className="relative mt-2 text-3xl font-semibold tracking-tight text-ink">{value}</p>
      {detail ? <p className="relative mt-1 text-sm text-slate-500">{detail}</p> : null}
    </GlassCard>
  );
}

export function Button({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold shadow-sm transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-gradient-to-br from-[#0a84ff] to-[#0066d6] text-white shadow-glow hover:-translate-y-0.5 hover:shadow-[0_22px_54px_rgba(0,122,255,0.34)]",
        variant === "secondary" && "glass-surface text-ink hover:-translate-y-0.5 hover:bg-white/35",
        variant === "ghost" && "text-slate-600 hover:bg-white/25 hover:text-ink",
        variant === "danger" && "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-[0_14px_34px_rgba(225,29,72,0.24)] hover:-translate-y-0.5",
        className
      )}
      {...props}
    />
  );
}

export const GlassButton = Button;

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-12 w-full rounded-2xl border border-white/60 bg-white/30 px-4 text-sm text-ink shadow-inner outline-none backdrop-blur-xl transition placeholder:text-slate-400 focus:border-ios-blue/55 focus:bg-white/48 focus:ring-4 focus:ring-ios-blue/10",
        props.className
      )}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-12 w-full rounded-2xl border border-white/60 bg-white/30 px-4 text-sm text-ink shadow-inner outline-none backdrop-blur-xl transition focus:border-ios-blue/55 focus:bg-white/48 focus:ring-4 focus:ring-ios-blue/10",
        props.className
      )}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-24 w-full rounded-2xl border border-white/60 bg-white/30 px-4 py-3 text-sm text-ink shadow-inner outline-none backdrop-blur-xl transition placeholder:text-slate-400 focus:border-ios-blue/55 focus:bg-white/48 focus:ring-4 focus:ring-ios-blue/10",
        props.className
      )}
    />
  );
}

export const GlassInput = Input;

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ring-1 backdrop-blur", statusColor[status] ?? statusColor.Waiting)}>
      {status}
    </span>
  );
}

export function Progress({ value }: { value: number }) {
  return (
    <div className="h-2.5 overflow-hidden rounded-full border border-white/45 bg-white/28 shadow-inner backdrop-blur-xl">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#007aff] via-[#34c759] to-[#7dd3fc] shadow-[0_0_18px_rgba(0,122,255,0.35)] transition-all duration-500"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="glass-panel rounded-[30px] border-dashed p-8 text-center">
      <p className="font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{body}</p>
    </div>
  );
}

export function GlassModal({ className, children }: { className?: string; children: React.ReactNode }) {
  return <GlassCard className={cn("mx-auto w-full max-w-lg", className)}>{children}</GlassCard>;
}

export function GlassNavbar({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("glass-panel rounded-[26px] px-3 py-3", className)}>{children}</div>;
}

export function GlassSidebar({ className, children }: { className?: string; children: React.ReactNode }) {
  return <aside className={cn("glass-panel rounded-[32px] p-4", className)}>{children}</aside>;
}

export function GlassTable({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("glass-panel overflow-hidden rounded-[28px]", className)}>{children}</div>;
}
