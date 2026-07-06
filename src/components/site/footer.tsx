import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="py-16 bg-ink text-zinc-400 mt-24">
      <div className="container-page">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          <div className="max-w-[40ch]">
            <span className="text-lg font-semibold tracking-tight text-zinc-50 block mb-4 font-display">
              Fast Track Mortgages
            </span>
            <p className="text-sm leading-relaxed">
              Specialist mortgage and protection advice tailored to professional requirements.
              Authorised and regulated by the Financial Conduct Authority (FCA No. 000000).
            </p>
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
          <span>© 2026 Fast Track Mortgages. All rights reserved.</span>
          <span>Your home may be repossessed if you do not keep up repayments.</span>
        </div>
      </div>
    </footer>
  );
}
