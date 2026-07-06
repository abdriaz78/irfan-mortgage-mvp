import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Lock, FileCheck2, Scale } from "lucide-react";

export const Route = createFileRoute("/compliance")({
  head: () => ({
    meta: [
      { title: "Compliance, Privacy & Legal · Fast Track Mortgages" },
      { name: "description", content: "FCA disclosure, privacy policy, cookie policy, GDPR compliance, and secure document handling for Fast Track Mortgages." },
    ],
  }),
  component: CompliancePage,
});

function CompliancePage() {
  return (
    <>
      <section className="py-16 border-b border-border">
        <div className="container-page max-w-4xl">
          <div className="eyebrow mb-4 text-brand">Compliance &amp; legal</div>
          <h1 className="text-5xl md:text-6xl font-semibold text-balance mb-6 leading-[1.02]">
            Regulation, transparency, and your rights.
          </h1>
          <p className="text-lg text-muted-foreground max-w-[60ch]">
            Everything we're required to disclose — and things we think you should know.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[
            { icon: <ShieldCheck className="size-5" />, title: "FCA Authorised", meta: "Reference No. 000000" },
            { icon: <Lock className="size-5" />, title: "ISO 27001", meta: "Data security certified" },
            { icon: <FileCheck2 className="size-5" />, title: "GDPR Compliant", meta: "Full data rights" },
            { icon: <Scale className="size-5" />, title: "FOS Registered", meta: "Independent redress" },
          ].map((b) => (
            <div key={b.title} className="p-6 bg-card rounded-2xl ring-1 ring-border">
              <div className="size-10 rounded-lg bg-brand-soft text-brand grid place-items-center mb-4">{b.icon}</div>
              <div className="text-sm font-semibold mb-1">{b.title}</div>
              <div className="text-xs text-muted-foreground">{b.meta}</div>
            </div>
          ))}
        </div>

        <div className="container-page grid lg:grid-cols-4 gap-12 max-w-6xl">
          <aside className="lg:col-span-1">
            <nav className="sticky top-24 space-y-2 text-sm">
              {SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="block py-2 text-muted-foreground hover:text-foreground">
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>
          <div className="lg:col-span-3 prose prose-neutral max-w-none space-y-16">
            {SECTIONS.map((s) => (
              <article key={s.id} id={s.id}>
                <div className="eyebrow mb-3 text-brand">{s.eyebrow}</div>
                <h2 className="text-3xl font-semibold mb-4">{s.title}</h2>
                {s.body.map((p, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed mb-4">{p}</p>
                ))}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const SECTIONS = [
  {
    id: "fca", eyebrow: "Regulation", title: "FCA Disclosure",
    body: [
      "Fast Track Mortgages Financial Services Ltd is authorised and regulated by the Financial Conduct Authority (FCA) under reference number 000000. You can verify our status on the FCA register at register.fca.org.uk.",
      "We are a whole-of-market mortgage and protection broker. We do not charge you a broker fee for standard residential mortgages or protection products; we are remunerated by commission from lenders and insurers, which we disclose in full before you commit.",
    ],
  },
  {
    id: "privacy", eyebrow: "Data", title: "Privacy Policy",
    body: [
      "We collect only the personal data required to provide regulated advice and administer your application. This includes identity, financial, employment, and property information. We share data only with providers you have consented to be introduced to, credit reference agencies where required, and regulators upon lawful request.",
      "You have the right to access, rectify, or erase your personal data at any time. Contact our Data Protection Officer at dpo@vantageandco.example.",
    ],
  },
  {
    id: "cookies", eyebrow: "Website", title: "Cookie Policy",
    body: [
      "We use strictly necessary cookies to operate the client dashboard and secure document portal. Analytics cookies are only enabled with your explicit consent via the cookie banner and can be revoked at any time.",
    ],
  },
  {
    id: "terms", eyebrow: "Legal", title: "Terms & Conditions",
    body: [
      "Nothing on this website constitutes regulated financial advice. All calculators, comparisons, and eligibility indications are for illustration only. Regulated advice is provided in writing after a full fact-find and Suitability Report from a named adviser.",
      "Your home may be repossessed if you do not keep up repayments on your mortgage.",
    ],
  },
  {
    id: "security", eyebrow: "Trust", title: "Security & Storage",
    body: [
      "Uploaded documents are encrypted at rest using AES-256 and in transit via TLS 1.3. Files are stored in UK-based ISO 27001 certified data centres. Access is audit-logged and restricted to your named adviser.",
    ],
  },
];
