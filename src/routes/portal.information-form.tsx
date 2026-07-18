import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  useForm,
  useFieldArray,
  Controller,
  type Control,
  type UseFormRegister,
  type FieldPath,
  type FieldErrors,
} from "react-hook-form";
import { toast } from "sonner";
import { ShieldCheck, ChevronRight, ChevronLeft, Plus, Trash2, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { useMyCase } from "@/hooks/use-my-case";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  emptyDetails,
  mergeDetails,
  type InformationFormDetails,
  EMPLOYMENT_STATUS_OPTIONS,
  FIXED_TERM_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  PURCHASE_REMORTGAGE_OPTIONS,
  PURCHASE_STAGE_OPTIONS,
  REPAYMENT_METHOD_OPTIONS,
  RESIDENCY_STATUS_OPTIONS,
  RESIDENTIAL_BTL_OPTIONS,
  RESIDENTIAL_STATUS_OPTIONS,
  TITLE_OPTIONS,
  YES_NO_OPTIONS,
} from "@/lib/information-form";

export const Route = createFileRoute("/portal/information-form")({
  head: () => ({ meta: [{ title: "Information Form · Fasttrack Mortgages" }] }),
  component: InformationFormPage,
});

type FormValues = InformationFormDetails;
type Path = FieldPath<FormValues>;

// Per-step required fields, validated before advancing. Only required fields
// need listing — optional fields always pass. Applicant 2 is never required.
const STEP_REQUIRED: Path[][] = [
  ["purchase_or_remortgage", "residential_or_btl", "first_time_buyer", "applied_elsewhere"],
  [
    "applicant1.title",
    "applicant1.first_name",
    "applicant1.last_name",
    "applicant1.date_of_birth",
    "applicant1.residential_status",
    "applicant1.current_address.line1",
    "applicant1.date_moved_in",
    "applicant1.mobile",
    "applicant1.email",
    "applicant1.marital_status",
    "applicant1.nin",
    "applicant1.nationality",
    "applicant1.residency_status",
  ],
  [
    "applicant1.employment.status",
    "applicant1.employment.employer_name",
    "applicant1.employment.start_date",
    "applicant1.employment.job_title",
    "applicant1.employment.work_phone",
  ],
  [
    "credit.has_ccjs",
    "credit.has_defaults",
    "credit.has_missed_payments",
    "credit.has_bankruptcy_or_iva",
  ],
  ["loan.property_value", "loan.mortgage_required"],
  ["consent_data_processing", "consent_credit_search"],
];

const STEP_TITLES = [
  "About your mortgage",
  "Applicants & personal details",
  "Employment & income",
  "Commitments & credit",
  "Property & loan details",
  "Review, consent & submit",
];

function isAtLeast18(dob: string) {
  if (!dob) return false;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return false;
  const eighteenth = new Date(birth.getFullYear() + 18, birth.getMonth(), birth.getDate());
  return eighteenth.getTime() <= Date.now();
}

function toNumberOrNull(v: string): number | null {
  const n = Number(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) && v !== "" ? n : null;
}

// Build the row we upsert. `submitted` controls whether this counts as a final
// submission or a saved draft (draft keeps submitted_at untouched/null).
function buildRow(caseId: string, values: FormValues, submitted: boolean) {
  const first = values.applicant1;
  const fullName = [first.first_name, first.middle_name, first.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  const composedAddress = [
    first.current_address.line1,
    first.current_address.line2,
    first.current_address.city,
    first.current_address.county,
    first.current_address.postcode,
    first.current_address.country,
  ]
    .filter(Boolean)
    .join(", ");
  const depositTotal =
    (toNumberOrNull(values.loan.deposit.savings) ?? 0) +
    (toNumberOrNull(values.loan.deposit.asset_sale_amount) ?? 0) +
    (toNumberOrNull(values.loan.deposit.gift_amount) ?? 0) +
    (toNumberOrNull(values.loan.deposit.family_gifts) ?? 0);

  return {
    case_id: caseId,
    // Flat columns mirror Applicant 1 for back-compat with the admin summary.
    full_name: fullName || null,
    date_of_birth: isAtLeast18(first.date_of_birth) ? first.date_of_birth : null,
    phone: first.mobile || null,
    address: composedAddress || null,
    employment_status: first.employment.status || null,
    employer_name: first.employment.employer_name || null,
    annual_income: toNumberOrNull(first.employment.gross_salary),
    has_ccjs: values.credit.has_ccjs === "Yes",
    has_defaults: values.credit.has_defaults === "Yes",
    has_bankruptcy_or_iva: values.credit.has_bankruptcy_or_iva === "Yes",
    credit_notes: values.credit.notes || null,
    property_value: toNumberOrNull(values.loan.property_value),
    deposit_amount: depositTotal || null,
    mortgage_type:
      [values.residential_or_btl, values.purchase_or_remortgage].filter(Boolean).join(" ") || null,
    purchase_timeline: values.purchase_stage || null,
    details: values,
    ...(submitted ? { submitted_at: new Date().toISOString() } : {}),
  };
}

function InformationFormPage() {
  const { session } = useAuth();
  const { case: myCase, loading: caseLoading } = useMyCase();
  const [step, setStep] = useState(0);
  const [loadingForm, setLoadingForm] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: emptyDetails(), mode: "onBlur" });

  const dependents = useFieldArray({ control, name: "dependents" });
  const hasSecond = watch("has_second_applicant");
  const purchaseOrRemortgage = watch("purchase_or_remortgage");
  const isRemortgage = purchaseOrRemortgage === "Remortgage";
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
        // Prefer the full payload; fall back to legacy flat columns for old rows.
        if (data.details) {
          reset(mergeDetails(data.details));
        } else if (data.full_name) {
          const legacy = emptyDetails();
          const [first, ...rest] = (data.full_name ?? "").split(" ");
          legacy.applicant1.first_name = first ?? "";
          legacy.applicant1.last_name = rest.join(" ");
          legacy.applicant1.date_of_birth = data.date_of_birth ?? "";
          legacy.applicant1.mobile = data.phone ?? "";
          legacy.applicant1.current_address.line1 = data.address ?? "";
          legacy.applicant1.employment.employer_name = data.employer_name ?? "";
          legacy.applicant1.employment.gross_salary =
            data.annual_income != null ? String(data.annual_income) : "";
          legacy.loan.property_value =
            data.property_value != null ? String(data.property_value) : "";
          legacy.credit.has_ccjs = data.has_ccjs ? "Yes" : "No";
          legacy.credit.has_defaults = data.has_defaults ? "Yes" : "No";
          legacy.credit.has_bankruptcy_or_iva = data.has_bankruptcy_or_iva ? "Yes" : "No";
          legacy.credit.notes = data.credit_notes ?? "";
          reset(legacy);
        }
        setAlreadySubmitted(data.submitted_at);
      }
      setLoadingForm(false);
    })();
  }, [caseLoading, myCase, reset]);

  async function goNext() {
    const valid = await trigger(STEP_REQUIRED[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEP_TITLES.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function saveDraft() {
    if (!myCase || !session?.user || readOnly) return;
    setSavingDraft(true);
    const { error } = await supabase
      .from("information_form_responses")
      .upsert(buildRow(myCase.id, getValues(), false));
    setSavingDraft(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Draft saved. You can come back and finish later.");
  }

  async function onSubmit(values: FormValues) {
    if (!myCase || !session?.user) return;
    setSubmitting(true);
    const { error } = await supabase
      .from("information_form_responses")
      .upsert(buildRow(myCase.id, values, true));
    setSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Information form submitted. Your advisor will review it shortly.");
    setAlreadySubmitted(new Date().toISOString());
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
      <div className="container-page max-w-3xl">
        <div className="eyebrow mb-3 text-brand">Case {myCase?.case_number}</div>
        <h1 className="text-3xl font-semibold mb-3">Information Form</h1>
        <p className="text-muted-foreground mb-8 text-sm">
          This helps us assess your eligibility accurately the first time. Fill in as much as you
          can — use <span className="font-medium">Save draft</span> at any point and come back to
          finish later.
        </p>

        <div className="mb-8 p-5 rounded-2xl bg-brand-soft/60 ring-1 ring-brand/20 flex gap-3">
          <ShieldCheck className="size-5 text-brand shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Your data:</span> everything here is
            used only to assess your mortgage application. Provide verifiable figures (payslips, or
            SA302s if self-employed) rather than estimates where you can.
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
        <div className="flex items-center gap-2 mb-3">
          {STEP_TITLES.map((title, i) => (
            <div
              key={title}
              className={`flex-1 h-1.5 rounded-full ${i <= step ? "bg-brand" : "bg-secondary"}`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mb-8">
          Step {step + 1} of {STEP_TITLES.length}
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-card p-6 sm:p-8 rounded-2xl ring-1 ring-border space-y-6"
        >
          <h2 className="text-lg font-semibold">{STEP_TITLES[step]}</h2>

          <fieldset disabled={readOnly} className="space-y-6">
            {step === 0 && (
              <StepAboutMortgage
                register={register}
                control={control}
                watch={watch}
                errors={errors}
              />
            )}
            {step === 1 && (
              <StepApplicants
                register={register}
                control={control}
                watch={watch}
                errors={errors}
                hasSecond={hasSecond}
                dependents={dependents}
                readOnly={readOnly}
              />
            )}
            {step === 2 && (
              <StepEmployment
                register={register}
                control={control}
                watch={watch}
                errors={errors}
                hasSecond={hasSecond}
              />
            )}
            {step === 3 && (
              <StepCommitmentsCredit
                register={register}
                control={control}
                watch={watch}
                errors={errors}
              />
            )}
            {step === 4 && (
              <StepLoan
                register={register}
                control={control}
                watch={watch}
                errors={errors}
                isRemortgage={isRemortgage}
              />
            )}
            {step === 5 && (
              <StepReview values={watch()} register={register} control={control} errors={errors} />
            )}
          </fieldset>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <Button type="button" variant="outline" onClick={goBack} disabled={step === 0}>
              <ChevronLeft className="size-4" /> Back
            </Button>
            <div className="flex items-center gap-3">
              {!readOnly && (
                <Button type="button" variant="ghost" onClick={saveDraft} disabled={savingDraft}>
                  <Save className="size-4" /> {savingDraft ? "Saving…" : "Save draft"}
                </Button>
              )}
              {step < STEP_TITLES.length - 1 ? (
                <Button type="button" onClick={goNext} disabled={readOnly}>
                  Next <ChevronRight className="size-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={readOnly || submitting}>
                  {submitting ? "Submitting…" : "Submit information form"}
                </Button>
              )}
            </div>
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

// ---------------------------------------------------------------------------
// Reusable field primitives
// ---------------------------------------------------------------------------

function fieldError(errors: FieldErrors<FormValues>, name: Path): string | undefined {
  const parts = name.split(".");
  let node: unknown = errors;
  for (const part of parts) {
    if (node && typeof node === "object" && part in (node as Record<string, unknown>)) {
      node = (node as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  const message = (node as { message?: string } | undefined)?.message;
  return typeof message === "string" ? message : undefined;
}

function TextField({
  label,
  name,
  register,
  errors,
  required,
  type = "text",
  placeholder,
  hint,
}: {
  label: string;
  name: Path;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  required?: boolean;
  type?: string;
  placeholder?: string;
  hint?: string;
}) {
  const error = fieldError(errors, name);
  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        type={type}
        placeholder={placeholder}
        {...register(name, required ? { required: `${label} is required` } : undefined)}
      />
      {hint && <p className="text-[0.75rem] text-muted-foreground">{hint}</p>}
      {error && <p className="text-[0.8rem] font-medium text-destructive">{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  name,
  control,
  options,
  required,
  hint,
}: {
  label: string;
  name: Path;
  control: Control<FormValues>;
  options: readonly string[];
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Controller
        control={control}
        name={name}
        rules={required ? { required: `${label} is required` } : undefined}
        render={({ field, fieldState }) => (
          <>
            <Select value={(field.value as string) || ""} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hint && <p className="text-[0.75rem] text-muted-foreground">{hint}</p>}
            {fieldState.error && (
              <p className="text-[0.8rem] font-medium text-destructive">
                {fieldState.error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
}

function TextAreaField({
  label,
  name,
  register,
  rows = 3,
  hint,
}: {
  label: string;
  name: Path;
  register: UseFormRegister<FormValues>;
  rows?: number;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea rows={rows} {...register(name)} />
      {hint && <p className="text-[0.75rem] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground border-b border-border pb-2">
      {children}
    </h3>
  );
}

function AddressFields({
  prefix,
  register,
  errors,
  requireLine1,
}: {
  prefix: string;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  requireLine1?: boolean;
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <TextField
          label="Address line 1"
          name={`${prefix}.line1` as Path}
          register={register}
          errors={errors}
          required={requireLine1}
        />
      </div>
      <div className="sm:col-span-2">
        <TextField
          label="Address line 2"
          name={`${prefix}.line2` as Path}
          register={register}
          errors={errors}
        />
      </div>
      <TextField label="City" name={`${prefix}.city` as Path} register={register} errors={errors} />
      <TextField
        label="County"
        name={`${prefix}.county` as Path}
        register={register}
        errors={errors}
      />
      <TextField
        label="Postcode"
        name={`${prefix}.postcode` as Path}
        register={register}
        errors={errors}
      />
      <TextField
        label="Country"
        name={`${prefix}.country` as Path}
        register={register}
        errors={errors}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared prop bag for step components
// ---------------------------------------------------------------------------

interface StepProps {
  register: UseFormRegister<FormValues>;
  control: Control<FormValues>;
  watch: ReturnType<typeof useForm<FormValues>>["watch"];
  errors: FieldErrors<FormValues>;
}

// ---------------------------------------------------------------------------
// Step 0 — About your mortgage
// ---------------------------------------------------------------------------

function StepAboutMortgage({ register, control, watch, errors }: StepProps) {
  const applied = watch("applied_elsewhere");
  const isPurchase = watch("purchase_or_remortgage") === "Purchase";
  return (
    <>
      <div className="grid sm:grid-cols-2 gap-4">
        <SelectField
          label="Are you buying or remortgaging?"
          name="purchase_or_remortgage"
          control={control}
          options={PURCHASE_REMORTGAGE_OPTIONS}
          required
        />
        <SelectField
          label="Residential or Buy to Let?"
          name="residential_or_btl"
          control={control}
          options={RESIDENTIAL_BTL_OPTIONS}
          required
        />
        <SelectField
          label="Are you a first-time buyer?"
          name="first_time_buyer"
          control={control}
          options={YES_NO_OPTIONS}
          required
        />
        {isPurchase && (
          <SelectField
            label="How far along is your purchase?"
            name="purchase_stage"
            control={control}
            options={PURCHASE_STAGE_OPTIONS}
          />
        )}
      </div>
      <SelectField
        label="Have you already applied for a mortgage with any other lender or broker?"
        name="applied_elsewhere"
        control={control}
        options={YES_NO_OPTIONS}
        required
      />
      {applied === "Yes" && (
        <TextAreaField
          label="If yes — what was the outcome?"
          name="applied_outcome"
          register={register}
        />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Applicants & personal details
// ---------------------------------------------------------------------------

function ApplicantPersonal({
  prefix,
  register,
  control,
  watch,
  errors,
  required,
}: {
  prefix: "applicant1" | "applicant2";
  register: UseFormRegister<FormValues>;
  control: Control<FormValues>;
  watch: StepProps["watch"];
  errors: FieldErrors<FormValues>;
  required?: boolean;
}) {
  const residency = watch(`${prefix}.residency_status` as Path) as string;
  const needsVisa = residency === "Visa Holder" || residency === "Other";
  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <SelectField
          label="Title"
          name={`${prefix}.title` as Path}
          control={control}
          options={TITLE_OPTIONS}
          required={required}
        />
        <div className="hidden sm:block" />
        <TextField
          label="First name"
          name={`${prefix}.first_name` as Path}
          register={register}
          errors={errors}
          required={required}
        />
        <TextField
          label="Middle name"
          name={`${prefix}.middle_name` as Path}
          register={register}
          errors={errors}
        />
        <TextField
          label="Last name"
          name={`${prefix}.last_name` as Path}
          register={register}
          errors={errors}
          required={required}
        />
        <TextField
          label="Date of birth"
          name={`${prefix}.date_of_birth` as Path}
          register={register}
          errors={errors}
          type="date"
          required={required}
        />
      </div>

      <SelectField
        label="Residential status"
        name={`${prefix}.residential_status` as Path}
        control={control}
        options={RESIDENTIAL_STATUS_OPTIONS}
        required={required}
      />

      <div className="space-y-3">
        <SectionTitle>Current address</SectionTitle>
        <AddressFields
          prefix={`${prefix}.current_address`}
          register={register}
          errors={errors}
          requireLine1={required}
        />
        <TextField
          label="Date moved in"
          name={`${prefix}.date_moved_in` as Path}
          register={register}
          errors={errors}
          type="date"
          required={required}
        />
      </div>

      <details className="rounded-xl bg-secondary/40 p-4">
        <summary className="text-sm font-medium cursor-pointer">
          Lived here less than 3 years? Add previous address
        </summary>
        <div className="space-y-4 pt-4">
          <AddressFields
            prefix={`${prefix}.previous_address`}
            register={register}
            errors={errors}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField
              label="Date moved in"
              name={`${prefix}.previous_date_moved_in` as Path}
              register={register}
              errors={errors}
              type="date"
            />
            <TextField
              label="Date moved out"
              name={`${prefix}.previous_date_moved_out` as Path}
              register={register}
              errors={errors}
              type="date"
            />
          </div>
          <SelectField
            label="Previous residential status"
            name={`${prefix}.previous_residential_status` as Path}
            control={control}
            options={RESIDENTIAL_STATUS_OPTIONS}
          />
        </div>
      </details>

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField
          label="Home telephone (optional)"
          name={`${prefix}.home_phone` as Path}
          register={register}
          errors={errors}
          type="tel"
        />
        <TextField
          label="Mobile number"
          name={`${prefix}.mobile` as Path}
          register={register}
          errors={errors}
          type="tel"
          required={required}
        />
        <TextField
          label="Email"
          name={`${prefix}.email` as Path}
          register={register}
          errors={errors}
          type="email"
          required={required}
        />
        <SelectField
          label="Marital status"
          name={`${prefix}.marital_status` as Path}
          control={control}
          options={MARITAL_STATUS_OPTIONS}
          required={required}
        />
        <TextField
          label="National Insurance number"
          name={`${prefix}.nin` as Path}
          register={register}
          errors={errors}
          required={required}
        />
        <TextField
          label="Nationality"
          name={`${prefix}.nationality` as Path}
          register={register}
          errors={errors}
          required={required}
        />
        <SelectField
          label="Right to reside in the UK"
          name={`${prefix}.residency_status` as Path}
          control={control}
          options={RESIDENCY_STATUS_OPTIONS}
          required={required}
        />
      </div>
      {needsVisa && (
        <div className="grid sm:grid-cols-2 gap-4">
          <TextField
            label="Visa type / immigration status"
            name={`${prefix}.visa_type` as Path}
            register={register}
            errors={errors}
          />
          <TextField
            label="When did you first move to the UK?"
            name={`${prefix}.uk_arrival_date` as Path}
            register={register}
            errors={errors}
            type="date"
          />
        </div>
      )}
    </div>
  );
}

function StepApplicants({
  register,
  control,
  watch,
  errors,
  hasSecond,
  dependents,
  readOnly,
}: StepProps & {
  hasSecond: boolean;
  dependents: ReturnType<typeof useFieldArray<FormValues, "dependents">>;
  readOnly: boolean;
}) {
  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <SectionTitle>Applicant 1</SectionTitle>
        <ApplicantPersonal
          prefix="applicant1"
          register={register}
          control={control}
          watch={watch}
          errors={errors}
          required
        />
      </div>

      <label className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 text-sm cursor-pointer">
        <input type="checkbox" className="size-4" {...register("has_second_applicant")} />
        This is a joint application — add a second applicant
      </label>

      {hasSecond && (
        <div className="space-y-5">
          <SectionTitle>Applicant 2</SectionTitle>
          <ApplicantPersonal
            prefix="applicant2"
            register={register}
            control={control}
            watch={watch}
            errors={errors}
          />
        </div>
      )}

      <div className="space-y-4">
        <SectionTitle>Dependents</SectionTitle>
        <p className="text-xs text-muted-foreground">
          Add any dependent children under the age of 17.
        </p>
        {dependents.fields.map((f, i) => (
          <div key={f.id} className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
            <TextField
              label={`Dependent ${i + 1} name`}
              name={`dependents.${i}.name` as Path}
              register={register}
              errors={errors}
            />
            <TextField
              label="Date of birth"
              name={`dependents.${i}.date_of_birth` as Path}
              register={register}
              errors={errors}
              type="date"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => dependents.remove(i)}
              disabled={readOnly}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => dependents.append({ name: "", date_of_birth: "" })}
          disabled={readOnly}
        >
          <Plus className="size-4" /> Add dependent
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField
          label="How many properties do you own currently?"
          name="properties_owned"
          register={register}
          errors={errors}
          type="number"
          hint="If you own multiple properties, please also complete our Property Portfolio Form."
        />
        <TextField
          label="How many of them are mortgaged?"
          name="properties_mortgaged"
          register={register}
          errors={errors}
          type="number"
        />
      </div>
      <TextAreaField
        label="Who else will live at the property over the age of 17 other than the applicants?"
        name="other_adult_occupants"
        register={register}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Employment & income
// ---------------------------------------------------------------------------

function ApplicantEmployment({
  prefix,
  register,
  control,
  watch,
  errors,
  required,
}: {
  prefix: "applicant1" | "applicant2";
  register: UseFormRegister<FormValues>;
  control: Control<FormValues>;
  watch: StepProps["watch"];
  errors: FieldErrors<FormValues>;
  required?: boolean;
}) {
  const status = watch(`${prefix}.employment.status` as Path) as string;
  const selfEmployed = status === "Self-employed";
  const receivesBenefits = watch(`${prefix}.receives_benefits` as Path) === "Yes";
  return (
    <div className="space-y-5">
      <SelectField
        label="What is your employment status?"
        name={`${prefix}.employment.status` as Path}
        control={control}
        options={EMPLOYMENT_STATUS_OPTIONS}
        required={required}
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <TextField
          label={selfEmployed ? "Business name" : "Employer name"}
          name={`${prefix}.employment.employer_name` as Path}
          register={register}
          errors={errors}
          required={required}
        />
        <TextField
          label="Job title"
          name={`${prefix}.employment.job_title` as Path}
          register={register}
          errors={errors}
          required={required}
        />
        <TextField
          label="Start date"
          name={`${prefix}.employment.start_date` as Path}
          register={register}
          errors={errors}
          type="date"
          required={required}
        />
        <TextField
          label="Work / business phone number"
          name={`${prefix}.employment.work_phone` as Path}
          register={register}
          errors={errors}
          type="tel"
          required={required}
        />
      </div>

      <div className="space-y-3">
        <SectionTitle>{selfEmployed ? "Business address" : "Employer address"}</SectionTitle>
        <AddressFields
          prefix={`${prefix}.employment.employer_address`}
          register={register}
          errors={errors}
        />
      </div>

      {!selfEmployed && (
        <TextField
          label="Gross salary per year (before tax) £"
          name={`${prefix}.employment.gross_salary` as Path}
          register={register}
          errors={errors}
          type="number"
        />
      )}

      {selfEmployed && (
        <div className="space-y-3">
          <SectionTitle>Net profit — last 3 years</SectionTitle>
          <p className="text-xs text-muted-foreground">
            If self-employed, provide your net profits from the past three years. If you need help,
            consult your accountant.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <TextField
              label="Most recent year £"
              name={`${prefix}.employment.net_profit_year1` as Path}
              register={register}
              errors={errors}
              type="number"
            />
            <TextField
              label="Year before £"
              name={`${prefix}.employment.net_profit_year2` as Path}
              register={register}
              errors={errors}
              type="number"
            />
            <TextField
              label="3 years ago £"
              name={`${prefix}.employment.net_profit_year3` as Path}
              register={register}
              errors={errors}
              type="number"
            />
          </div>
        </div>
      )}

      <details className="rounded-xl bg-secondary/40 p-4">
        <summary className="text-sm font-medium cursor-pointer">
          Employed for less than a year? Add previous employment
        </summary>
        <div className="space-y-4 pt-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField
              label="Employer name"
              name={`${prefix}.employment.previous_employment.employer_name` as Path}
              register={register}
              errors={errors}
            />
            <TextField
              label="Salary"
              name={`${prefix}.employment.previous_employment.salary` as Path}
              register={register}
              errors={errors}
            />
            <TextField
              label="Dates worked from"
              name={`${prefix}.employment.previous_employment.from` as Path}
              register={register}
              errors={errors}
              type="date"
            />
            <TextField
              label="Dates worked to"
              name={`${prefix}.employment.previous_employment.to` as Path}
              register={register}
              errors={errors}
              type="date"
            />
          </div>
          <AddressFields
            prefix={`${prefix}.employment.previous_employment.address`}
            register={register}
            errors={errors}
          />
          <TextField
            label="Reason for leaving"
            name={`${prefix}.employment.previous_employment.reason_for_leaving` as Path}
            register={register}
            errors={errors}
          />
        </div>
      </details>

      <div className="space-y-4">
        <SelectField
          label="Do you receive any benefits?"
          name={`${prefix}.receives_benefits` as Path}
          control={control}
          options={YES_NO_OPTIONS}
        />
        {receivesBenefits && (
          <div className="space-y-4 rounded-xl bg-secondary/30 p-4">
            <p className="text-xs text-muted-foreground">
              For Universal Credit, provide the total received over the past three months (excluding
              any housing benefit payment).
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              <TextField
                label="Universal Credit — last month £"
                name={`${prefix}.benefits.universal_credit_last_month` as Path}
                register={register}
                errors={errors}
                type="number"
              />
              <TextField
                label="Previous month £"
                name={`${prefix}.benefits.universal_credit_previous_month` as Path}
                register={register}
                errors={errors}
                type="number"
              />
              <TextField
                label="Prior month £"
                name={`${prefix}.benefits.universal_credit_prior_month` as Path}
                register={register}
                errors={errors}
                type="number"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <TextField
                label="PIP / DLA (monthly) £"
                name={`${prefix}.benefits.pip_dla` as Path}
                register={register}
                errors={errors}
                type="number"
              />
              <TextField
                label="Child benefit (annual) £"
                name={`${prefix}.benefits.child_benefit_annual` as Path}
                register={register}
                errors={errors}
                type="number"
              />
              <TextField
                label="Carer's Allowance (monthly) £"
                name={`${prefix}.benefits.carers_allowance` as Path}
                register={register}
                errors={errors}
                type="number"
              />
              <TextField
                label="Any other benefits £"
                name={`${prefix}.benefits.other_benefits` as Path}
                register={register}
                errors={errors}
              />
            </div>
            <TextField
              label="Who is this benefit paid to?"
              name={`${prefix}.benefits.paid_to` as Path}
              register={register}
              errors={errors}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function StepEmployment({
  register,
  control,
  watch,
  errors,
  hasSecond,
}: StepProps & { hasSecond: boolean }) {
  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <SectionTitle>Applicant 1 — employment & income</SectionTitle>
        <ApplicantEmployment
          prefix="applicant1"
          register={register}
          control={control}
          watch={watch}
          errors={errors}
          required
        />
      </div>
      {hasSecond && (
        <div className="space-y-5">
          <SectionTitle>Applicant 2 — employment & income</SectionTitle>
          <ApplicantEmployment
            prefix="applicant2"
            register={register}
            control={control}
            watch={watch}
            errors={errors}
          />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Commitments & credit
// ---------------------------------------------------------------------------

function StepCommitmentsCredit({ register, control, watch, errors }: StepProps) {
  const anyAdverse =
    watch("credit.has_ccjs") === "Yes" ||
    watch("credit.has_defaults") === "Yes" ||
    watch("credit.has_missed_payments") === "Yes" ||
    watch("credit.has_bankruptcy_or_iva") === "Yes";
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <SectionTitle>Monthly commitments</SectionTitle>
        <p className="text-xs text-muted-foreground">
          Your regular monthly outgoings help us assess affordability. Enter approximate monthly
          amounts (leave blank if none).
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextField
            label="Current rent / mortgage £"
            name="commitments.current_housing_cost"
            register={register}
            errors={errors}
            type="number"
          />
          <TextField
            label="Credit cards (monthly) £"
            name="commitments.credit_cards"
            register={register}
            errors={errors}
            type="number"
          />
          <TextField
            label="Personal loans (monthly) £"
            name="commitments.loans"
            register={register}
            errors={errors}
            type="number"
          />
          <TextField
            label="Car finance (monthly) £"
            name="commitments.car_finance"
            register={register}
            errors={errors}
            type="number"
          />
          <TextField
            label="Childcare (monthly) £"
            name="commitments.childcare"
            register={register}
            errors={errors}
            type="number"
          />
          <TextField
            label="Other commitments (monthly) £"
            name="commitments.other"
            register={register}
            errors={errors}
            type="number"
          />
        </div>
      </div>

      <div className="space-y-4">
        <SectionTitle>Credit history</SectionTitle>
        <p className="text-xs text-muted-foreground">
          Please disclose any adverse credit. Being upfront lets us match you to the right lender —
          it won't necessarily stop your application.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <SelectField
            label="Any County Court Judgements (CCJs)?"
            name="credit.has_ccjs"
            control={control}
            options={YES_NO_OPTIONS}
            required
          />
          <SelectField
            label="Any defaults?"
            name="credit.has_defaults"
            control={control}
            options={YES_NO_OPTIONS}
            required
          />
          <SelectField
            label="Any missed or late payments?"
            name="credit.has_missed_payments"
            control={control}
            options={YES_NO_OPTIONS}
            required
          />
          <SelectField
            label="Ever bankrupt or in an IVA?"
            name="credit.has_bankruptcy_or_iva"
            control={control}
            options={YES_NO_OPTIONS}
            required
          />
        </div>
        {anyAdverse && (
          <TextAreaField
            label="Please give details of any adverse credit (dates, amounts, whether settled)"
            name="credit.notes"
            register={register}
            hint="This helps your advisor find lenders who consider your circumstances."
          />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 4 — Property & loan details
// ---------------------------------------------------------------------------

function PartyContactFields({
  prefix,
  title,
  register,
  errors,
  showRelationship,
}: {
  prefix: "loan.estate_agent" | "loan.seller";
  title: string;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  showRelationship?: boolean;
}) {
  return (
    <div className="space-y-3">
      <SectionTitle>{title}</SectionTitle>
      <div className="grid sm:grid-cols-2 gap-4">
        <TextField
          label={showRelationship ? "Full name of the seller" : "Contact person"}
          name={`${prefix}.name` as Path}
          register={register}
          errors={errors}
        />
        {showRelationship && (
          <TextField
            label="Your relationship to the seller"
            name={`${prefix}.relationship` as Path}
            register={register}
            errors={errors}
          />
        )}
        <TextField
          label="Address"
          name={`${prefix}.address` as Path}
          register={register}
          errors={errors}
        />
        <TextField
          label="Number"
          name={`${prefix}.number` as Path}
          register={register}
          errors={errors}
          type="tel"
        />
        <TextField
          label="Email"
          name={`${prefix}.email` as Path}
          register={register}
          errors={errors}
          type="email"
        />
      </div>
    </div>
  );
}

function StepLoan({
  register,
  control,
  watch,
  errors,
  isRemortgage,
}: StepProps & { isRemortgage: boolean }) {
  const giftAmount = watch("loan.deposit.gift_amount");
  const hasGift = !!giftAmount && Number(giftAmount) > 0;
  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 gap-4">
        <TextField
          label="Estimated property value £"
          name="loan.property_value"
          register={register}
          errors={errors}
          type="number"
          required
        />
        {!isRemortgage && (
          <TextField
            label="Agreed purchase price £"
            name="loan.purchase_price"
            register={register}
            errors={errors}
            type="number"
          />
        )}
      </div>

      {isRemortgage ? (
        <div className="grid sm:grid-cols-2 gap-4">
          <TextField
            label="Current lender"
            name="loan.current_lender"
            register={register}
            errors={errors}
          />
          <TextField
            label="Outstanding balance £"
            name="loan.outstanding_balance"
            register={register}
            errors={errors}
            type="number"
          />
        </div>
      ) : (
        <div className="space-y-3">
          <SectionTitle>Deposit / equity</SectionTitle>
          <p className="text-xs text-muted-foreground">
            Tell us the amount and where the deposit will come from.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField
              label="Savings £"
              name="loan.deposit.savings"
              register={register}
              errors={errors}
              type="number"
            />
            <TextField
              label="Sale of asset — amount £"
              name="loan.deposit.asset_sale_amount"
              register={register}
              errors={errors}
              type="number"
            />
            <TextField
              label="Sale of asset — details"
              name="loan.deposit.asset_sale_details"
              register={register}
              errors={errors}
            />
            <TextField
              label="Gifted funds — number of contributors"
              name="loan.deposit.gift_contributor_count"
              register={register}
              errors={errors}
              type="number"
            />
            <TextField
              label="Total gift amount £"
              name="loan.deposit.gift_amount"
              register={register}
              errors={errors}
              type="number"
            />
            <TextField
              label="Family gifts £"
              name="loan.deposit.family_gifts"
              register={register}
              errors={errors}
              type="number"
            />
          </div>
          {hasGift && (
            <div className="grid sm:grid-cols-2 gap-4">
              <TextField
                label="Gift donor — name"
                name="loan.deposit.gift_donor_name"
                register={register}
                errors={errors}
                hint="Gifted deposits need a donor and a gift letter for anti-money-laundering checks."
              />
              <TextField
                label="Gift donor — relationship to you"
                name="loan.deposit.gift_donor_relationship"
                register={register}
                errors={errors}
              />
            </div>
          )}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField
          label="Mortgage required £"
          name="loan.mortgage_required"
          register={register}
          errors={errors}
          type="number"
          required
        />
        <TextField
          label="Term required (years)"
          name="loan.term_years"
          register={register}
          errors={errors}
          type="number"
        />
        <SelectField
          label="Initial fixed term required"
          name="loan.fixed_term"
          control={control}
          options={FIXED_TERM_OPTIONS}
        />
        <SelectField
          label="Repayment method"
          name="loan.repayment_method"
          control={control}
          options={REPAYMENT_METHOD_OPTIONS}
        />
        <TextField
          label="Budget for monthly mortgage payment £"
          name="loan.budget"
          register={register}
          errors={errors}
          type="number"
        />
        <TextField
          label="Expected retirement age"
          name="expected_retirement_age"
          register={register}
          errors={errors}
          type="number"
          hint="Lenders check whether the term runs past your expected retirement."
        />
      </div>
      <TextField
        label="Lender fee — add to loan or pay upfront?"
        name="loan.fee_arrangement"
        register={register}
        errors={errors}
      />

      {isRemortgage && (
        <TextAreaField
          label="If remortgaging to raise capital, what is the purpose of the funds?"
          name="loan.remortgage_purpose"
          register={register}
        />
      )}

      <div className="space-y-3">
        <SectionTitle>Property address</SectionTitle>
        <AddressFields prefix="loan.property_address" register={register} errors={errors} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <SelectField
          label="Type of property"
          name="loan.property_type"
          control={control}
          options={PROPERTY_TYPE_OPTIONS}
        />
        <TextField
          label="Number of bedrooms"
          name="loan.bedrooms"
          register={register}
          errors={errors}
          type="number"
        />
      </div>

      <SelectField
        label="Is the property above or near commercial premises?"
        name="loan.near_commercial"
        control={control}
        options={YES_NO_OPTIONS}
      />

      {!isRemortgage && (
        <details className="rounded-xl bg-secondary/40 p-4">
          <summary className="text-sm font-medium cursor-pointer">
            Estate agent / seller details (optional — if known)
          </summary>
          <div className="space-y-6 pt-4">
            <PartyContactFields
              prefix="loan.estate_agent"
              title="Estate agent"
              register={register}
              errors={errors}
            />
            <PartyContactFields
              prefix="loan.seller"
              title="If private sale — seller details"
              register={register}
              errors={errors}
              showRelationship
            />
          </div>
        </details>
      )}

      <TextAreaField label="Any convictions?" name="loan.convictions" register={register} />
      <TextAreaField
        label="Additional information"
        name="loan.additional_info"
        register={register}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 5 — Review, consent & submit
// ---------------------------------------------------------------------------

function ReviewRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between py-2 gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-right">{value || "—"}</dd>
    </div>
  );
}

function ConsentCheckbox({
  name,
  register,
  errors,
  children,
}: {
  name: Path;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  children: React.ReactNode;
}) {
  const error = fieldError(errors, name);
  return (
    <div className="space-y-1">
      <label className="flex items-start gap-3 text-sm cursor-pointer">
        <input
          type="checkbox"
          className="size-4 mt-0.5 shrink-0"
          {...register(name, { required: "Please tick to continue" })}
        />
        <span className="text-muted-foreground leading-relaxed">{children}</span>
      </label>
      {error && <p className="text-[0.8rem] font-medium text-destructive pl-7">{error}</p>}
    </div>
  );
}

function StepReview({
  values,
  register,
  errors,
}: {
  values: FormValues;
  register: UseFormRegister<FormValues>;
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
}) {
  const a1 = values.applicant1;
  const name = [a1.first_name, a1.middle_name, a1.last_name].filter(Boolean).join(" ");
  return (
    <div className="space-y-6 text-sm">
      <p className="text-muted-foreground">
        Please review the key details below, tick the declarations, then submit. You can go back to
        any step to make changes.
      </p>
      <dl className="divide-y divide-border">
        <ReviewRow
          label="Mortgage"
          value={[values.residential_or_btl, values.purchase_or_remortgage]
            .filter(Boolean)
            .join(" · ")}
        />
        <ReviewRow label="First-time buyer" value={values.first_time_buyer} />
        <ReviewRow label="Applicant 1" value={`${a1.title} ${name}`.trim()} />
        <ReviewRow label="Email" value={a1.email} />
        <ReviewRow label="Employment" value={a1.employment.status} />
        <ReviewRow label="Second applicant" value={values.has_second_applicant ? "Yes" : "No"} />
        <ReviewRow label="Dependents" value={String(values.dependents.length)} />
        <ReviewRow
          label="Property value"
          value={values.loan.property_value ? `£${values.loan.property_value}` : undefined}
        />
        <ReviewRow
          label="Mortgage required"
          value={values.loan.mortgage_required ? `£${values.loan.mortgage_required}` : undefined}
        />
      </dl>

      <div className="space-y-3 rounded-xl bg-secondary/40 p-4">
        <h3 className="text-sm font-semibold">Declarations</h3>
        <ConsentCheckbox name="consent_data_processing" register={register} errors={errors}>
          I confirm the information provided is accurate to the best of my knowledge, and I consent
          to Fasttrack Mortgages processing my personal data to assess my mortgage application.
        </ConsentCheckbox>
        <ConsentCheckbox name="consent_credit_search" register={register} errors={errors}>
          I understand that a credit search may be carried out as part of assessing my application.
        </ConsentCheckbox>
      </div>
    </div>
  );
}
