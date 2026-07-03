import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Clock,
  FileCheck2,
  Calculator,
  Users,
  Home as HomeIcon,
  HeartPulse,
  Building2,
  Award,
  CheckCircle2,
} from "lucide-react";
import heroHome from "@/assets/hero-home.jpg";
import familyLifestyle from "@/assets/family-lifestyle.jpg";
import textureEmerald from "@/assets/texture-emerald.jpg";
import { SectionHeading } from "@/components/site/section-heading";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vantage & Co. — Compare Mortgage & Insurance Solutions in Minutes" },
      {
        name: "description",
        content:
          "Independent FCA-regulated mortgage and protection advice. Instant eligibility, live rate comparison, and a secure client portal — all in one place.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="container-page grid grid-cols-1 lg:grid-cols-12 gap-16 items-start relative">
          <div className="lg:col-span-7 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-soft border border-brand/10 text-brand text-[11px] font-semibold uppercase tracking-widest mb-8">
              <span className="size-1.5 rounded-full bg-brand animate-pulse-dot" />
              FCA Regulated · Whole-of-market
            </div>
            <h1 className="text-5xl lg:text-7xl font-semibold leading-[0.98] text-foreground text-balance max-w-[18ch] mb-8">
              Compare mortgage &amp; insurance solutions in minutes.
            </h1>
            <p className="text-lg text-muted-foreground text-pretty max-w-[52ch] mb-10 leading-relaxed">
              Sophisticated lending and comprehensive protection through our regulated brokerage.
              Transparent, rapid, and tailored to your portfolio — with 90+ lenders and 40+ insurers under one roof.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/mortgages" className="btn-primary">
                Get Mortgage Assessment <ArrowRight className="size-4" />
              </Link>
              <Link to="/compare" className="btn-secondary">Compare Insurance Quotes</Link>
              <Link to="/book" className="btn-secondary">Book a Consultation</Link>
            </div>
            <div className="mt-16 pt-8 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-6">
              <Stat value="£2.4B" label="Lending facilitated" />
              <Stat value="15,000+" label="Clients advised" />
              <Stat value="4.9★" label="Google rating" />
              <Stat value="14 yrs" label="Regulated experience" />
            </div>
          </div>

          {/* Eligibility Widget */}
          <div className="lg:col-span-5 animate-fade-up [animation-delay:150ms]">
            <div className="bg-secondary p-1 rounded-2xl ring-1 ring-border shadow-xl shadow-brand/5">
              <div className="bg-card p-7 rounded-[calc(1rem-2px)]">
                <h3 className="text-sm font-semibold mb-6 flex items-center justify-between">
                  Eligibility Checker
                  <span className="text-[10px] bg-brand-soft text-brand px-2 py-1 rounded-full uppercase tracking-wider font-semibold">
                    Instant Result
                  </span>
                </h3>
                <div className="space-y-6">
                  <Slider label="Household Income" value="£85,000 / year" pct={66} />
                  <Slider label="Available Deposit" value="£45,000" pct={28} />
                  <Slider label="Target Property Value" value="£470,000" pct={72} />
                  <div className="p-5 bg-brand-soft rounded-xl border border-brand/10">
                    <div className="text-[11px] text-brand font-bold uppercase tracking-widest mb-1">
                      Estimated Borrowing
                    </div>
                    <div className="text-3xl font-semibold text-brand font-display">£425,000</div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Monthly repayment est. <span className="font-semibold text-foreground">£1,840</span> at 4.12% APR
                    </div>
                  </div>
                  <Link to="/mortgages" className="block w-full text-center py-3 bg-ink text-primary-foreground text-sm font-medium rounded-lg hover:bg-ink/90 transition-colors">
                    Full Eligibility Report
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* subtle texture bg */}
        <div
          aria-hidden
          className="absolute -z-10 -top-32 -right-32 size-[500px] rounded-full bg-brand/5 blur-[120px] pointer-events-none"
        />
      </section>

      {/* Partner marquee */}
      <section className="border-y border-border bg-secondary/40 py-6 overflow-hidden">
        <div className="flex items-center gap-16 whitespace-nowrap animate-marquee">
          {[...PARTNERS, ...PARTNERS].map((p, i) => (
            <span key={i} className="text-sm font-semibold tracking-tight text-muted-foreground/60">
              {p}
            </span>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="What we do"
            title={<>Two disciplines. <em className="font-normal italic">One firm.</em></>}
            description="From your first-time purchase to protecting the life you've built — one advisor, one relationship, end-to-end."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ServiceCard
              icon={<HomeIcon className="size-5" />}
              title="Mortgages"
              copy="Residential, buy-to-let, remortgage, and specialist lending — screened across 90+ lenders."
              items={["Affordability & eligibility", "Rate comparison", "Refinance & overpayment tools", "Stamp duty calculator"]}
              href="/mortgages"
              tone="dark"
            />
            <ServiceCard
              icon={<HeartPulse className="size-5" />}
              title="Insurance"
              copy="Protection strategies that keep your household, income, and business resilient across every life stage."
              items={["Life & critical illness", "Income protection", "Home & landlord", "Business insurance"]}
              href="/insurance"
              tone="light"
            />
          </div>
        </div>
      </section>

      {/* Calculators grid */}
      <section className="py-24 bg-secondary/40 border-y border-border">
        <div className="container-page">
          <SectionHeading
            eyebrow="Tools"
            title="Model your numbers. Instantly."
            description="Five calculators that mirror what our advisors use — no signup required."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CALCS.map((c) => (
              <div key={c.title} className="group bg-card rounded-2xl p-6 ring-1 ring-border hover:ring-brand/30 transition-all">
                <div className="size-10 rounded-lg bg-brand-soft text-brand grid place-items-center mb-5 group-hover:bg-brand group-hover:text-primary-foreground transition-colors">
                  <Calculator className="size-4" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{c.copy}</p>
                <Link to="/mortgages" className="text-xs font-semibold text-brand inline-flex items-center gap-1">
                  Open calculator <ArrowRight className="size-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compare Rates preview */}
      <section className="py-24">
        <div className="container-page">
          <div className="flex items-end justify-between mb-10 gap-6 flex-wrap">
            <SectionHeading
              eyebrow="Quote comparison"
              title="Compare market rates in real time."
              description="Live comparison across our network of 90+ high-street and specialist lenders."
            />
            <Link to="/compare" className="btn-secondary shrink-0">See full comparison</Link>
          </div>
          <div className="overflow-hidden ring-1 ring-border rounded-2xl bg-card">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/60 border-b border-border">
                  <th className="p-4 eyebrow">Lender</th>
                  <th className="p-4 eyebrow">Product</th>
                  <th className="p-4 eyebrow text-right">Initial Rate</th>
                  <th className="p-4 eyebrow text-right">APRC</th>
                  <th className="p-4 eyebrow text-right">Monthly</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {RATES.map((r) => (
                  <tr key={r.lender} className="hover:bg-secondary/30 transition-colors">
                    <td className="p-4 font-medium text-sm">{r.lender}</td>
                    <td className="p-4 text-sm text-muted-foreground">{r.product}</td>
                    <td className="p-4 text-sm font-semibold text-right font-display">{r.rate}</td>
                    <td className="p-4 text-sm text-muted-foreground text-right">{r.aprc}</td>
                    <td className="p-4 text-sm text-right">{r.monthly}</td>
                    <td className="p-4 text-right">
                      <Link to="/compare" className="text-xs font-semibold text-brand">View →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Editorial split with image */}
      <section className="py-24 bg-ink text-primary-foreground overflow-hidden relative">
        <div className="container-page grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="eyebrow mb-4 text-brand-accent">The client experience</div>
            <h2 className="text-4xl md:text-5xl font-semibold text-balance mb-6">
              A private command centre for the biggest financial decision of your life.
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-8 max-w-[52ch]">
              Upload documents once. Watch your application move through underwriting, valuation, and offer in real
              time. Message your advisor without leaving the browser.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                "Instant document OCR extraction",
                "Milestone tracking with push notifications",
                "Bank-grade encryption and secure vault storage",
                "AI advisor available 24/7 for FAQs",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-sm">
                  <CheckCircle2 className="size-5 text-brand-accent shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <Link to="/dashboard" className="inline-flex items-center gap-2 bg-primary-foreground text-ink py-3 px-5 rounded-lg text-sm font-medium hover:bg-primary-foreground/90 transition-colors">
              View client dashboard <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="relative">
            <img
              src={textureEmerald}
              alt=""
              className="rounded-2xl w-full aspect-[4/3] object-cover"
              width={1280}
              height={720}
              loading="lazy"
            />
            <div className="absolute -bottom-6 -left-6 bg-card text-foreground p-5 rounded-xl shadow-2xl ring-1 ring-border max-w-[240px]">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="size-4 text-brand" />
                <span className="text-xs font-semibold">AI Advisor</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                "Your P60 is uploaded. Want me to notify your advisor now?"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Word of mouth"
            title="What our clients say."
            description="Across 2,400+ reviews, families and professionals trust Vantage to move fast without cutting corners."
          />
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <figure key={t.author} className="bg-card p-7 rounded-2xl ring-1 ring-border">
                <div className="flex gap-0.5 text-brand-accent mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="text-foreground leading-relaxed mb-6 font-display text-lg">
                  "{t.quote}"
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-secondary grid place-items-center text-xs font-semibold">
                    {t.author.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.author}</div>
                    <div className="text-xs text-muted-foreground">{t.meta}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Case study */}
      <section className="py-24 bg-secondary/40 border-y border-border">
        <div className="container-page grid lg:grid-cols-2 gap-16 items-center">
          <img
            src={familyLifestyle}
            alt="A family in their new kitchen"
            className="rounded-2xl w-full aspect-[4/3] object-cover"
            width={1280}
            height={960}
            loading="lazy"
          />
          <div>
            <div className="eyebrow mb-4 text-brand">Case study</div>
            <h2 className="text-4xl font-semibold text-balance mb-6">
              How a self-employed couple secured £480k in 11 days.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              James and Priya had been declined twice by high-street lenders due to fluctuating self-employed income.
              We repositioned their application with a specialist lender using retained earnings — offer issued in
              under two weeks.
            </p>
            <div className="grid grid-cols-3 gap-6 mb-8">
              <Stat value="11 days" label="Offer issued" />
              <Stat value="£480k" label="Approved amount" />
              <Stat value="3.94%" label="Fixed rate" />
            </div>
            <Link to="/resources" className="text-sm font-semibold text-brand inline-flex items-center gap-2">
              Read the case study <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="How it works"
            title="A fully automated journey — with a human on call."
            description="Seven steps from first click to funded, coordinated by your dedicated advisor."
          />
          <div className="grid md:grid-cols-4 gap-4">
            {JOURNEY.map((step, i) => (
              <div key={step.title} className="relative bg-card p-6 rounded-2xl ring-1 ring-border">
                <div className="text-[10px] font-mono text-muted-foreground mb-3">STEP {String(i + 1).padStart(2, "0")}</div>
                <div className="size-10 rounded-lg bg-brand-soft text-brand grid place-items-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-base font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl bg-ink text-primary-foreground p-12 md:p-20">
            <img
              src={heroHome}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-25"
              width={1280}
              height={1600}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-linear-to-r from-ink via-ink/90 to-ink/40" />
            <div className="relative max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-semibold text-balance mb-6">
                Ready to know exactly what you can borrow?
              </h2>
              <p className="text-zinc-300 mb-8 leading-relaxed">
                Ninety seconds. No credit check. Real answers from real lenders.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/mortgages" className="inline-flex items-center gap-2 bg-primary-foreground text-ink py-3 px-5 rounded-lg text-sm font-medium hover:bg-primary-foreground/90 transition-colors">
                  Start eligibility check <ArrowRight className="size-4" />
                </Link>
                <Link to="/book" className="inline-flex items-center gap-2 border border-white/20 py-3 px-5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
                  Book a consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-semibold font-display">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function Slider({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
        {label}
      </label>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className="h-full bg-brand rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-2 text-sm font-medium">{value}</div>
    </div>
  );
}

function ServiceCard({
  icon,
  title,
  copy,
  items,
  href,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  copy: string;
  items: string[];
  href: "/mortgages" | "/insurance";
  tone: "dark" | "light";
}) {
  const dark = tone === "dark";
  return (
    <Link
      to={href}
      className={`group relative overflow-hidden rounded-3xl p-10 ring-1 transition-all ${
        dark
          ? "bg-ink text-primary-foreground ring-transparent"
          : "bg-card text-foreground ring-border hover:ring-brand/30"
      }`}
    >
      <div
        className={`size-11 rounded-xl grid place-items-center mb-6 ${
          dark ? "bg-white/10 text-brand-accent" : "bg-brand-soft text-brand"
        }`}
      >
        {icon}
      </div>
      <h3 className="text-2xl font-semibold mb-3">{title}</h3>
      <p className={`text-sm mb-6 max-w-[40ch] leading-relaxed ${dark ? "text-zinc-400" : "text-muted-foreground"}`}>
        {copy}
      </p>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-2 mb-8">
        {items.map((i) => (
          <li key={i} className={`text-sm flex gap-2 ${dark ? "text-zinc-300" : "text-foreground"}`}>
            <span className={`mt-1.5 size-1 rounded-full ${dark ? "bg-brand-accent" : "bg-brand"}`} />
            {i}
          </li>
        ))}
      </ul>
      <div className={`inline-flex items-center gap-2 text-sm font-semibold ${dark ? "text-brand-accent" : "text-brand"}`}>
        Explore {title.toLowerCase()} <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

const PARTNERS = [
  "HALIFAX", "NATIONWIDE", "SANTANDER", "BARCLAYS", "HSBC", "LLOYDS", "NATWEST",
  "AVIVA", "LEGAL & GENERAL", "VITALITY", "ROYAL LONDON", "LLOYDS OF LONDON",
];

const CALCS = [
  { title: "Affordability", copy: "Model your borrowing power against income, outgoings, and dependants." },
  { title: "Repayment", copy: "See exact monthly cost across fixed, tracker, and variable terms." },
  { title: "Stamp Duty", copy: "Calculate purchase costs including first-time buyer relief and BTL surcharge." },
  { title: "Refinance", copy: "Compare your current deal against the market — see lifetime savings." },
  { title: "Overpayment", copy: "Visualise how extra payments shorten your mortgage term and reduce interest." },
  { title: "Buy-to-Let", copy: "Rental yield, LTV, and stress-test coverage against lender criteria." },
];

const RATES = [
  { lender: "Halifax", product: "2 Year Fixed · 75% LTV", rate: "4.12%", aprc: "6.8%", monthly: "£1,840" },
  { lender: "Nationwide", product: "5 Year Fixed · 80% LTV", rate: "3.89%", aprc: "5.9%", monthly: "£1,795" },
  { lender: "Santander", product: "Tracker · Base + 0.5%", rate: "5.75%", aprc: "6.2%", monthly: "£2,140" },
  { lender: "Barclays Premier", product: "5 Year Fixed · 60% LTV", rate: "3.68%", aprc: "5.4%", monthly: "£1,752" },
  { lender: "HSBC", product: "2 Year Fixed · 85% LTV", rate: "4.31%", aprc: "6.9%", monthly: "£1,880" },
];

const TESTIMONIALS = [
  {
    quote: "Secured our first home in under 48 hours. The document portal is a genuine relief.",
    author: "Eleanor Vance",
    meta: "First-time buyer, London",
  },
  {
    quote: "Two high-street lenders declined our BTL. Vantage placed it in nine days at a better rate.",
    author: "Marcus & Nadia Okafor",
    meta: "Portfolio landlords, Manchester",
  },
  {
    quote: "The refinance calculator alone saved us £14,200 over the term. Impeccable advice.",
    author: "Dr. Priya Shah",
    meta: "Remortgage client, Bristol",
  },
];

const JOURNEY = [
  { icon: <TrendingUp className="size-4" />, title: "Check eligibility", copy: "90-second checker returns your true borrowing power." },
  { icon: <Award className="size-4" />, title: "Compare quotes", copy: "Live rates across 90+ lenders and 40+ insurers." },
  { icon: <Users className="size-4" />, title: "Meet your advisor", copy: "Video or in-person, at a time that suits you." },
  { icon: <FileCheck2 className="size-4" />, title: "Upload documents", copy: "Secure portal with OCR verification and progress tracker." },
  { icon: <Building2 className="size-4" />, title: "Application submitted", copy: "Real-time status from decision-in-principle to offer." },
  { icon: <ShieldCheck className="size-4" />, title: "Protection layered", copy: "Life, income, and home cover matched to your circumstances." },
  { icon: <Clock className="size-4" />, title: "Renewal reminders", copy: "30, 14, and 7-day alerts — automated, forever." },
  { icon: <Sparkles className="size-4" />, title: "Ongoing advice", copy: "Annual review with your advisor as your life evolves." },
];
