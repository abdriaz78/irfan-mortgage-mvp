import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GetStartedStepper } from "./get-started-stepper";

// Mortgage products — each opens the Mortgage Finder pre-set to that type.
export const MORTGAGE_ITEMS = [
  "First Time Buyer",
  "Remortgage",
  "Buy to Let",
  "Home Mover",
  "Right to Buy",
  "Help to Buy",
] as const;

// Protection products — each opens the protection enquiry pre-set to that cover.
export const INSURANCE_ITEMS = [
  "Life Insurance",
  "Income Protection",
  "Critical Illness",
  "Home Insurance",
  "Landlord Insurance",
  "Business Insurance",
] as const;

const flatLinks = [
  { to: "/", hash: "services", label: "Services" },
  { to: "/compare", label: "Compare" },
  { to: "/refer", label: "Refer a Client" },
  { to: "/resources", label: "Resources" },
  { to: "/about", label: "About" },
] as const;

export function SiteNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [stepperOpen, setStepperOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<null | "mortgages" | "insurance">(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const openStepper = () => {
    setStepperOpen(true);
    setOpen(false);
    setOpenMenu(null);
  };

  useEffect(() => {
    if (!openMenu) return;
    function onDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenu(null);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [openMenu]);

  const linkCls = (active: boolean) =>
    `whitespace-nowrap text-sm font-medium transition-colors ${
      active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container-page h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center shrink-0">
            <img
              src="/images/logo.png"
              alt="Fasttrack Mortgages"
              className="h-11 w-auto"
              width={120}
              height={110}
            />
          </Link>
          <div ref={menuRef} className="hidden md:flex items-center gap-5">
            {/* Mortgages dropdown */}
            <div className="relative py-2">
              <button
                type="button"
                onClick={() => setOpenMenu((m) => (m === "mortgages" ? null : "mortgages"))}
                aria-expanded={openMenu === "mortgages"}
                className={`inline-flex items-center gap-1 ${linkCls(pathname === "/mortgages")}`}
              >
                Mortgages
                <ChevronDown
                  className={`size-3.5 transition-transform ${openMenu === "mortgages" ? "rotate-180" : ""}`}
                />
              </button>
              {openMenu === "mortgages" && (
                <div className="absolute left-0 top-full pt-3 z-50">
                  <div className="min-w-60 rounded-xl bg-card p-1.5 ring-1 ring-border shadow-lg">
                    {MORTGAGE_ITEMS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={openStepper}
                        className="block w-full text-left rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                      >
                        {item}
                      </button>
                    ))}
                    <div className="my-1 h-px bg-border" />
                    <Link
                      to="/mortgages"
                      onClick={() => setOpenMenu(null)}
                      className="block rounded-lg px-3 py-2 text-xs font-medium text-brand hover:bg-secondary"
                    >
                      Browse all mortgages →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Insurance dropdown */}
            <div className="relative py-2">
              <button
                type="button"
                onClick={() => setOpenMenu((m) => (m === "insurance" ? null : "insurance"))}
                aria-expanded={openMenu === "insurance"}
                className={`inline-flex items-center gap-1 ${linkCls(pathname === "/insurance")}`}
              >
                Insurance
                <ChevronDown
                  className={`size-3.5 transition-transform ${openMenu === "insurance" ? "rotate-180" : ""}`}
                />
              </button>
              {openMenu === "insurance" && (
                <div className="absolute left-0 top-full pt-3 z-50">
                  <div className="min-w-60 rounded-xl bg-card p-1.5 ring-1 ring-border shadow-lg">
                    {INSURANCE_ITEMS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={openStepper}
                        className="block w-full text-left rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                      >
                        {item}
                      </button>
                    ))}
                    <div className="my-1 h-px bg-border" />
                    <Link
                      to="/insurance"
                      onClick={() => setOpenMenu(null)}
                      className="block rounded-lg px-3 py-2 text-xs font-medium text-brand hover:bg-secondary"
                    >
                      Browse all protection →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {flatLinks.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                hash={"hash" in l ? l.hash : undefined}
                className={linkCls(pathname === l.to)}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <AccountMenu />
          <Link to="/book" className="btn-primary">
            Book Consultation
          </Link>
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
          <div className="container-page py-4 flex flex-col gap-1">
            <button
              type="button"
              onClick={openStepper}
              className="text-sm font-semibold py-2 text-left"
            >
              Mortgages
            </button>
            {MORTGAGE_ITEMS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={openStepper}
                className="text-sm text-muted-foreground py-1.5 pl-4 text-left"
              >
                {item}
              </button>
            ))}
            <Link
              to="/mortgages"
              onClick={() => setOpen(false)}
              className="text-xs font-medium text-brand py-1 pl-4"
            >
              Browse all mortgages →
            </Link>

            <button
              type="button"
              onClick={openStepper}
              className="text-sm font-semibold py-2 mt-2 text-left"
            >
              Insurance
            </button>
            {INSURANCE_ITEMS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={openStepper}
                className="text-sm text-muted-foreground py-1.5 pl-4 text-left"
              >
                {item}
              </button>
            ))}
            <Link
              to="/insurance"
              onClick={() => setOpen(false)}
              className="text-xs font-medium text-brand py-1 pl-4"
            >
              Browse all protection →
            </Link>

            <div className="my-2 h-px bg-border" />
            {flatLinks.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                hash={"hash" in l ? l.hash : undefined}
                onClick={() => setOpen(false)}
                className="text-sm font-medium py-2"
              >
                {l.label}
              </Link>
            ))}
            <Link to="/book" onClick={() => setOpen(false)} className="btn-primary w-fit mt-2">
              Book Consultation
            </Link>
            <AccountMenu onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      {stepperOpen && <GetStartedStepper onClose={() => setStepperOpen(false)} />}
    </nav>
  );
}

function AccountMenu({ onNavigate }: { onNavigate?: () => void }) {
  const { session, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;

  if (!session || !profile) {
    return (
      <Link
        to="/login"
        onClick={onNavigate}
        className="text-sm font-medium py-2 px-3 rounded-lg hover:bg-secondary transition-colors"
      >
        Client Login
      </Link>
    );
  }

  const homePath = profile.role === "admin" ? "/admin" : "/portal";

  async function handleLogout() {
    await signOut();
    onNavigate?.();
    navigate({ to: "/login" });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-lg hover:bg-secondary transition-colors">
        <span className="size-6 rounded-full bg-brand text-primary-foreground text-[11px] font-semibold grid place-items-center">
          {(profile.full_name || profile.email).slice(0, 1).toUpperCase()}
        </span>
        <span className="max-w-[140px] truncate">{profile.full_name || profile.email}</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {profile.role}
        </span>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Signed in as {profile.role}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={homePath} onClick={onNavigate}>
            <LayoutDashboard className="size-4" />
            {profile.role === "admin" ? "Admin dashboard" : "My portal"}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
