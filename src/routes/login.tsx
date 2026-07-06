import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Log in · Fast Track Mortgages" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data.user) {
      setSubmitting(false);
      setError(signInError?.message ?? "Unable to log in");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    setSubmitting(false);
    toast.success("Welcome back!");
    navigate({ to: profile?.role === "admin" ? "/admin" : "/portal" });
  }

  return (
    <section className="py-16">
      <div className="container-page max-w-md">
        <div className="eyebrow mb-3 text-brand">Client &amp; admin login</div>
        <h1 className="text-3xl font-semibold mb-2">Welcome back</h1>
        <p className="text-muted-foreground mb-8 text-sm">
          Log in to view your case status or manage client cases.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-card p-8 rounded-2xl ring-1 ring-border"
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full justify-center" disabled={submitting}>
            {submitting ? "Logging in…" : "Log in"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-muted-foreground text-center">
          New here?{" "}
          <Link to="/signup" className="text-brand font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}
