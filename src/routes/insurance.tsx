import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HeartPulse, Shield, Activity, Home, Building2, Briefcase, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/insurance")({
  head: () => ({
    meta: [
      { title: "Insurance — Life, Income & Home Protection · Vantage & Co." },
      { name: "description", content: "Life insurance, income protection, critical illness, home, landlord, and business insurance. Independent quotes across 40+ insurers." },
    ],
  }),
  component: InsurancePage,
});

function InsurancePage() {
  return (
    <>
      <section className="py-16 lg:py-24 border-b border-border">
        <div className="container-page max-w-4xl">
          <div className="eyebrow mb-4 text-brand">Insurance</div>
          <h1 className="text-5xl md:text-6xl font-semibold text-balance mb-6 leading-[1.02]">
            Cover that fits the life you've built.
          </h1>
          <p className="text-lg text-muted-foreground max-w-[60ch] leading-relaxed">
            Six protection products, one guided assessment. We identify coverage gaps in your lifestyle and match
            you to the right insurer — not the one that pays us most.
          </p>
        </div>
      </section>

      {/* Product grid */}
      <section className="py-16 lg:py-24">
        <div className="container-page grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRODUCTS.map((p) => (
            <div key={p.title} className="group bg-card p-8 rounded-3xl ring-1 ring-border hover:ring-brand/30 transition-all">
              <div className="size-11 rounded-xl bg-brand-soft text-brand grid place-items-center mb-6 group-hover:bg-brand group-hover:text-primary-foreground transition-colors">
                {p.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{p.copy}</p>
              <div className="pt-5 border-t border-border flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-widest font-semibold">
                  From <span className="text-foreground">£{p.from}/mo</span>
                </span>
                <Link to="/compare" className="text-xs font-semibold text-brand inline-flex items-center gap-1">
                  Get quote <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Guided Assessment */}
      <section className="py-24 bg-secondary/40 border-y border-border">
        <div className="container-page grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="eyebrow mb-4 text-brand">Instant assessment</div>
            <h2 className="text-4xl font-semibold text-balance mb-4">
              Answer eight questions. Get a needs analysis.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-[52ch]">
              Our automated assessment models your dependants, mortgage exposure, income, and lifestyle risk to
              recommend coverage levels and suggest three tailored quotes.
            </p>
            <ul className="space-y-3">
              {["Coverage gap analysis", "Suggested sum assured", "Term recommendation", "Three tailored quotes", "Advisor callback within 4 hours"].map((t) => (
                <li key={t} className="flex gap-3 text-sm">
                  <CheckCircle2 className="size-5 text-brand shrink-0" /> {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card p-8 rounded-3xl ring-1 ring-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Needs Analysis</h3>
              <span className="text-[10px] font-mono text-muted-foreground">3 / 8</span>
            </div>
            <div className="space-y-6">
              <QGroup q="Who depends on your income?" opts={["Just me", "Partner", "Partner + children", "Extended family"]} selected={2} />
              <QGroup q="Do you have an outstanding mortgage?" opts={["No", "Under £150k", "£150k – £400k", "Over £400k"]} selected={2} />
              <QGroup q="Employment status?" opts={["Employed", "Self-employed", "Director", "Contractor"]} selected={1} />
              <button className="btn-primary w-full justify-center">Continue <ArrowRight className="size-4" /></button>
            </div>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-24">
        <div className="container-page grid md:grid-cols-3 gap-10">
          {[
            { n: "40+", l: "Insurer panel" },
            { n: "£0", l: "Broker fees on protection" },
            { n: "98%", l: "Claims paid across our panel" },
          ].map((s) => (
            <div key={s.l} className="border-t border-foreground pt-8">
              <div className="text-6xl font-semibold font-display mb-3">{s.n}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-widest">{s.l}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function QGroup({ q, opts, selected }: { q: string; opts: string[]; selected: number }) {
  return (
    <div>
      <div className="text-sm font-medium mb-3">{q}</div>
      <div className="grid grid-cols-2 gap-2">
        {opts.map((o, i) => (
          <button
            key={o}
            className={`px-4 py-3 rounded-lg text-xs font-medium text-left transition-colors ${
              i === selected
                ? "bg-brand text-primary-foreground ring-1 ring-brand"
                : "bg-secondary/60 hover:bg-secondary ring-1 ring-border"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

const PRODUCTS = [
  { icon: <HeartPulse className="size-5" />, title: "Life Insurance", copy: "Ensure your family's future — lump-sum protection that pays out on death or terminal illness.", from: "12" },
  { icon: <Activity className="size-5" />, title: "Income Protection", copy: "Replaces your salary if you're unable to work due to illness or injury.", from: "22" },
  { icon: <Shield className="size-5" />, title: "Critical Illness", copy: "Tax-free lump sum on diagnosis of a serious medical condition.", from: "18" },
  { icon: <Home className="size-5" />, title: "Home Insurance", copy: "Buildings and contents cover — including accidental damage and family valuables.", from: "9" },
  { icon: <Building2 className="size-5" />, title: "Landlord Insurance", copy: "Property, loss of rent, and public liability cover across single or portfolio holdings.", from: "16" },
  { icon: <Briefcase className="size-5" />, title: "Business Insurance", copy: "Public liability, professional indemnity, key-person, and shareholder protection.", from: "29" },
];
