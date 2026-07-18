import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
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

const links = [
  { to: "/mortgages", label: "Mortgages" },
  { to: "/insurance", label: "Insurance" },
  { to: "/", hash: "services", label: "Services" },
  { to: "/compare", label: "Compare" },
  { to: "/portal", label: "Portal" },
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
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight text-brand font-display"
          >
            <span className="inline-block size-2.5 rounded-full bg-brand" />
            Fasttrack Mortgages
          </Link>
          <div className="hidden md:flex gap-6">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                hash={"hash" in l ? l.hash : undefined}
                className={`text-sm font-medium transition-colors ${
                  pathname === l.to
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
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
          <div className="container-page py-4 flex flex-col gap-3">
            {links.map((l) => (
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
            <Link to="/book" onClick={() => setOpen(false)} className="btn-primary w-fit">
              Book Consultation
            </Link>
            <AccountMenu onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
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
