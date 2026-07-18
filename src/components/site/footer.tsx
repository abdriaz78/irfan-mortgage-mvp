import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="py-16 bg-ink text-zinc-400 mt-24">
      <div className="container-page">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          <div className="max-w-[44ch]">
            <span className="text-lg font-semibold tracking-tight text-zinc-50 block mb-4 font-display">
              Fasttrack Mortgages
            </span>
            <p className="text-sm leading-relaxed mb-4">
              Impartial, whole-of-market mortgage and protection advice — established 2013.
              An Appointed Representative of Connect IFA Ltd, which is authorised and regulated by the
              Financial Conduct Authority (FCA reference 613394).
            </p>
            <address className="not-italic text-sm space-y-1 text-zinc-500">
              <div>89–93 Manningham Lane, Bradford, BD1 3BN</div>
              <div>
                <a href="tel:+441274962606" className="hover:text-zinc-50">01274 962606</a>
                {" · "}
                <a href="mailto:info@fasttrackmortgages.co.uk" className="hover:text-zinc-50">
                  info@fasttrackmortgages.co.uk
                </a>
              </div>
            </address>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div className="space-y-3">
              <span className="eyebrow text-zinc-500">Mortgages</span>
              <ul className="space-y-2 text-sm">
                <li><Link to="/mortgages" className="hover:text-zinc-50">Eligibility Checker</Link></li>
                <li><Link to="/mortgages" className="hover:text-zinc-50">Calculators</Link></li>
                <li><Link to="/compare" className="hover:text-zinc-50">Compare Rates</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <span className="eyebrow text-zinc-500">Insurance</span>
              <ul className="space-y-2 text-sm">
                <li><Link to="/insurance" className="hover:text-zinc-50">Life Cover</Link></li>
                <li><Link to="/insurance" className="hover:text-zinc-50">Income Protection</Link></li>
                <li><Link to="/insurance" className="hover:text-zinc-50">Home Insurance</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <span className="eyebrow text-zinc-500">Company</span>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-zinc-50">About</Link></li>
                <li><Link to="/resources" className="hover:text-zinc-50">Resources</Link></li>
                <li><Link to="/compliance" className="hover:text-zinc-50">Compliance</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-zinc-800 text-[10px] flex flex-col md:flex-row justify-between gap-3 uppercase tracking-widest">
          <span>© 2026 Fasttrack Mortgages Ltd · Registered in England &amp; Wales No. 08525768</span>
          <span>Your home may be repossessed if you do not keep up repayments.</span>
        </div>
      </div>
    </footer>
  );
}
