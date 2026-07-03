import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/mortgages", label: "Mortgages" },
  { to: "/insurance", label: "Insurance" },
  { to: "/compare", label: "Compare" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/resources", label: "Resources" },
  { to: "/about", label: "About" },
] as const;

export function SiteNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container-page h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-brand font-display">
            <span className="inline-block size-2.5 rounded-full bg-brand" />
            Vantage &amp; Co.
          </Link>
          <div className="hidden md:flex gap-6">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm font-medium transition-colors ${
                  pathname === l.to ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Link to="/dashboard" className="text-sm font-medium py-2 px-3 rounded-lg hover:bg-secondary transition-colors">
            Client Login
          </Link>
          <Link to="/book" className="btn-primary">Book Consultation</Link>
        </div>
        <button
          type="button"
          className="md:hidden p-2 rounded-lg hover:bg-secondary"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container-page py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-sm font-medium py-2">
                {l.label}
              </Link>
            ))}
            <Link to="/book" onClick={() => setOpen(false)} className="btn-primary w-fit">
              Book Consultation
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
