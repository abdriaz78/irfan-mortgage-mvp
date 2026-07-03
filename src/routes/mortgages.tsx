import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calculator, TrendingUp, Home, Landmark, Percent, PiggyBank } from "lucide-react";

export const Route = createFileRoute("/mortgages")({
  head: () => ({
    meta: [
      { title: "Mortgages — Eligibility Checker & Calculators · Vantage & Co." },
      { name: "description", content: "Instant mortgage eligibility, affordability, repayment, stamp duty, refinance and overpayment calculators. Whole-of-market advice from FCA-regulated brokers." },
    ],
  }),
  component: MortgagesPage,
});

function MortgagesPage() {
  return (
    <>
      <section className="py-16 lg:py-24 border-b border-border">
        <div className="container-page max-w-4xl">
          <div className="eyebrow mb-4 text-brand">Mortgages</div>
          <h1 className="text-5xl md:text-6xl font-semibold text-balance mb-6 leading-[1.02]">
            Know exactly what you can borrow — before you speak to a bank.
          </h1>
          <p className="text-lg text-muted-foreground max-w-[60ch] leading-relaxed">
            Our eligibility engine models your income, deposit, credit profile, and property against real lender
            criteria across 90+ providers. No credit check. No commitment.
          </p>
        </div>
      </section>

      {/* Eligibility Checker Form */}
      <section className="py-16 lg:py-24">
        <div className="container-page grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 bg-card p-8 rounded-3xl ring-1 ring-border">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold">Eligibility Checker</h2>
              <span className="text-[10px] font-mono text-muted-foreground">STEP 2 / 5</span>
            </div>
            <div className="h-1 bg-secondary rounded-full mb-8 overflow-hidden">
              <div className="h-full bg-brand w-2/5" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Annual Income" value="£85,000" />
              <Field label="Partner Income" value="£42,000" />
              <Field label="Employment Status" value="Full-time Employed" />
              <Field label="Deposit Available" value="£45,000" />
              <Field label="Target Property Value" value="£470,000" />
              <Field label="Credit History" value="Good — no defaults" />
              <SelectField label="Property Type" options={["Residential", "Buy-to-Let", "New Build", "Shared Ownership"]} />
              <SelectField label="Term Preference" options={["25 years", "30 years", "35 years", "Interest only"]} />
            </div>
            <div className="mt-8 flex gap-3">
              <button className="btn-primary">Calculate <ArrowRight className="size-4" /></button>
              <button className="btn-secondary">Back</button>
            </div>
          </div>

          <aside className="lg:col-span-2 space-y-4">
            <div className="p-6 bg-brand text-primary-foreground rounded-2xl">
              <div className="text-[11px] uppercase tracking-widest opacity-70 mb-2">Estimated Borrowing</div>
              <div className="text-4xl font-semibold font-display">£425,000</div>
              <div className="text-sm opacity-70 mt-2">at 85% LTV based on today's inputs</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Monthly repayment" value="£1,840" />
              <MiniStat label="Best fixed rate" value="3.89%" />
              <MiniStat label="Suitable lenders" value="42" />
              <MiniStat label="Stamp duty" value="£10,750" />
            </div>
            <div className="p-6 bg-secondary rounded-2xl">
              <h3 className="text-sm font-semibold mb-2">Suggested mortgage types</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>· 5-year fixed residential</li>
                <li>· Offset mortgage (professional)</li>
                <li>· Joint borrower sole proprietor</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Calculator suite */}
      <section className="py-24 bg-secondary/40 border-y border-border">
        <div className="container-page">
          <div className="mb-12 max-w-2xl">
            <div className="eyebrow mb-4 text-brand">Calculator suite</div>
            <h2 className="text-4xl font-semibold text-balance mb-4">Five tools. One canonical answer.</h2>
            <p className="text-muted-foreground leading-relaxed">
              Every calculator uses the same underwriting engine our advisors use for regulated advice.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CALCS.map((c) => (
              <div key={c.title} className="bg-card p-7 rounded-2xl ring-1 ring-border hover:ring-brand/30 transition-all">
                <div className="size-10 rounded-lg bg-brand-soft text-brand grid place-items-center mb-5">
                  {c.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{c.copy}</p>
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
                    {c.tag}
                  </span>
                  <button className="text-xs font-semibold text-brand inline-flex items-center gap-1">
                    Open <ArrowRight className="size-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mortgage types */}
      <section className="py-24">
        <div className="container-page">
          <div className="grid lg:grid-cols-3 gap-8">
            {TYPES.map((t) => (
              <article key={t.title} className="border-t border-foreground pt-8">
                <div className="text-[11px] font-mono text-muted-foreground mb-4">{t.tag}</div>
                <h3 className="text-2xl font-semibold mb-3 font-display">{t.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t.copy}</p>
                <Link to="/compare" className="text-sm font-semibold text-brand inline-flex items-center gap-1">
                  Compare rates <ArrowRight className="size-3" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
        {label}
      </label>
      <input
        type="text"
        defaultValue={value}
        className="w-full px-4 py-3 bg-secondary/60 border border-border rounded-lg text-sm focus:border-brand focus:outline-none transition-colors"
      />
    </div>
  );
}
function SelectField({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
        {label}
      </label>
      <select className="w-full px-4 py-3 bg-secondary/60 border border-border rounded-lg text-sm focus:border-brand focus:outline-none transition-colors">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-card rounded-xl ring-1 ring-border">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{label}</div>
      <div className="text-lg font-semibold font-display">{value}</div>
    </div>
  );
}

const CALCS = [
  { icon: <Calculator className="size-4" />, title: "Affordability Calculator", copy: "Income versus borrowing power, with real lender stress-tests baked in.", tag: "MOST USED" },
  { icon: <Home className="size-4" />, title: "Repayment Calculator", copy: "Monthly mortgage payments across fixed, tracker, and variable options.", tag: "ESSENTIAL" },
  { icon: <Landmark className="size-4" />, title: "Stamp Duty Calculator", copy: "Property purchase costs including first-time buyer relief and BTL surcharge.", tag: "UK RATES" },
  { icon: <TrendingUp className="size-4" />, title: "Refinance Calculator", copy: "Savings after switching lenders, including early repayment charges.", tag: "SAVINGS" },
  { icon: <PiggyBank className="size-4" />, title: "Overpayment Calculator", copy: "Impact of extra payments on term length and total interest paid.", tag: "STRATEGY" },
  { icon: <Percent className="size-4" />, title: "Buy-to-Let Calculator", copy: "Rental yield, LTV, and lender stress-test coverage in one view.", tag: "INVESTOR" },
];

const TYPES = [
  { tag: "01 · RESIDENTIAL", title: "First-time buyer & mover", copy: "Standard and specialist residential mortgages, including 95% LTV and shared ownership pathways for first-time buyers." },
  { tag: "02 · INVESTMENT", title: "Buy-to-let & portfolio", copy: "Single-property BTL through to portfolio landlords, with limited company structures and HMO specialists." },
  { tag: "03 · SPECIALIST", title: "Complex income", copy: "Self-employed, contractor, retained profits, foreign income, high-net-worth — placements the high street can't reach." },
];
