import { createFileRoute } from "@tanstack/react-router";
import { Filter, ArrowUpDown, Star } from "lucide-react";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare Quotes — Mortgages & Insurance · Fasttrack Mortgages" },
      { name: "description", content: "Live comparison across 90+ mortgage lenders and 40+ insurers. Filter by cost, coverage, provider, and term." },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  return (
    <>
      <section className="py-16 border-b border-border">
        <div className="container-page">
          <div className="eyebrow mb-4 text-brand">Comparison engine</div>
          <h1 className="text-5xl md:text-6xl font-semibold text-balance mb-6 max-w-4xl leading-[1.02]">
            Every rate. Every insurer. Ranked for you.
          </h1>
          <p className="text-lg text-muted-foreground max-w-[60ch]">
            Filter, sort, and side-by-side compare products from our whole-of-market panel.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container-page grid lg:grid-cols-4 gap-8">
          {/* Filters */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="p-6 bg-card ring-1 ring-border rounded-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-sm flex items-center gap-2"><Filter className="size-4" /> Filters</h3>
                <button className="text-[10px] uppercase font-semibold text-brand">Reset</button>
              </div>
              <FilterGroup title="Product Type" items={["Mortgage", "Life Insurance", "Income Protection", "Critical Illness"]} checked={[0, 1]} />
              <FilterGroup title="Term" items={["2 years", "5 years", "10 years", "25 years"]} checked={[1]} />
              <FilterGroup title="Provider" items={["Halifax", "Nationwide", "Aviva", "L&G", "Vitality", "Santander"]} checked={[0, 2, 3]} />
              <div className="mb-5">
                <div className="text-xs font-semibold mb-3 uppercase tracking-widest text-muted-foreground">Max Monthly</div>
                <input type="range" defaultValue={65} className="w-full accent-brand" />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>£0</span><span className="font-semibold text-foreground">£1,950</span><span>£5k</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">128 products</span> match your criteria
              </div>
              <button className="text-xs font-semibold inline-flex items-center gap-2">
                <ArrowUpDown className="size-3" /> Sort: Best Rate
              </button>
            </div>

            {RESULTS.map((r, i) => (
              <div key={r.name} className={`p-6 rounded-2xl ring-1 flex flex-col md:flex-row gap-6 md:items-center ${i === 0 ? "bg-ink text-primary-foreground ring-transparent" : "bg-card ring-border"}`}>
                <div className="md:w-1/4">
                  <div className={`size-12 rounded-lg grid place-items-center font-semibold font-display text-xl ${i === 0 ? "bg-white/10 text-brand-accent" : "bg-secondary text-foreground"}`}>
                    {r.name[0]}
                  </div>
                  {i === 0 && (
                    <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-brand-accent">
                      <Star className="size-3 fill-current" /> Best match
                    </div>
                  )}
                </div>
                <div className="md:flex-1">
                  <h3 className="font-semibold mb-1">{r.name}</h3>
                  <p className={`text-xs ${i === 0 ? "text-zinc-400" : "text-muted-foreground"}`}>{r.product}</p>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <MetricSm dark={i === 0} label="Rate" value={r.rate} />
                    <MetricSm dark={i === 0} label="APRC" value={r.aprc} />
                    <MetricSm dark={i === 0} label="Monthly" value={r.monthly} />
                  </div>
                </div>
                <div className="md:w-40 flex md:flex-col gap-2">
                  <button className={`${i === 0 ? "bg-primary-foreground text-ink hover:bg-white/90" : "btn-primary"} inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors`}>
                    Apply
                  </button>
                  <button className="btn-secondary justify-center">Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function FilterGroup({ title, items, checked }: { title: string; items: string[]; checked: number[] }) {
  return (
    <div className="mb-5 pb-5 border-b border-border last:border-b-0">
      <div className="text-xs font-semibold mb-3 uppercase tracking-widest text-muted-foreground">{title}</div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={item} className="flex items-center gap-3 text-sm">
            <span className={`size-4 rounded flex items-center justify-center ring-1 ${checked.includes(i) ? "bg-brand ring-brand text-primary-foreground" : "ring-border"}`}>
              {checked.includes(i) && <span className="text-[10px]">✓</span>}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
function MetricSm({ label, value, dark }: { label: string; value: string; dark: boolean }) {
  return (
    <div>
      <div className={`text-[10px] uppercase tracking-widest mb-1 ${dark ? "text-zinc-500" : "text-muted-foreground"}`}>{label}</div>
      <div className="text-base font-semibold font-display">{value}</div>
    </div>
  );
}

const RESULTS = [
  { name: "Nationwide Elite", product: "5 Year Fixed · 80% LTV · £999 fee", rate: "3.89%", aprc: "5.9%", monthly: "£1,795" },
  { name: "Halifax Premier", product: "2 Year Fixed · 75% LTV · £499 fee", rate: "4.12%", aprc: "6.8%", monthly: "£1,840" },
  { name: "Barclays Premier", product: "5 Year Fixed · 60% LTV · £1,499 fee", rate: "3.68%", aprc: "5.4%", monthly: "£1,752" },
  { name: "HSBC First Direct", product: "2 Year Fixed · 85% LTV · £0 fee", rate: "4.31%", aprc: "6.9%", monthly: "£1,880" },
  { name: "Santander Track+", product: "Tracker · Base + 0.5% · £0 fee", rate: "5.75%", aprc: "6.2%", monthly: "£2,140" },
  { name: "Aviva Life Protect", product: "20-year term · £250k cover", rate: "£14", aprc: "—", monthly: "£14" },
];
