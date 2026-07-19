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
import { GetStartedHero } from "@/components/site/get-started-hero";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fasttrack Mortgages — Compare Mortgage & Insurance Solutions in Minutes" },
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
      <GetStartedHero />

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

      {/* Products & services */}
      <section id="services" className="py-24 bg-secondary/40 border-y border-border scroll-mt-24">
        <div className="container-page">
          <div className="mb-14 max-w-3xl">
            <div className="eyebrow mb-4 text-brand">What we offer</div>
            <h2 className="text-5xl md:text-7xl font-semibold text-foreground text-balance mb-6 leading-[0.98]">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed max-w-[60ch]">
              Six mortgage products, whole-of-market — plus protection, loans, and the legal side of moving. Whatever
              your circumstances, there's a product for it. We search the market, handle the paperwork, and place
              cases the high street turns away.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {HOME_PRODUCTS.map((p) => (
              <Link
                key={p.title}
                to="/mortgages"
                search={{ type: p.title }}
                hash="enquiry"
                className="group bg-card rounded-2xl ring-1 ring-border hover:ring-brand/30 transition-all hover:shadow-md overflow-hidden"
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
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.copy}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-14">
            <div className="eyebrow mb-6 text-brand">More than mortgages</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {HOME_SERVICES.map((s) => {
                const cardClass =
                  "group bg-card rounded-2xl ring-1 ring-border hover:ring-brand/30 transition-all overflow-hidden";
                const inner = (
                  <>
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
                    <div className="p-6">
                      <div className="text-sm font-semibold mb-1">{s.title}</div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{s.copy}</p>
                    </div>
                  </>
                );
                return "to" in s && s.to ? (
                  <Link key={s.title} to={s.to} className={cardClass}>
                    {inner}
                  </Link>
                ) : (
                  <Link key={s.title} to="/book" search={{ service: s.title }} className={cardClass}>
                    {inner}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-10">
            <Link to="/mortgages" className="btn-primary">
              Explore all products <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Calculators grid */}
      <section className="py-24">
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
            <Link to="/portal" className="inline-flex items-center gap-2 bg-primary-foreground text-ink py-3 px-5 rounded-lg text-sm font-medium hover:bg-primary-foreground/90 transition-colors">
              View client portal <ArrowRight className="size-4" />
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
            description="Across 80+ five-star reviews, families and professionals trust Fasttrack to move fast without cutting corners."
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

const HOME_PRODUCTS = [
  { img: "/images/services/first-time-buyer.jpg", title: "First Time Buyer", copy: "Work out what you can borrow and get the best first-time buyer deals and incentives." },
  { img: "/images/services/remortgage.jpg", title: "Remortgage", copy: "Beat your reverting rate, lower your payments, or release equity for home improvements." },
  { img: "/images/services/buy-to-let.jpg", title: "Buy to Let", copy: "Investment mortgages sourced across specialist lenders, with a dedicated adviser for landlords." },
  { img: "/images/services/home-mover.jpg", title: "Home Mover", copy: "Porting or replacing your mortgage and managing the chain when you move home." },
  { img: "/images/services/right-to-buy.jpg", title: "Right to Buy", copy: "Council tenants can buy at a discount — often with no deposit needed." },
  { img: "/images/services/help-to-buy.jpg", title: "Help to Buy", copy: "Government-backed schemes that let you buy with a smaller deposit." },
];

const HOME_SERVICES = [
  { img: "/images/services/protection.jpg", title: "Protection & Insurance", copy: "Life, critical illness, income protection, and home cover.", to: "/insurance" as const },
  { img: "/images/services/loans.jpg", title: "Personal Loans", copy: "Secured and unsecured loans compared across lenders." },
  { img: "/images/services/commercial.jpg", title: "Commercial Mortgages", copy: "Finance for commercial premises and limited companies." },
  { img: "/images/services/bridging.jpg", title: "Bridging Loans", copy: "Short-term finance to move quickly or bridge a sale." },
  { img: "/images/services/wills.jpg", title: "Wills", copy: "Professionally drafted wills through trusted partners." },
  { img: "/images/services/conveyancing.jpg", title: "Conveyancing", copy: "Reliable partners for the legal side of your move." },
  { img: "/images/services/energy.jpg", title: "Heating & Saving Energy", copy: "Cut bills with insulation, heat pumps and solar — plus green finance and grants." },
];

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
    quote: "Two high-street lenders declined our BTL. Fasttrack placed it in nine days at a better rate.",
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
