import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Users, Gift, HeartHandshake, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/refer")({
  head: () => ({
    meta: [
      { title: "Refer a Client · Fasttrack Mortgages" },
      {
        name: "description",
        content:
          "Know someone who needs mortgage or protection advice? Refer them to Fasttrack Mortgages and we'll take great care of them.",
      },
    ],
  }),
  component: ReferPage,
});

function ReferPage() {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [referrerName, setReferrerName] = useState("");
  const [referrerPhone, setReferrerPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("referrals").insert({
      client_name: clientName.trim(),
      client_phone: clientPhone.trim() || null,
      client_email: clientEmail.trim() || null,
      referrer_name: referrerName.trim(),
      referrer_phone: referrerPhone.trim() || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="container-page">
        <div className="grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden ring-1 ring-border shadow-xl max-w-5xl mx-auto">
          {/* Left panel — attraction */}
          <div className="relative bg-ink text-primary-foreground p-10 lg:p-12 flex flex-col justify-between overflow-hidden">
            <div
              aria-hidden
              className="absolute -top-24 -right-24 size-72 rounded-full bg-brand/30 blur-[100px]"
            />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/90 mb-8">
                <Gift className="size-3.5 text-brand-accent" /> Referrals
              </div>
              <h1 className="text-4xl lg:text-5xl font-semibold leading-[1.03] text-balance mb-5">
                Refer someone you care about.
              </h1>
              <p className="text-zinc-300 leading-relaxed max-w-[42ch] mb-10">
                Know a friend, family member, or colleague looking for a mortgage or protection?
                Introduce them to us and we'll give them the same impartial, five-star advice we're
                known for.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: <HeartHandshake className="size-5" />, t: "We look after your referral personally" },
                  { icon: <ShieldCheck className="size-5" />, t: "Impartial, whole-of-market advice" },
                  { icon: <Users className="size-5" />, t: "Rated 5.0 by our clients" },
                ].map((b) => (
                  <li key={b.t} className="flex items-center gap-3 text-sm">
                    <span className="grid size-9 place-items-center rounded-lg bg-white/10 text-brand-accent shrink-0">
                      {b.icon}
                    </span>
                    {b.t}
                  </li>
                ))}
              </ul>
            </div>
            <p className="relative text-xs text-zinc-500 mt-10">
              We'll only contact your referral to help with their enquiry — never spam.
            </p>
          </div>

          {/* Right panel — form / success */}
          <div className="bg-card p-8 lg:p-12">
            {done ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-8">
                <div className="size-16 rounded-2xl bg-emerald-100 text-emerald-700 grid place-items-center mb-6">
                  <CheckCircle2 className="size-8" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Thank you for the referral!</h2>
                <p className="text-muted-foreground mb-8 max-w-[36ch]">
                  We've received {clientName || "your referral"}'s details and one of our advisers
                  will reach out to them shortly.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => {
                      setDone(false);
                      setClientName("");
                      setClientPhone("");
                      setClientEmail("");
                      setReferrerName("");
                      setReferrerPhone("");
                    }}
                    className="btn-secondary"
                  >
                    Refer someone else
                  </button>
                  <Link to="/" className="btn-primary">
                    Back to home <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-1">Who are you referring?</h2>
                  <p className="text-sm text-muted-foreground mb-4">Their details, so we can reach out.</p>
                  <div className="space-y-4">
                    <ReferField label="Client's name" value={clientName} onChange={setClientName} required />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <ReferField
                        label="Client's contact number"
                        value={clientPhone}
                        onChange={setClientPhone}
                        type="tel"
                        required
                      />
                      <ReferField
                        label="Client's email"
                        value={clientEmail}
                        onChange={setClientEmail}
                        type="email"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <h2 className="text-lg font-semibold mb-1 mt-4">Your details</h2>
                  <p className="text-sm text-muted-foreground mb-4">So we can thank you and keep you posted.</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <ReferField label="Your name" value={referrerName} onChange={setReferrerName} required />
                    <ReferField
                      label="Your contact number"
                      value={referrerPhone}
                      onChange={setReferrerPhone}
                      type="tel"
                      required
                    />
                  </div>
                </div>

                <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
                  {submitting ? "Sending…" : "Submit referral"} <ArrowRight className="size-4" />
                </button>
                <p className="text-[11px] text-muted-foreground text-center">
                  By submitting, you confirm the person is happy to be contacted about their enquiry.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReferField({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-secondary/60 border border-border rounded-lg text-sm focus:border-brand focus:outline-none transition-colors"
      />
    </div>
  );
}
