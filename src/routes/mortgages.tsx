import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Calculator,
  TrendingUp,
  Home,
  Landmark,
  Percent,
  PiggyBank,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { calculateLeadScore, formatLeadScore, saveLead, type LeadData } from "@/lib/lead-scoring";

export const Route = createFileRoute("/mortgages")({
  head: () => ({
    meta: [
      { title: "Mortgages — Eligibility Checker & Calculators · Fasttrack Mortgages" },
      { name: "description", content: "Instant mortgage eligibility, affordability, repayment, stamp duty, refinance and overpayment calculators. Whole-of-market advice from FCA-regulated brokers." },
    ],
  }),
  component: MortgagesPage,
});

function MortgagesPage() {
  const [activeCalc, setActiveCalc] = useState<string | null>(null);

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
      <EligibilityCheckerSection />

      

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
              <button
                key={c.title}
                onClick={() => setActiveCalc(c.id)}
                className="text-left bg-card p-7 rounded-2xl ring-1 ring-border hover:ring-brand/30 transition-all hover:shadow-md"
              >
                <div className="size-10 rounded-lg bg-brand-soft text-brand grid place-items-center mb-5">
                  {c.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{c.copy}</p>
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
                    {c.tag}
                  </span>
                  <span className="text-xs font-semibold text-brand inline-flex items-center gap-1">
                    Open <ArrowRight className="size-3" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Modal */}
      {activeCalc && (
        <CalculatorModal
          calculatorId={activeCalc}
          onClose={() => setActiveCalc(null)}
        />
      )}

      {/* Mortgage products */}
      <section className="py-24">
        <div className="container-page">
          <div className="mb-12 max-w-2xl">
            <div className="eyebrow mb-4 text-brand">Mortgage products</div>
            <h2 className="text-4xl font-semibold text-balance mb-4">Whatever stage you're at, there's a mortgage for it.</h2>
            <p className="text-muted-foreground leading-relaxed">
              We search the whole of market — bar bridging — to find the right product for your circumstances, then
              handle the paperwork and coordinate with solicitors, accountants, and estate agents on your behalf.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCTS.map((p) => (
              <article
                key={p.title}
                className="group bg-card rounded-2xl ring-1 ring-border hover:ring-brand/30 transition-all hover:shadow-md overflow-hidden flex flex-col"
              >
                <div className="aspect-[16/10] overflow-hidden bg-secondary">
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    width={800}
                    height={500}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{p.copy}</p>
                  <Link to="/compare" className="mt-auto text-sm font-semibold text-brand inline-flex items-center gap-1 w-fit">
                    Compare rates <ArrowRight className="size-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Credit problems callout */}
      <section className="py-16 bg-secondary/40 border-y border-border">
        <div className="container-page">
          <div className="bg-card rounded-3xl ring-1 ring-border p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
            <div className="size-12 rounded-xl bg-brand-soft text-brand grid place-items-center shrink-0">
              <AlertCircle className="size-6" />
            </div>
            <div className="max-w-[70ch]">
              <h2 className="text-2xl font-semibold mb-3">Been turned away for credit problems?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Missed payments, defaults, CCJs, debt management plans, or a history of bankruptcy don't have to stop
                you owning a home. We specialise in placing cases the high street declines — matching you with
                specialist lenders who look at the full picture, not just a credit score.
              </p>
              <Link to="/book" className="text-sm font-semibold text-brand inline-flex items-center gap-1">
                Talk to an adviser <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Additional services */}
      <section className="py-24">
        <div className="container-page">
          <div className="mb-12 max-w-2xl">
            <div className="eyebrow mb-4 text-brand">More than mortgages</div>
            <h2 className="text-4xl font-semibold text-balance mb-4">Everything around the deal, in one place.</h2>
            <p className="text-muted-foreground leading-relaxed">
              From protecting your family to the legal work of moving home, our advisers and trusted partners cover
              the full journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s) => (
              <article
                key={s.title}
                className="group bg-card rounded-2xl ring-1 ring-border overflow-hidden flex flex-col hover:ring-brand/30 transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden bg-secondary">
                  <img
                    src={s.img}
                    alt={s.title}
                    loading="lazy"
                    width={800}
                    height={500}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.copy}</p>
                  {s.href && (
                    <Link to={s.href} className="mt-auto text-sm font-semibold text-brand inline-flex items-center gap-1 w-fit">
                      Learn more <ArrowRight className="size-3" />
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-8 max-w-[70ch]">
            The Financial Conduct Authority does not regulate some forms of buy-to-let and commercial mortgages,
            bridging loans, wills, or conveyancing. Your home may be repossessed if you do not keep up repayments on
            your mortgage.
          </p>
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

// Eligibility Checker Section Component
function EligibilityCheckerSection() {
  const [income, setIncome] = useState(85000);
  const [partnerIncome, setPartnerIncome] = useState(42000);
  const [employmentStatus, setEmploymentStatus] = useState("Full-time Employed");
  const [deposit, setDeposit] = useState(45000);
  const [propertyValue, setPropertyValue] = useState(470000);
  const [creditHistory, setCreditHistory] = useState("Good — no defaults");
  const [submitted, setSubmitted] = useState(false);
  const [leadScore, setLeadScore] = useState<ReturnType<typeof calculateLeadScore> | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const leadData: LeadData = {
      annualIncome: income,
      partnerIncome: partnerIncome,
      employmentStatus: employmentStatus,
      depositAmount: deposit,
      propertyValue: propertyValue,
      creditHistory: creditHistory,
      timeline: "Next 1-3 months",
    };

    const score = calculateLeadScore(leadData);
    setLeadScore(score);
    setSubmitted(true);
    saveLead(leadData, score);
  };

  const totalIncome = income + partnerIncome;
  const borrowingPower = totalIncome * 4.5;
  const maxPrice = borrowingPower + deposit;

  if (submitted && leadScore) {
    const format = formatLeadScore(leadScore);
    return (
      <section className="py-16 lg:py-24">
        <div className="container-page max-w-4xl">
          <div className="bg-card p-10 rounded-3xl ring-1 ring-border">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{format.icon}</div>
              <h2 className="text-3xl font-semibold mb-2">{format.label}</h2>
              <p className="text-muted-foreground">{format.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-secondary/60 rounded-2xl p-6">
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">Lead Score</div>
                <div className="text-4xl font-bold mb-1" style={{ color: format.color }}>
                  {leadScore.totalScore}/100
                </div>
                <div className="text-sm text-muted-foreground">
                  Mortgage: {leadScore.mortgageScore} | Insurance: {leadScore.insuranceScore}
                </div>
              </div>

              <div className="bg-secondary/60 rounded-2xl p-6">
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">Max Property Price</div>
                <div className="text-3xl font-bold">£{maxPrice.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground mt-2">
                  Based on {totalIncome.toLocaleString()} income + £{deposit.toLocaleString()} deposit
                </div>
              </div>
            </div>

            <div className="mb-8 p-6 bg-brand/10 border border-brand/30 rounded-2xl">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Check className="size-5 text-brand" /> Score Breakdown
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Income</span>
                  <span className="font-semibold">{leadScore.breakdown.income}/20</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deposit</span>
                  <span className="font-semibold">{leadScore.breakdown.deposit}/15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property Value</span>
                  <span className="font-semibold">{leadScore.breakdown.property}/15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Employment</span>
                  <span className="font-semibold">{leadScore.breakdown.employment}/15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Credit History</span>
                  <span className="font-semibold">{leadScore.breakdown.credit}/15</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold mb-4">Next Steps</h3>
              <ul className="space-y-2">
                {leadScore.recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <Check className="size-5 text-brand shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setSubmitted(false)} className="btn-secondary">
                Back to Form
              </button>
              <Link to="/book" className="btn-primary">
                Book a Consultation <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="container-page grid lg:grid-cols-5 gap-10">
        <form onSubmit={handleSubmit} className="lg:col-span-3 bg-card p-8 rounded-3xl ring-1 ring-border">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold">Eligibility Checker</h2>
            <span className="text-[10px] font-mono text-muted-foreground">AUTOMATED LEAD SCORING</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Annual Income
              </label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full px-4 py-3 bg-secondary/60 border border-border rounded-lg text-sm focus:border-brand focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Partner Income
              </label>
              <input
                type="number"
                value={partnerIncome}
                onChange={(e) => setPartnerIncome(Number(e.target.value))}
                className="w-full px-4 py-3 bg-secondary/60 border border-border rounded-lg text-sm focus:border-brand focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Employment Status
              </label>
              <select
                value={employmentStatus}
                onChange={(e) => setEmploymentStatus(e.target.value)}
                className="w-full px-4 py-3 bg-secondary/60 border border-border rounded-lg text-sm focus:border-brand focus:outline-none transition-colors"
              >
                <option>Full-time Employed</option>
                <option>Self-employed</option>
                <option>Contractor</option>
                <option>Director</option>
                <option>Retired</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Deposit Available
              </label>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                className="w-full px-4 py-3 bg-secondary/60 border border-border rounded-lg text-sm focus:border-brand focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Target Property Value
              </label>
              <input
                type="number"
                value={propertyValue}
                onChange={(e) => setPropertyValue(Number(e.target.value))}
                className="w-full px-4 py-3 bg-secondary/60 border border-border rounded-lg text-sm focus:border-brand focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Credit History
              </label>
              <select
                value={creditHistory}
                onChange={(e) => setCreditHistory(e.target.value)}
                className="w-full px-4 py-3 bg-secondary/60 border border-border rounded-lg text-sm focus:border-brand focus:outline-none transition-colors"
              >
                <option>Good — no defaults</option>
                <option>Excellent</option>
                <option>Fair</option>
                <option>Poor</option>
              </select>
            </div>
          </div>
          <div className="mt-8 flex gap-3">
            <button type="submit" className="btn-primary">
              Calculate & Score <ArrowRight className="size-4" />
            </button>
          </div>
        </form>

        <aside className="lg:col-span-2 space-y-4">
          <div className="p-6 bg-brand text-primary-foreground rounded-2xl">
            <div className="text-[11px] uppercase tracking-widest opacity-70 mb-2">Estimated Borrowing</div>
            <div className="text-4xl font-semibold font-display">£{borrowingPower.toLocaleString()}</div>
            <div className="text-sm opacity-70 mt-2">at 4.5x income multiple</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MiniStat label="Total Income" value={`£${totalIncome.toLocaleString()}`} />
            <MiniStat label="Max Price" value={`£${maxPrice.toLocaleString()}`} />
            <MiniStat label="Your Deposit" value={`£${deposit.toLocaleString()}`} />
            <MiniStat label="LTV" value={`${((borrowingPower / maxPrice) * 100).toFixed(0)}%`} />
          </div>
          <div className="p-6 bg-secondary rounded-2xl">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Check className="size-4 text-brand" /> What's Included
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Automated lead scoring</li>
              <li>✓ Personalized recommendations</li>
              <li>✓ Advisor callback within 4 hours</li>
              <li>✓ Mortgage options tailored to you</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

const CALCS = [
  { id: "affordability", icon: <Calculator className="size-4" />, title: "Affordability Calculator", copy: "Income versus borrowing power, with real lender stress-tests baked in.", tag: "MOST USED" },
  { id: "repayment", icon: <Home className="size-4" />, title: "Repayment Calculator", copy: "Monthly mortgage payments across fixed, tracker, and variable options.", tag: "ESSENTIAL" },
  { id: "stampduty", icon: <Landmark className="size-4" />, title: "Stamp Duty Calculator", copy: "Property purchase costs including first-time buyer relief and BTL surcharge.", tag: "UK RATES" },
  { id: "refinance", icon: <TrendingUp className="size-4" />, title: "Refinance Calculator", copy: "Savings after switching lenders, including early repayment charges.", tag: "SAVINGS" },
  { id: "overpayment", icon: <PiggyBank className="size-4" />, title: "Overpayment Calculator", copy: "Impact of extra payments on term length and total interest paid.", tag: "STRATEGY" },
  { id: "btl", icon: <Percent className="size-4" />, title: "Buy-to-Let Calculator", copy: "Rental yield, LTV, and lender stress-test coverage in one view.", tag: "INVESTOR" },
];

const PRODUCTS = [
  {
    img: "/images/services/first-time-buyer.jpg",
    title: "First Time Buyer",
    copy: "Step onto the property ladder with confidence. We work out exactly how much you can borrow, source the best first-time buyer deals and incentives, and guide you through every stage.",
  },
  {
    img: "/images/services/remortgage.jpg",
    title: "Remortgage",
    copy: "Coming to the end of your fixed rate? We search the market to secure a better rate, keep your monthly payments manageable, or release equity to fund home improvements.",
  },
  {
    img: "/images/services/buy-to-let.jpg",
    title: "Buy to Let",
    copy: "Investment mortgages assessed on rental potential, sourced across a wide panel of specialist lenders. Typically needs a 20–25% deposit — with a dedicated adviser for landlords.",
  },
  {
    img: "/images/services/home-mover.jpg",
    title: "Home Mover",
    copy: "Upgrading, downsizing, or simply relocating. We port or replace your existing mortgage and coordinate the chain, paperwork, and surveyors so your move stays stress-free.",
  },
  {
    img: "/images/services/right-to-buy.jpg",
    title: "Right to Buy",
    copy: "Council tenants of two years or more in England and Wales can buy their home at a discount — often with no deposit required. We match you to lenders that support the RTB scheme.",
  },
  {
    img: "/images/services/help-to-buy.jpg",
    title: "Help to Buy",
    copy: "Government-backed schemes that help you buy with a smaller deposit. We check your eligibility and combine scheme support with the most competitive mainstream products.",
  },
];

const SERVICES = [
  {
    img: "/images/services/protection.jpg",
    title: "Protection & Insurance",
    copy: "Life cover, critical illness, income protection, and home insurance to keep your household resilient.",
    href: "/insurance" as const,
  },
  {
    img: "/images/services/loans.jpg",
    title: "Personal Loans",
    copy: "Secured and unsecured personal loans compared across lenders to fund your next plan.",
    href: undefined,
  },
  {
    img: "/images/services/commercial.jpg",
    title: "Commercial Mortgages",
    copy: "Finance for commercial premises and limited-company purchases, including complex cases.",
    href: undefined,
  },
  {
    img: "/images/services/bridging.jpg",
    title: "Bridging Loans",
    copy: "Short-term finance to bridge the gap between buying and selling, or to move quickly at auction.",
    href: undefined,
  },
  {
    img: "/images/services/wills.jpg",
    title: "Wills",
    copy: "Protect your family's future with professionally drafted wills through our trusted partners.",
    href: undefined,
  },
  {
    img: "/images/services/conveyancing.jpg",
    title: "Conveyancing",
    copy: "Reliable conveyancing partners to handle the legal side of your purchase or sale.",
    href: undefined,
  },
  {
    img: "/images/services/energy.jpg",
    title: "Heating & Saving Energy",
    copy: "Make your home warmer and cheaper to run — insulation, heat pumps, solar, and smart meters. We can help fund the work with additional borrowing, a green remortgage, or a home-improvement loan, and point you to government grants.",
    href: undefined,
  },
];

// Calculator Modal Component
function CalculatorModal({ calculatorId, onClose }: { calculatorId: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ring-1 ring-border">
        <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            {CALCS.find(c => c.id === calculatorId)?.title}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg">
            <X className="size-5" />
          </button>
        </div>
        <div className="p-8">
          {calculatorId === "stampduty" && <StampDutyCalculator />}
          {calculatorId === "refinance" && <RefinanceCalculator />}
          {calculatorId === "overpayment" && <OverpaymentCalculator />}
          {calculatorId === "repayment" && <RepaymentCalculator />}
          {calculatorId === "affordability" && <AffordabilityCalculator />}
          {calculatorId === "btl" && <BTLCalculator />}
        </div>
      </div>
    </div>
  );
}

// Stamp Duty Calculator
function StampDutyCalculator() {
  const [propertyPrice, setPropertyPrice] = useState(400000);
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(true);
  const [isBTL, setIsBTL] = useState(false);

  const calculateStampDuty = (price: number, firstTime: boolean, btl: boolean) => {
    let duty = 0;
    
    if (firstTime && !btl) {
      // First-time buyer relief up to £425k
      if (price > 425000) {
        duty = (price - 425000) * 0.05;
      }
    } else {
      // Standard rates
      if (price <= 250000) duty = 0;
      else if (price <= 925000) duty = (price - 250000) * 0.05;
      else if (price <= 1500000) duty = 250000 * 0.05 + (price - 925000) * 0.1;
      else duty = 250000 * 0.05 + 575000 * 0.1 + (price - 1500000) * 0.12;
      
      // BTL surcharge
      if (btl) duty += price * 0.03;
    }
    
    return Math.round(duty);
  };

  const stampDuty = calculateStampDuty(propertyPrice, isFirstTimeBuyer, isBTL);
  const totalCost = propertyPrice + stampDuty;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold mb-3">Property Price: £{propertyPrice.toLocaleString()}</label>
        <input
          type="range"
          min="50000"
          max="2000000"
          step="10000"
          value={propertyPrice}
          onChange={(e) => setPropertyPrice(Number(e.target.value))}
          className="w-full accent-brand"
        />
        <div className="flex gap-4 text-xs text-muted-foreground mt-2">
          <span>£50k</span>
          <span className="flex-1 text-right">£2m</span>
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isFirstTimeBuyer}
            onChange={(e) => setIsFirstTimeBuyer(e.target.checked)}
            className="accent-brand"
          />
          <span className="text-sm">First-time buyer (relief up to £425k)</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isBTL}
            onChange={(e) => setIsBTL(e.target.checked)}
            className="accent-brand"
            disabled={isFirstTimeBuyer}
          />
          <span className="text-sm">Buy-to-Let property (+3% surcharge)</span>
        </label>
      </div>

      <div className="bg-secondary/60 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Stamp Duty Tax:</span>
          <span className="text-2xl font-semibold text-brand">£{stampDuty.toLocaleString()}</span>
        </div>
        <div className="border-t border-border pt-4 flex justify-between items-center">
          <span className="font-semibold">Total Cost (inc. SDLT):</span>
          <span className="text-2xl font-semibold">£{totalCost.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

// Refinance Calculator
function RefinanceCalculator() {
  const [currentBalance, setCurrentBalance] = useState(350000);
  const [currentRate, setCurrentRate] = useState(4.5);
  const [newRate, setNewRate] = useState(3.9);
  const [remainingYears, setRemainingYears] = useState(23);
  const [earlyRepaymentCharge, setEarlyRepaymentCharge] = useState(2000);

  const calculateMonthlyPayment = (balance: number, rate: number, years: number) => {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    if (monthlyRate === 0) return balance / months;
    return (balance * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  };

  const currentMonthly = calculateMonthlyPayment(currentBalance, currentRate, remainingYears);
  const newMonthly = calculateMonthlyPayment(currentBalance, newRate, remainingYears);
  const monthlySavings = currentMonthly - newMonthly;
  const totalSavingsBeforeCharges = monthlySavings * remainingYears * 12;
  const netSavings = totalSavingsBeforeCharges - earlyRepaymentCharge;
  const breakEvenMonths = earlyRepaymentCharge > 0 ? Math.ceil(earlyRepaymentCharge / monthlySavings) : 0;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold mb-2">Current Mortgage Balance: £{currentBalance.toLocaleString()}</label>
        <input
          type="number"
          value={currentBalance}
          onChange={(e) => setCurrentBalance(Number(e.target.value))}
          className="w-full px-4 py-2 bg-secondary/60 border border-border rounded-lg text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Current Rate (%): {currentRate.toFixed(2)}</label>
          <input
            type="range"
            min="2"
            max="7"
            step="0.1"
            value={currentRate}
            onChange={(e) => setCurrentRate(Number(e.target.value))}
            className="w-full accent-brand"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">New Rate (%): {newRate.toFixed(2)}</label>
          <input
            type="range"
            min="2"
            max="7"
            step="0.1"
            value={newRate}
            onChange={(e) => setNewRate(Number(e.target.value))}
            className="w-full accent-brand"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Remaining Years: {remainingYears}</label>
          <input
            type="range"
            min="1"
            max="30"
            value={remainingYears}
            onChange={(e) => setRemainingYears(Number(e.target.value))}
            className="w-full accent-brand"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Early Repayment Charge: £{earlyRepaymentCharge.toLocaleString()}</label>
          <input
            type="number"
            value={earlyRepaymentCharge}
            onChange={(e) => setEarlyRepaymentCharge(Number(e.target.value))}
            className="w-full px-4 py-2 bg-secondary/60 border border-border rounded-lg text-sm"
          />
        </div>
      </div>

      <div className="bg-secondary/60 rounded-2xl p-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Current Monthly Payment:</span>
          <span className="font-semibold">£{currentMonthly.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">New Monthly Payment:</span>
          <span className="font-semibold">£{newMonthly.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center border-t border-border pt-3">
          <span className="text-muted-foreground">Monthly Savings:</span>
          <span className="text-xl font-semibold text-brand">£{monthlySavings.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Break-even Point:</span>
          <span className="font-semibold">{breakEvenMonths} months</span>
        </div>
        <div className="bg-brand/10 border border-brand/30 rounded-lg p-3 flex justify-between items-center">
          <span className="font-semibold">Total Savings (over {remainingYears} yrs):</span>
          <span className={`text-lg font-bold ${netSavings >= 0 ? "text-green-600" : "text-red-600"}`}>
            £{netSavings.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

// Overpayment Calculator
function OverpaymentCalculator() {
  const [loanAmount, setLoanAmount] = useState(350000);
  const [interestRate, setInterestRate] = useState(4.5);
  const [mortgageYears, setMortgageYears] = useState(25);
  const [monthlyOverpayment, setMonthlyOverpayment] = useState(200);

  const calculateMonthlyPayment = (balance: number, rate: number, years: number) => {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    if (monthlyRate === 0) return balance / months;
    return (balance * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  };

  const regularPayment = calculateMonthlyPayment(loanAmount, interestRate, mortgageYears);
  const standardTotalInterest = regularPayment * mortgageYears * 12 - loanAmount;
  
  let balance = loanAmount;
  let monthsCount = 0;
  const monthlyRate = interestRate / 100 / 12;
  
  while (balance > 0 && monthsCount < mortgageYears * 12) {
    const interest = balance * monthlyRate;
    balance -= (regularPayment + monthlyOverpayment - interest);
    monthsCount++;
  }

  const yearsReduced = (mortgageYears * 12 - monthsCount) / 12;
  const totalPaidWithOverpayment = (regularPayment + monthlyOverpayment) * monthsCount;
  const interestPaidWithOverpayment = totalPaidWithOverpayment - loanAmount;
  const interestSaved = standardTotalInterest - interestPaidWithOverpayment;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold mb-2">Loan Amount: £{loanAmount.toLocaleString()}</label>
        <input
          type="number"
          value={loanAmount}
          onChange={(e) => setLoanAmount(Number(e.target.value))}
          className="w-full px-4 py-2 bg-secondary/60 border border-border rounded-lg text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Interest Rate (%): {interestRate.toFixed(2)}</label>
          <input
            type="range"
            min="2"
            max="7"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full accent-brand"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Mortgage Term (Years): {mortgageYears}</label>
          <input
            type="range"
            min="5"
            max="40"
            value={mortgageYears}
            onChange={(e) => setMortgageYears(Number(e.target.value))}
            className="w-full accent-brand"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Monthly Overpayment: £{monthlyOverpayment.toLocaleString()}</label>
        <input
          type="range"
          min="0"
          max="1000"
          step="50"
          value={monthlyOverpayment}
          onChange={(e) => setMonthlyOverpayment(Number(e.target.value))}
          className="w-full accent-brand"
        />
      </div>

      <div className="bg-secondary/60 rounded-2xl p-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Regular Monthly Payment:</span>
          <span className="font-semibold">£{regularPayment.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total Monthly Payment:</span>
          <span className="font-semibold">£{(regularPayment + monthlyOverpayment).toFixed(2)}</span>
        </div>
        <div className="border-t border-border pt-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-muted-foreground">Mortgage Paid Off In:</span>
            <span className="text-xl font-semibold text-brand">{(monthsCount / 12).toFixed(1)} years</span>
          </div>
          <div className="text-xs text-muted-foreground">
            (Saves {yearsReduced.toFixed(1)} years)
          </div>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex justify-between items-center">
          <span className="font-semibold">Interest Saved:</span>
          <span className="text-lg font-bold text-green-600">£{interestSaved.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

// Repayment Calculator
function RepaymentCalculator() {
  const [loanAmount, setLoanAmount] = useState(350000);
  const [interestRate, setInterestRate] = useState(4.5);
  const [mortgageYears, setMortgageYears] = useState(25);

  const calculateMonthlyPayment = (balance: number, rate: number, years: number) => {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    if (monthlyRate === 0) return balance / months;
    return (balance * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  };

  const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, mortgageYears);
  const totalPayment = monthlyPayment * mortgageYears * 12;
  const totalInterest = totalPayment - loanAmount;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold mb-2">Loan Amount: £{loanAmount.toLocaleString()}</label>
        <input
          type="number"
          value={loanAmount}
          onChange={(e) => setLoanAmount(Number(e.target.value))}
          className="w-full px-4 py-2 bg-secondary/60 border border-border rounded-lg text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Interest Rate (%): {interestRate.toFixed(2)}</label>
          <input
            type="range"
            min="2"
            max="7"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full accent-brand"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Mortgage Term (Years): {mortgageYears}</label>
          <input
            type="range"
            min="5"
            max="40"
            value={mortgageYears}
            onChange={(e) => setMortgageYears(Number(e.target.value))}
            className="w-full accent-brand"
          />
        </div>
      </div>

      <div className="bg-secondary/60 rounded-2xl p-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Monthly Payment:</span>
          <span className="text-3xl font-bold text-brand">£{monthlyPayment.toFixed(2)}</span>
        </div>
        <div className="border-t border-border pt-3 flex justify-between items-center">
          <span className="text-muted-foreground">Total Interest Paid:</span>
          <span className="text-lg font-semibold">£{totalInterest.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total Amount Paid:</span>
          <span className="text-lg font-semibold">£{totalPayment.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

// Affordability Calculator
function AffordabilityCalculator() {
  const [income, setIncome] = useState(85000);
  const [partnerIncome, setPartnerIncome] = useState(0);
  const [deposit, setDeposit] = useState(45000);
  const [multipleUsed, setMultipleUsed] = useState(4.5);

  const totalIncome = income + partnerIncome;
  const borrowingPower = totalIncome * multipleUsed;
  const maxPropertyPrice = borrowingPower + deposit;
  const loanToValue = (borrowingPower / maxPropertyPrice * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold mb-2">Annual Income: £{income.toLocaleString()}</label>
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(Number(e.target.value))}
          className="w-full px-4 py-2 bg-secondary/60 border border-border rounded-lg text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Partner Income: £{partnerIncome.toLocaleString()}</label>
        <input
          type="number"
          value={partnerIncome}
          onChange={(e) => setPartnerIncome(Number(e.target.value))}
          className="w-full px-4 py-2 bg-secondary/60 border border-border rounded-lg text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Deposit Available: £{deposit.toLocaleString()}</label>
        <input
          type="number"
          value={deposit}
          onChange={(e) => setDeposit(Number(e.target.value))}
          className="w-full px-4 py-2 bg-secondary/60 border border-border rounded-lg text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Income Multiple: {multipleUsed.toFixed(1)}x</label>
        <input
          type="range"
          min="3"
          max="5"
          step="0.1"
          value={multipleUsed}
          onChange={(e) => setMultipleUsed(Number(e.target.value))}
          className="w-full accent-brand"
        />
      </div>

      <div className="bg-secondary/60 rounded-2xl p-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total Income:</span>
          <span className="font-semibold">£{totalIncome.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Borrowing Power:</span>
          <span className="text-xl font-semibold text-brand">£{borrowingPower.toLocaleString()}</span>
        </div>
        <div className="border-t border-border pt-3 flex justify-between items-center">
          <span className="text-muted-foreground">Max Property Price:</span>
          <span className="text-2xl font-bold">£{maxPropertyPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">LTV:</span>
          <span className="font-semibold">{loanToValue}%</span>
        </div>
      </div>
    </div>
  );
}

// BTL Calculator
function BTLCalculator() {
  const [propertyPrice, setPropertyPrice] = useState(500000);
  const [rentalIncome, setRentalIncome] = useState(2000);
  const [deposit, setDeposit] = useState(150000);
  const [interestRate, setInterestRate] = useState(5.5);

  const loanAmount = propertyPrice - deposit;
  const ltv = ((loanAmount / propertyPrice) * 100).toFixed(1);
  const annualRental = rentalIncome * 12;
  const grossYield = ((annualRental / propertyPrice) * 100).toFixed(2);
  
  const monthlyRate = interestRate / 100 / 12;
  const months = 25 * 12;
  const monthlyInterest = months > 0 ? (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months)) : 0;
  const netMonthly = rentalIncome - monthlyInterest;
  const netYield = ((netMonthly * 12 / propertyPrice) * 100).toFixed(2);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold mb-2">Property Price: £{propertyPrice.toLocaleString()}</label>
        <input
          type="number"
          value={propertyPrice}
          onChange={(e) => setPropertyPrice(Number(e.target.value))}
          className="w-full px-4 py-2 bg-secondary/60 border border-border rounded-lg text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Monthly Rental Income: £{rentalIncome.toLocaleString()}</label>
        <input
          type="number"
          value={rentalIncome}
          onChange={(e) => setRentalIncome(Number(e.target.value))}
          className="w-full px-4 py-2 bg-secondary/60 border border-border rounded-lg text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Deposit: £{deposit.toLocaleString()}</label>
        <input
          type="number"
          value={deposit}
          onChange={(e) => setDeposit(Number(e.target.value))}
          className="w-full px-4 py-2 bg-secondary/60 border border-border rounded-lg text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Interest Rate (%): {interestRate.toFixed(2)}</label>
        <input
          type="range"
          min="3"
          max="8"
          step="0.1"
          value={interestRate}
          onChange={(e) => setInterestRate(Number(e.target.value))}
          className="w-full accent-brand"
        />
      </div>

      <div className="bg-secondary/60 rounded-2xl p-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Loan Amount:</span>
          <span className="font-semibold">£{loanAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">LTV:</span>
          <span className="font-semibold">{ltv}%</span>
        </div>
        <div className="border-t border-border pt-3 flex justify-between items-center">
          <span className="text-muted-foreground">Gross Yield:</span>
          <span className="text-lg font-semibold text-brand">{grossYield}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Monthly Interest Payment:</span>
          <span className="font-semibold">£{monthlyInterest.toFixed(2)}</span>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex justify-between items-center">
          <span className="font-semibold">Net Monthly (after interest):</span>
          <span className={`text-lg font-bold ${netMonthly >= 0 ? "text-green-600" : "text-red-600"}`}>
            £{netMonthly.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Net Yield:</span>
          <span className="font-semibold">{netYield}%</span>
        </div>
      </div>
    </div>
  );
}
