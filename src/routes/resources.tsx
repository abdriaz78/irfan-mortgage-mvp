import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — Mortgage & Insurance Guides · Vantage & Co." },
      { name: "description", content: "In-depth guides on first-time buying, buy-to-let, remortgaging, self-employed mortgages, life insurance, and income protection." },
    ],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
  return (
    <>
      <section className="py-16 border-b border-border">
        <div className="container-page max-w-4xl">
          <div className="eyebrow mb-4 text-brand">Resources</div>
          <h1 className="text-5xl md:text-6xl font-semibold text-balance mb-6 leading-[1.02]">
            Guides for the moments that matter most.
          </h1>
          <p className="text-lg text-muted-foreground max-w-[60ch]">
            Long-form guides, calculators, and case studies — written by our advisors, not marketers.
          </p>
        </div>
      </section>

      {/* Featured */}
      <section className="py-16">
        <div className="container-page">
          <article className="grid lg:grid-cols-2 gap-10 items-center bg-ink text-primary-foreground p-10 rounded-3xl">
            <div>
              <div className="eyebrow mb-4 text-brand-accent">Featured guide · 12 min read</div>
              <h2 className="text-4xl md:text-5xl font-semibold text-balance mb-4 leading-tight">
                The complete first-time buyer playbook.
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-6">
                From deposit strategy to completion day — 42 pages of everything we wish clients knew before their first purchase.
              </p>
              <button className="inline-flex items-center gap-2 bg-primary-foreground text-ink py-3 px-5 rounded-lg text-sm font-medium">
                Read the guide <ArrowRight className="size-4" />
              </button>
            </div>
            <div className="aspect-4/3 bg-brand-accent/20 rounded-2xl grid place-items-center">
              <span className="text-brand-accent text-8xl font-display italic">01</span>
            </div>
          </article>
        </div>
      </section>

      {/* Article grid */}
      <section className="py-16">
        <div className="container-page">
          <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-2xl font-semibold">Latest articles</h2>
            <div className="flex gap-2">
              {["All", "Mortgages", "Insurance", "Property", "Regulation"].map((c, i) => (
                <button key={c} className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                  i === 0 ? "bg-brand text-primary-foreground" : "bg-secondary/60 hover:bg-secondary"
                }`}>{c}</button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ARTICLES.map((a) => (
              <article key={a.title} className="group bg-card ring-1 ring-border rounded-2xl overflow-hidden hover:ring-brand/30 transition-all">
                <div className={`aspect-16/10 ${a.color}`} />
                <div className="p-6">
                  <div className="eyebrow mb-3">{a.category} · {a.mins} min read</div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-brand transition-colors">{a.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{a.excerpt}</p>
                  <Link to="/resources" className="text-xs font-semibold text-brand inline-flex items-center gap-1">
                    Read <ArrowRight className="size-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const ARTICLES = [
  { title: "How much deposit do you really need in 2026?", excerpt: "Beyond the 5%/10%/15% headlines — the true cost of a low deposit across a 25-year term.", category: "Mortgages", mins: 8, color: "bg-linear-to-br from-brand to-brand/60" },
  { title: "Self-employed mortgages: the retained profits route.", excerpt: "How limited company directors can unlock significantly higher borrowing.", category: "Mortgages", mins: 11, color: "bg-linear-to-br from-brand-accent to-brand-accent/60" },
  { title: "Life insurance vs mortgage protection — which comes first?", excerpt: "Two products, two purposes. What every homeowner should carry.", category: "Insurance", mins: 6, color: "bg-linear-to-br from-emerald-700 to-emerald-500" },
  { title: "Buy-to-let stress tests explained.", excerpt: "How lenders model rental coverage — and where portfolio landlords slip up.", category: "Property", mins: 9, color: "bg-linear-to-br from-stone-700 to-stone-500" },
  { title: "Critical illness cover: what's actually covered?", excerpt: "The 40+ conditions to check before you sign — and why definitions matter.", category: "Insurance", mins: 10, color: "bg-linear-to-br from-amber-700 to-amber-500" },
  { title: "Remortgaging: when to switch, when to stay.", excerpt: "ERC math, product transfers, and the six-month window most people miss.", category: "Mortgages", mins: 7, color: "bg-linear-to-br from-emerald-800 to-emerald-600" },
];
