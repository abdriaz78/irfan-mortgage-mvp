import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, ShieldCheck, Users, Building } from "lucide-react";
import familyLifestyle from "@/assets/family-lifestyle.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Fasttrack Mortgages Mortgage & Insurance Brokerage" },
      { name: "description", content: "Impartial, whole-of-market mortgage and protection advice. Established 2013 in Bradford. Appointed Representative of Connect IFA Ltd, authorised and regulated by the FCA. Serving clients across the UK." },
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
            Established in 2013 in Bradford, we set out to make mortgage advice transparent, personable, and
            flexible — impartial advice you need, when you need it most. We work for you, not the lender.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container-page grid lg:grid-cols-2 gap-16 items-center">
          <img src={familyLifestyle} alt="Fasttrack Mortgages clients" className="rounded-2xl w-full aspect-4/3 object-cover" width={1280} height={960} loading="lazy" />
          <div>
            <div className="eyebrow mb-4 text-brand">Our approach</div>
            <h2 className="text-4xl font-semibold text-balance mb-6">Whole-of-market. Fee-transparent. Human-led.</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We invest in comprehensive, daily-updating research technology to source competitive rates across the
              whole mortgage market — including specialist lenders unavailable directly to the public. Every fee is
              disclosed before you commit.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our three-step process is simple: we find out about your needs and circumstances, search for the
              best-fit products, then present the options in clear, easy-to-understand documents. A named adviser
              handles your case from first conversation to completion.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-secondary/40 border-y border-border">
        <div className="container-page grid md:grid-cols-4 gap-6">
          {[
            { icon: <ShieldCheck className="size-5" />, n: "FCA", l: "Regulated advice" },
            { icon: <Award className="size-5" />, n: "5.0★", l: "81 Google reviews" },
            { icon: <Users className="size-5" />, n: "2013", l: "Established" },
            { icon: <Building className="size-5" />, n: "Whole", l: "Of-market panel" },
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
        <div className="container-page grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="eyebrow mb-4 text-brand">Our team</div>
            <h2 className="text-4xl font-semibold text-balance mb-6">Qualified advisers. One standard of care.</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our advisers hold industry-recognised qualifications and are trained through our own internal academy,
              so the advice you receive is consistent, current, and genuinely in your interest.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We're known for responsiveness, supporting first-time buyers, helping clients with poor credit, and
              keeping you updated at every step. It's why our clients rate us 5.0 out of 5.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: <Award className="size-5" />, n: "5.0★", l: "Average client rating" },
              { icon: <Users className="size-5" />, n: "81", l: "Google reviews" },
              { icon: <ShieldCheck className="size-5" />, n: "CeMAP", l: "Qualified advisers" },
              { icon: <Building className="size-5" />, n: "Academy", l: "In-house training" },
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
        </div>
      </section>

      <section className="py-24 bg-ink text-primary-foreground">
        <div className="container-page max-w-3xl text-center">
          <div className="eyebrow mb-4 text-brand-accent">Compliance</div>
          <h2 className="text-4xl font-semibold text-balance mb-6">Regulated to the highest UK standard.</h2>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            Fasttrack Mortgages Ltd (Registered in England &amp; Wales No. 08525768) is an Appointed Representative of
            Connect IFA Ltd, which is authorised and regulated by the Financial Conduct Authority (FCA reference
            613394). Full disclosure documents, complaints procedure, and privacy policy available on request.
          </p>
          <Link to="/compliance" className="inline-flex items-center gap-2 bg-primary-foreground text-ink py-3 px-5 rounded-lg text-sm font-medium">
            View compliance documents
          </Link>
        </div>
      </section>
    </>
  );
}
