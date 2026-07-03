import { createFileRoute, Link } from "@tanstack/react-router";
import { Home, HeartPulse, Bell, Calendar, MessageSquare, FileText, TrendingUp, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Client Dashboard · Vantage & Co." },
      { name: "description", content: "Track your mortgage application, manage policies, view renewal dates, and message your advisor." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <section className="py-12">
      <div className="container-page">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-full bg-brand text-primary-foreground grid place-items-center font-semibold font-display text-lg">
              EV
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Welcome back,</div>
              <h1 className="text-2xl font-semibold">Eleanor Vance</h1>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary"><Bell className="size-4" /> 3 alerts</button>
            <Link to="/book" className="btn-primary"><Calendar className="size-4" /> Book advisor</Link>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Kpi label="Active application" value="MTG-9921" sub="Valuation stage" />
          <Kpi label="Est. offer date" value="24 Nov" sub="On track" />
          <Kpi label="Active policies" value="3" sub="Life · Home · Income" />
          <Kpi label="Next renewal" value="47 days" sub="Home insurance" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Mortgage tile */}
          <div className="lg:col-span-2 bg-card p-8 rounded-2xl ring-1 ring-border">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-brand-soft text-brand grid place-items-center">
                  <Home className="size-5" />
                </div>
                <h2 className="text-lg font-semibold">Mortgage Application</h2>
              </div>
              <span className="text-[10px] uppercase font-bold text-brand-accent tracking-widest">Valuation stage</span>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-brand w-[62%]" />
              </div>
              <div className="mt-4 grid grid-cols-5 gap-2 text-[10px] uppercase font-semibold tracking-widest">
                {["Application", "DIP", "Docs", "Valuation", "Offer"].map((s, i) => (
                  <div key={s} className={i < 3 ? "text-brand" : i === 3 ? "text-brand-accent" : "text-muted-foreground"}>
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks */}
            <div className="space-y-3">
              {[
                { icon: <FileText className="size-4" />, label: "Upload P60 (re-upload requested)", cta: "Upload", urgent: true },
                { icon: <MessageSquare className="size-4" />, label: "Message from advisor Marcus", cta: "Read", urgent: false },
                { icon: <Calendar className="size-4" />, label: "Valuation scheduled — Thursday 11:00", cta: "Reschedule", urgent: false },
              ].map((t) => (
                <div key={t.label} className="p-4 rounded-xl bg-secondary/60 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`size-8 rounded-lg grid place-items-center shrink-0 ${t.urgent ? "bg-brand-accent/20 text-brand-accent" : "bg-card text-muted-foreground"}`}>
                      {t.icon}
                    </span>
                    <span className="text-sm truncate">{t.label}</span>
                  </div>
                  <button className="text-xs font-semibold text-brand shrink-0 inline-flex items-center gap-1">
                    {t.cta} <ChevronRight className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Insurance policies */}
          <div className="bg-ink text-primary-foreground p-8 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-lg bg-white/10 text-brand-accent grid place-items-center">
                <HeartPulse className="size-5" />
              </div>
              <h2 className="text-lg font-semibold">Active Policies</h2>
            </div>
            <ul className="space-y-4">
              {POLICIES.map((p) => (
                <li key={p.name} className="pb-4 border-b border-white/10 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <div className="text-sm font-semibold">{p.name}</div>
                    <div className="text-sm font-display">{p.premium}</div>
                  </div>
                  <div className="text-xs text-zinc-400">{p.provider} · Renews {p.renews}</div>
                </li>
              ))}
            </ul>
            <Link to="/insurance" className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-brand-accent">
              Review coverage <ChevronRight className="size-3" />
            </Link>
          </div>

          {/* Advisor card */}
          <div className="bg-card p-8 rounded-2xl ring-1 ring-border">
            <div className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground mb-4">Your Advisor</div>
            <div className="flex items-center gap-4 mb-6">
              <div className="size-14 rounded-full bg-secondary grid place-items-center font-semibold font-display">MK</div>
              <div>
                <div className="font-semibold">Marcus Kensington</div>
                <div className="text-xs text-muted-foreground">Senior Mortgage Adviser · CeMAP</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="btn-secondary justify-center"><MessageSquare className="size-4" /> Chat</button>
              <button className="btn-primary justify-center"><Calendar className="size-4" /> Book</button>
            </div>
          </div>

          {/* Rate watch */}
          <div className="lg:col-span-2 bg-card p-8 rounded-2xl ring-1 ring-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-lg bg-brand-soft text-brand grid place-items-center">
                <TrendingUp className="size-5" />
              </div>
              <h2 className="text-lg font-semibold">Rate Watch — 5 Year Fixed</h2>
            </div>
            <div className="h-40 bg-secondary/60 rounded-xl relative overflow-hidden">
              <svg viewBox="0 0 400 120" className="w-full h-full">
                <path d="M0,80 C50,60 90,90 140,70 C190,50 230,40 280,55 C330,70 370,45 400,50" stroke="var(--brand)" strokeWidth="2" fill="none" />
                <path d="M0,80 C50,60 90,90 140,70 C190,50 230,40 280,55 C330,70 370,45 400,50 L400,120 L0,120 Z" fill="var(--brand-soft)" />
              </svg>
              <div className="absolute bottom-3 left-3 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Last 30 days</div>
              <div className="absolute top-3 right-3 text-sm font-semibold text-brand">3.89% ↓ 0.12%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Kpi({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="p-6 bg-card rounded-2xl ring-1 ring-border">
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">{label}</div>
      <div className="text-2xl font-semibold font-display mb-1">{value}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}

const POLICIES = [
  { name: "Life Insurance", provider: "Aviva", premium: "£24/mo", renews: "Aug 2027" },
  { name: "Home Insurance", provider: "Direct Line", premium: "£38/mo", renews: "Dec 2026" },
  { name: "Income Protection", provider: "Vitality", premium: "£42/mo", renews: "Mar 2027" },
];
