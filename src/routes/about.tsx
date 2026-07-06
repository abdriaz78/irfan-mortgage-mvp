import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, ShieldCheck, Users, Building } from "lucide-react";
import familyLifestyle from "@/assets/family-lifestyle.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Fast Track Mortgages Mortgage & Insurance Brokerage" },
      { name: "description", content: "Independent, whole-of-market mortgage and protection advice. FCA-regulated. Based in London. Serving clients across the UK." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="py-24 border-b border-border">
        <div className="container-page max-w-4xl">
          <div className="eyebrow mb-4 text-brand">About</div>
          <h1 className="text-5xl md:text-7xl font-semibold text-balance mb-8 leading-[1.02]">
            Independent advice for the biggest decisions.
          </h1>
          <p className="text-xl text-muted-foreground max-w-[60ch] leading-relaxed">
            Founded in 2012 by three ex-Big Four advisers who wanted to build a brokerage without the conflicts of
            interest. We work for you — not the lender.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container-page grid lg:grid-cols-2 gap-16 items-center">
          <img src={familyLifestyle} alt="Vantage clients" className="rounded-2xl w-full aspect-4/3 object-cover" width={1280} height={960} loading="lazy" />
          <div>
            <div className="eyebrow mb-4 text-brand">Our approach</div>
            <h2 className="text-4xl font-semibold text-balance mb-6">Whole-of-market. Fee-transparent. Human-led.</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We access 90+ mortgage lenders and 40+ insurers — including specialist providers unavailable
              directly to the public. We disclose every fee before you commit.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Automation handles the paperwork. A named advisor handles the strategy. Your file is never passed
              from person to person.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-secondary/40 border-y border-border">
        <div className="container-page grid md:grid-cols-4 gap-6">
          {[
            { icon: <ShieldCheck className="size-5" />, n: "FCA", l: "Authorised & regulated" },
            { icon: <Users className="size-5" />, n: "15,000+", l: "Clients advised" },
            { icon: <Award className="size-5" />, n: "£2.4B", l: "Lending facilitated" },
            { icon: <Building className="size-5" />, n: "130+", l: "Provider partnerships" },
          ].map((s) => (
            <div key={s.l} className="p-8 bg-card rounded-2xl ring-1 ring-border">
              <div className="size-10 rounded-lg bg-brand-soft text-brand grid place-items-center mb-5">
                {s.icon}
              </div>
              <div className="text-3xl font-semibold font-display mb-1">{s.n}</div>
              <div className="text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24">
        <div className="container-page">
          <div className="max-w-2xl mb-12">
            <div className="eyebrow mb-4 text-brand">Team</div>
            <h2 className="text-4xl font-semibold text-balance">Twenty-three advisors. One standard.</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {["Marcus Kensington", "Priya Shah", "Elena Voss", "David Okonkwo"].map((n) => (
              <div key={n}>
                <div className="aspect-4/5 bg-secondary rounded-2xl mb-4 relative overflow-hidden">
                  <div className="absolute bottom-4 left-4 size-16 rounded-full bg-brand grid place-items-center text-primary-foreground font-semibold font-display">
                    {n.split(" ").map((x) => x[0]).join("")}
                  </div>
                </div>
                <div className="text-sm font-semibold">{n}</div>
                <div className="text-xs text-muted-foreground">Senior Adviser · CeMAP</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-ink text-primary-foreground">
        <div className="container-page max-w-3xl text-center">
          <div className="eyebrow mb-4 text-brand-accent">Compliance</div>
          <h2 className="text-4xl font-semibold text-balance mb-6">Regulated to the highest UK standard.</h2>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            Vantage &amp; Co. Financial Services Ltd is authorised and regulated by the Financial Conduct Authority
            (FCA No. 000000). Full disclosure documents, complaints procedure, and privacy policy available on request.
          </p>
          <Link to="/compliance" className="inline-flex items-center gap-2 bg-primary-foreground text-ink py-3 px-5 rounded-lg text-sm font-medium">
            View compliance documents
          </Link>
        </div>
      </section>
    </>
  );
}
