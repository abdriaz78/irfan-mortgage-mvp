import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HeartPulse, Shield, Activity, Home, Building2, Briefcase, CheckCircle2, X, Check } from "lucide-react";
import { useState } from "react";
import { calculateLeadScore, formatLeadScore, saveLead, type LeadData } from "@/lib/lead-scoring";

export const Route = createFileRoute("/insurance")({
  head: () => ({
    meta: [
      { title: "Insurance — Life, Income & Home Protection · Fast Track Mortgages" },
      { name: "description", content: "Life insurance, income protection, critical illness, home, landlord, and business insurance. Independent quotes across 40+ insurers." },
    ],
  }),
  component: InsurancePage,
});

function InsurancePage() {
  const [assessmentStarted, setAssessmentStarted] = useState(false);

  if (!assessmentStarted) {
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
              <h3 className="font-semibold mb-6 text-center">Start Your Assessment</h3>
              <button
                onClick={() => setAssessmentStarted(true)}
                className="btn-primary w-full justify-center"
              >
                Begin Assessment <ArrowRight className="size-4" />
              </button>
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

  return <InsuranceAssessment onComplete={() => setAssessmentStarted(false)} />;
}

// Insurance Assessment Component
function InsuranceAssessment({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [dependants, setDependants] = useState(2);
  const [mortgageExposure, setMortgageExposure] = useState("£150k – £400k");
  const [employment, setEmployment] = useState("Employed");
  const [selectedProducts, setSelectedProducts] = useState<string[]>(["Life Insurance", "Income Protection"]);
  const [submitted, setSubmitted] = useState(false);
  const [leadScore, setLeadScore] = useState<ReturnType<typeof calculateLeadScore> | null>(null);

  const handleProductToggle = (product: string) => {
    setSelectedProducts(prev =>
      prev.includes(product)
        ? prev.filter(p => p !== product)
        : [...prev, product]
    );
  };

  const handleSubmit = () => {
    const leadData: LeadData = {
      employmentStatus: employment,
      dependants: dependants,
      mortgageExposure: mortgageExposure === "No" ? 0 : parseInt(mortgageExposure),
      insuranceProducts: selectedProducts,
      timeline: "Next 1-3 months",
    };

    const score = calculateLeadScore(leadData);
    setLeadScore(score);
    setSubmitted(true);
    saveLead(leadData, score);
  };

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
                  Insurance Score: {leadScore.insuranceScore}
                </div>
              </div>

              <div className="bg-secondary/60 rounded-2xl p-6">
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">Products Selected</div>
                <div className="text-3xl font-bold">{selectedProducts.length}</div>
                <div className="text-sm text-muted-foreground mt-2">
                  Coverage types recommended
                </div>
              </div>
            </div>

            <div className="mb-8 p-6 bg-brand/10 border border-brand/30 rounded-2xl">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Check className="size-5 text-brand" /> Recommended Coverage
              </h3>
              <div className="space-y-2">
                {selectedProducts.map(product => (
                  <div key={product} className="flex items-center gap-2 text-sm">
                    <Check className="size-4 text-brand" />
                    <span>{product}</span>
                  </div>
                ))}
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
              <button
                onClick={() => {
                  setStep(1);
                  setSubmitted(false);
                  setLeadScore(null);
                }}
                className="btn-secondary"
              >
                Retake Assessment
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
      <div className="container-page max-w-3xl">
        <div className="bg-card p-10 rounded-3xl ring-1 ring-border">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Insurance Needs Assessment</h2>
              <span className="text-[10px] font-mono text-muted-foreground">STEP {step} / 4</span>
            </div>
            <div className="h-1 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-brand transition-all" style={{ width: `${(step / 4) * 100}%` }} />
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-4">Who depends on your income?</label>
                <div className="grid grid-cols-2 gap-3">
                  {["Just me", "Partner", "Partner + children", "Extended family"].map((opt, i) => (
                    <button
                      key={opt}
                      onClick={() => setDependants(i)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        i === dependants
                          ? "bg-brand text-primary-foreground"
                          : "bg-secondary/60 hover:bg-secondary ring-1 ring-border"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-4">Outstanding mortgage?</label>
                <div className="grid grid-cols-2 gap-3">
                  {["No", "Under £150k", "£150k – £400k", "Over £400k"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setMortgageExposure(opt)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        opt === mortgageExposure
                          ? "bg-brand text-primary-foreground"
                          : "bg-secondary/60 hover:bg-secondary ring-1 ring-border"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-4">Employment status?</label>
                <div className="grid grid-cols-2 gap-3">
                  {["Employed", "Self-employed", "Director", "Contractor"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setEmployment(opt)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        opt === employment
                          ? "bg-brand text-primary-foreground"
                          : "bg-secondary/60 hover:bg-secondary ring-1 ring-border"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-4">Which products interest you?</label>
                <div className="grid grid-cols-1 gap-3">
                  {PRODUCTS.map((product) => (
                    <button
                      key={product.title}
                      onClick={() => handleProductToggle(product.title)}
                      className={`p-4 rounded-lg text-left transition-all border ${
                        selectedProducts.includes(product.title)
                          ? "bg-brand/10 border-brand"
                          : "bg-secondary/60 border-border hover:border-brand/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-brand">{product.icon}</div>
                          <div>
                            <div className="font-semibold text-sm">{product.title}</div>
                            <div className="text-xs text-muted-foreground">From £{product.from}/mo</div>
                          </div>
                        </div>
                        {selectedProducts.includes(product.title) && (
                          <Check className="size-5 text-brand" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-3 justify-between">
            <button
              onClick={() => step > 1 ? setStep(step - 1) : onComplete()}
              className="btn-secondary"
            >
              {step === 1 ? "Back" : "Previous"}
            </button>
            <button
              onClick={() => step < 4 ? setStep(step + 1) : handleSubmit()}
              className="btn-primary"
            >
              {step === 4 ? "Complete Assessment" : "Next"} <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
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
