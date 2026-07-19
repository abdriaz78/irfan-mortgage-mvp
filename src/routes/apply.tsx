import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { emptyDetails, type InformationFormDetails } from "@/lib/information-form";
import { InformationFormShell } from "./portal.information-form";

type ApplySearch = {
  purchaseOrRemortgage?: string;
  residentialOrBtl?: string;
  firstTimeBuyer?: string;
};

export const Route = createFileRoute("/apply")({
  validateSearch: (search: Record<string, unknown>): ApplySearch => ({
    purchaseOrRemortgage:
      typeof search.purchaseOrRemortgage === "string" ? search.purchaseOrRemortgage : undefined,
    residentialOrBtl:
      typeof search.residentialOrBtl === "string" ? search.residentialOrBtl : undefined,
    firstTimeBuyer:
      typeof search.firstTimeBuyer === "string" ? search.firstTimeBuyer : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Start your mortgage application · Fasttrack Mortgages" },
      {
        name: "description",
        content:
          "Start your mortgage application online — no account needed. Tell us about you and one of our advisers will be in touch.",
      },
    ],
  }),
  component: ApplyPage,
});

function prefill(search: ApplySearch): InformationFormDetails {
  const base = emptyDetails();
  if (search.purchaseOrRemortgage === "Purchase" || search.purchaseOrRemortgage === "Remortgage") {
    base.purchase_or_remortgage = search.purchaseOrRemortgage;
  }
  if (search.residentialOrBtl === "Residential" || search.residentialOrBtl === "Buy to Let") {
    base.residential_or_btl = search.residentialOrBtl;
  }
  if (search.firstTimeBuyer === "Yes" || search.firstTimeBuyer === "No") {
    base.first_time_buyer = search.firstTimeBuyer;
  }
  return base;
}

function ApplyPage() {
  const search = Route.useSearch();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const methods = useForm<InformationFormDetails>({
    defaultValues: prefill(search),
    mode: "onBlur",
  });

  async function onSubmit(values: InformationFormDetails) {
    setSubmitting(true);
    const a1 = values.applicant1;
    const fullName = [a1.first_name, a1.middle_name, a1.last_name].filter(Boolean).join(" ").trim();
    const { error } = await supabase.from("public_applications").insert({
      full_name: fullName || null,
      email: a1.email || null,
      phone: a1.mobile || null,
      mortgage_type:
        [values.residential_or_btl, values.purchase_or_remortgage].filter(Boolean).join(" ") || null,
      details: values,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (done) {
    return (
      <section className="py-24">
        <div className="container-page max-w-xl text-center">
          <div className="size-16 rounded-2xl bg-emerald-100 text-emerald-700 grid place-items-center mx-auto mb-6">
            <CheckCircle2 className="size-8" />
          </div>
          <h1 className="text-3xl font-semibold mb-3">Thank you — we've got your details</h1>
          <p className="text-muted-foreground mb-8">
            One of our advisers will review your application and get in touch shortly. If it's urgent,
            you can also book a consultation or message us on WhatsApp.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/book" className="btn-primary">
              Book a consultation <ArrowRight className="size-4" />
            </Link>
            <Link to="/" className="btn-secondary">
              Back to home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container-page max-w-3xl">
        <div className="eyebrow mb-3 text-brand">Mortgage application</div>
        <h1 className="text-3xl font-semibold mb-3">Start your mortgage application</h1>
        <p className="text-muted-foreground mb-8 text-sm">
          No account needed — just tell us about you and your plans, and one of our advisers will pick
          it up. The more you can share, the more accurate our advice will be.
        </p>

        <div className="mb-8 p-5 rounded-2xl bg-brand-soft/60 ring-1 ring-brand/20 flex gap-3">
          <ShieldCheck className="size-5 text-brand shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Your data:</span> everything here is used
            only to assess your mortgage enquiry. We'll never share it without your permission.
          </div>
        </div>

        <InformationFormShell
          methods={methods}
          submitting={submitting}
          submitLabel="Submit my application"
          onSubmit={onSubmit}
        />

        <p className="mt-6 text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-brand font-medium">
            Log in
          </Link>{" "}
          to use your secure portal instead.
        </p>
      </div>
    </section>
  );
}
