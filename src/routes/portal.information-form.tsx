import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm, Controller, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ShieldCheck, ChevronRight, ChevronLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { useMyCase } from "@/hooks/use-my-case";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/portal/information-form")({
  head: () => ({ meta: [{ title: "Information Form · Fast Track Mortgages" }] }),
  component: InformationFormPage,
});

const yesNo = z.enum(["yes", "no"], { message: "Please select an option" });

function isAtLeast18(dob: string) {
  if (!dob) return false;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return false;
  const eighteenthBirthday = new Date(birth.getFullYear() + 18, birth.getMonth(), birth.getDate());
  return eighteenthBirthday.getTime() <= Date.now();
}

const schema = z.object({
  full_name: z.string().min(2, "Enter your full name"),
  date_of_birth: z.string().refine(isAtLeast18, "You must be at least 18 years old to apply"),
  phone: z.string().min(7, "Enter a valid phone number"),
  address: z.string().min(5, "Enter your current address"),
  employment_status: z.enum(["employed", "self_employed", "contractor", "retired", "unemployed"], {
    message: "Select your employment status",
  }),
  employer_name: z.string().optional(),
  annual_income: z.coerce.number().min(1, "Enter your gross annual income"),
  has_ccjs: yesNo,
  has_defaults: yesNo,
  has_bankruptcy_or_iva: yesNo,
  credit_notes: z.string().optional(),
  property_value: z.coerce.number().min(1, "Enter the property value"),
  deposit_amount: z.coerce.number().min(1, "Enter your deposit amount"),
  mortgage_type: z.enum(["first_time_buyer", "remortgage", "buy_to_let", "home_mover"], {
    message: "Select a mortgage type",
  }),
  purchase_timeline: z.enum(["0_3_months", "3_6_months", "6_12_months", "just_researching"], {
    message: "Select your timeline",
  }),
});

type FormValues = z.infer<typeof schema>;

const STEPS: { title: string; fields: (keyof FormValues)[] }[] = [
  { title: "Personal details", fields: ["full_name", "date_of_birth", "phone", "address"] },
  { title: "Employment & income", fields: ["employment_status", "employer_name", "annual_income"] },
  {
    title: "Credit history disclosure",
    fields: ["has_ccjs", "has_defaults", "has_bankruptcy_or_iva", "credit_notes"],
  },
  {
    title: "Property & mortgage details",
    fields: ["property_value", "deposit_amount", "mortgage_type", "purchase_timeline"],
  },
  { title: "Review & submit", fields: [] },
];

function InformationFormPage() {
  const { session } = useAuth();
  const { case: myCase, loading: caseLoading } = useMyCase();
  const [step, setStep] = useState(0);
  const [loadingForm, setLoadingForm] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      has_ccjs: "no",
      has_defaults: "no",
      has_bankruptcy_or_iva: "no",
    },
  });

  const readOnly = useMemo(() => (myCase ? myCase.current_stage > 2 : false), [myCase]);

  useEffect(() => {
    if (caseLoading) return;
    if (!myCase) {
      setLoadingForm(false);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("information_form_responses")
        .select("*")
        .eq("case_id", myCase.id)
        .maybeSingle();

      if (data) {
        reset({
          full_name: data.full_name ?? "",
          date_of_birth: data.date_of_birth ?? "",
          phone: data.phone ?? "",
          address: data.address ?? "",
          employment_status:
            (data.employment_status as FormValues["employment_status"]) ?? undefined,
          employer_name: data.employer_name ?? "",
          annual_income: data.annual_income ?? undefined,
          has_ccjs: data.has_ccjs ? "yes" : "no",
          has_defaults: data.has_defaults ? "yes" : "no",
          has_bankruptcy_or_iva: data.has_bankruptcy_or_iva ? "yes" : "no",
          credit_notes: data.credit_notes ?? "",
          property_value: data.property_value ?? undefined,
          deposit_amount: data.deposit_amount ?? undefined,
          mortgage_type: (data.mortgage_type as FormValues["mortgage_type"]) ?? undefined,
          purchase_timeline:
            (data.purchase_timeline as FormValues["purchase_timeline"]) ?? undefined,
        });
        setAlreadySubmitted(data.submitted_at);
      }
      setLoadingForm(false);
    })();
  }, [caseLoading, myCase, reset]);

  async function goNext() {
    const valid = await trigger(STEPS[step].fields);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(values: FormValues) {
    if (!myCase || !session?.user) return;
    setSubmitting(true);

    const { error } = await supabase.from("information_form_responses").upsert({
      case_id: myCase.id,
      full_name: values.full_name,
      date_of_birth: values.date_of_birth,
      phone: values.phone,
      address: values.address,
      employment_status: values.employment_status,
      employer_name: values.employer_name ?? null,
      annual_income: values.annual_income,
      has_ccjs: values.has_ccjs === "yes",
      has_defaults: values.has_defaults === "yes",
      has_bankruptcy_or_iva: values.has_bankruptcy_or_iva === "yes",
      credit_notes: values.credit_notes ?? null,
      property_value: values.property_value,
      deposit_amount: values.deposit_amount,
      mortgage_type: values.mortgage_type,
      purchase_timeline: values.purchase_timeline,
      submitted_at: new Date().toISOString(),
    });

    setSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Information form submitted. Your advisor will review it shortly.");
  }

  if (caseLoading || loadingForm) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!myCase) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground text-center px-4">
        We couldn't find a case for your account yet. If you just signed up, please refresh in a
        moment — otherwise contact your advisor.
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="container-page max-w-2xl">
        <div className="eyebrow mb-3 text-brand">Case {myCase?.case_number}</div>
        <h1 className="text-3xl font-semibold mb-3">Information Form</h1>
        <p className="text-muted-foreground mb-8 text-sm">
          This helps us assess your eligibility accurately the first time. Nothing here is a final
          decision — a full review always follows.
        </p>

        <div className="mb-8 p-5 rounded-2xl bg-brand-soft/60 ring-1 ring-brand/20 flex gap-3">
          <ShieldCheck className="size-5 text-brand shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground leading-relaxed space-y-1.5">
            <p>
              <span className="font-semibold text-foreground">Age:</span> you must be at least 18 to
              enter a mortgage contract in the UK. Many lenders set a higher minimum (often 21+) and
              cap the age at the end of the mortgage term.
            </p>
            <p>
              <span className="font-semibold text-foreground">Income:</span> there's no statutory
              minimum, but lenders must assess real affordability — we'll ask for verifiable income
              (payslips or SA302 if self-employed) rather than a self-certified figure.
            </p>
            <p>
              <span className="font-semibold text-foreground">Credit history:</span> under FCA
              responsible-lending rules, lenders check for CCJs, defaults, and bankruptcy/IVA.
              Disclosing these upfront lets us assess your case accurately rather than it surfacing
              later.
            </p>
          </div>
        </div>

        {readOnly && (
          <div className="mb-6 p-4 rounded-xl bg-secondary/60 text-sm text-muted-foreground">
            Your case has progressed past the Information Form stage, so this is now read-only. Need
            to change something? Contact your advisor.
          </div>
        )}

        {!readOnly && alreadySubmitted && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 text-emerald-700 text-sm">
            Submitted on {new Date(alreadySubmitted).toLocaleDateString()}. You can still update it
            below.
          </div>
        )}

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className={`flex-1 h-1.5 rounded-full ${i <= step ? "bg-brand" : "bg-secondary"}`}
            />
          ))}
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-card p-8 rounded-2xl ring-1 ring-border space-y-5"
        >
          <h2 className="text-lg font-semibold mb-2">{STEPS[step].title}</h2>

          <fieldset disabled={readOnly} className="space-y-5">
            {step === 0 && (
              <>
                <Field label="Full name" error={errors.full_name?.message}>
                  <Input {...register("full_name")} />
                </Field>
                <Field label="Date of birth" error={errors.date_of_birth?.message}>
                  <Input type="date" {...register("date_of_birth")} />
                </Field>
                <Field label="Phone number" error={errors.phone?.message}>
                  <Input type="tel" {...register("phone")} />
                </Field>
                <Field label="Current address" error={errors.address?.message}>
                  <Textarea rows={3} {...register("address")} />
                </Field>
              </>
            )}

            {step === 1 && (
              <>
                <Field label="Employment status" error={errors.employment_status?.message}>
                  <SelectField name="employment_status" control={control} disabled={readOnly}>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="self_employed">Self-employed</SelectItem>
                    <SelectItem value="contractor">Contractor</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                  </SelectField>
                </Field>
                <Field label="Employer name (if applicable)" error={errors.employer_name?.message}>
                  <Input {...register("employer_name")} />
                </Field>
                <Field label="Gross annual income (£)" error={errors.annual_income?.message}>
                  <Input type="number" min={0} step="1000" {...register("annual_income")} />
                </Field>
              </>
            )}

            {step === 2 && (
              <>
                <YesNoField
                  label="Have you had any County Court Judgements (CCJs)?"
                  name="has_ccjs"
                  control={control}
                  disabled={readOnly}
                />
                <YesNoField
                  label="Have you missed payments or had any defaults?"
                  name="has_defaults"
                  control={control}
                  disabled={readOnly}
                />
                <YesNoField
                  label="Have you ever been declared bankrupt or entered an IVA?"
                  name="has_bankruptcy_or_iva"
                  control={control}
                  disabled={readOnly}
                />
                <Field label="Anything else we should know about your credit history? (optional)">
                  <Textarea rows={3} {...register("credit_notes")} />
                </Field>
              </>
            )}

            {step === 3 && (
              <>
                <Field label="Property value (£)" error={errors.property_value?.message}>
                  <Input type="number" min={0} step="1000" {...register("property_value")} />
                </Field>
                <Field label="Deposit amount (£)" error={errors.deposit_amount?.message}>
                  <Input type="number" min={0} step="1000" {...register("deposit_amount")} />
                </Field>
                <Field label="Mortgage type" error={errors.mortgage_type?.message}>
                  <SelectField name="mortgage_type" control={control} disabled={readOnly}>
                    <SelectItem value="first_time_buyer">First-time buyer</SelectItem>
                    <SelectItem value="home_mover">Home mover</SelectItem>
                    <SelectItem value="remortgage">Remortgage</SelectItem>
                    <SelectItem value="buy_to_let">Buy-to-let</SelectItem>
                  </SelectField>
                </Field>
                <Field label="Purchase timeline" error={errors.purchase_timeline?.message}>
                  <SelectField name="purchase_timeline" control={control} disabled={readOnly}>
                    <SelectItem value="0_3_months">0–3 months</SelectItem>
                    <SelectItem value="3_6_months">3–6 months</SelectItem>
                    <SelectItem value="6_12_months">6–12 months</SelectItem>
                    <SelectItem value="just_researching">Just researching</SelectItem>
                  </SelectField>
                </Field>
              </>
            )}

            {step === 4 && <ReviewStep values={watch()} />}
          </fieldset>

          <div className="flex items-center justify-between pt-4">
            <Button type="button" variant="outline" onClick={goBack} disabled={step === 0}>
              <ChevronLeft className="size-4" /> Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={goNext} disabled={readOnly}>
                Next <ChevronRight className="size-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={readOnly || submitting}>
                {submitting ? "Submitting…" : "Submit information form"}
              </Button>
            )}
          </div>
        </form>

        <p className="mt-6 text-sm text-center">
          <Link to="/portal" className="text-brand font-medium">
            Back to case overview
          </Link>
        </p>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-[0.8rem] font-medium text-destructive">{error}</p>}
    </div>
  );
}

function YesNoField({
  label,
  name,
  control,
  disabled,
}: {
  label: string;
  name: "has_ccjs" | "has_defaults" | "has_bankruptcy_or_iva";
  control: Control<FormValues>;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <RadioGroup
            className="flex gap-6"
            value={field.value}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <RadioGroupItem value="yes" /> Yes
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <RadioGroupItem value="no" /> No
            </label>
          </RadioGroup>
        )}
      />
    </div>
  );
}

function SelectField({
  name,
  control,
  disabled,
  children,
}: {
  name: keyof FormValues;
  control: Control<FormValues>;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select
          value={(field.value as string) ?? ""}
          onValueChange={field.onChange}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select…" />
          </SelectTrigger>
          <SelectContent>{children}</SelectContent>
        </Select>
      )}
    />
  );
}

function ReviewStep({ values }: { values: Partial<FormValues> }) {
  const rows: [string, string | number | undefined][] = [
    ["Full name", values.full_name],
    ["Date of birth", values.date_of_birth],
    ["Phone", values.phone],
    ["Address", values.address],
    ["Employment status", values.employment_status],
    ["Employer", values.employer_name],
    ["Annual income", values.annual_income ? `£${values.annual_income}` : undefined],
    ["CCJs", values.has_ccjs],
    ["Defaults", values.has_defaults],
    ["Bankruptcy/IVA", values.has_bankruptcy_or_iva],
    ["Property value", values.property_value ? `£${values.property_value}` : undefined],
    ["Deposit", values.deposit_amount ? `£${values.deposit_amount}` : undefined],
    ["Mortgage type", values.mortgage_type],
    ["Timeline", values.purchase_timeline],
  ];
  return (
    <dl className="divide-y divide-border text-sm">
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between py-2 gap-4">
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="font-medium text-right">{value ?? "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
