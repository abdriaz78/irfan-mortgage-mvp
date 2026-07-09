// Shape of the full Fast Track intake questionnaire. Stored as-is in the
// `details` jsonb column of information_form_responses. The client form writes
// it and the admin case view reads it. Keep this the single source of truth for
// the questionnaire structure and its option lists.

export interface AddressDetails {
  line1: string;
  line2: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
}

export interface PreviousEmployment {
  employer_name: string;
  address: AddressDetails;
  from: string;
  to: string;
  salary: string;
  reason_for_leaving: string;
}

export interface EmploymentDetails {
  status: string;
  employer_name: string;
  employer_address: AddressDetails;
  start_date: string;
  job_title: string;
  work_phone: string;
  gross_salary: string;
  // Self-employed: net profit for the last three tax years.
  net_profit_year1: string;
  net_profit_year2: string;
  net_profit_year3: string;
  // Completed only if employed for less than a year at the current employer.
  previous_employment: PreviousEmployment;
}

export interface BenefitDetails {
  universal_credit_last_month: string;
  universal_credit_previous_month: string;
  universal_credit_prior_month: string;
  pip_dla: string;
  child_benefit_annual: string;
  carers_allowance: string;
  other_benefits: string;
  paid_to: string;
}

export interface Dependent {
  name: string;
  date_of_birth: string;
}

export interface ApplicantDetails {
  title: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  date_of_birth: string;
  residential_status: string;
  current_address: AddressDetails;
  date_moved_in: string;
  // Previous address is required if less than 3 years at the current address.
  previous_address: AddressDetails;
  previous_date_moved_in: string;
  previous_date_moved_out: string;
  previous_residential_status: string;
  home_phone: string;
  mobile: string;
  email: string;
  marital_status: string;
  nin: string;
  nationality: string;
  // Right to reside — drives whether we ask for visa/arrival details.
  residency_status: string;
  visa_type: string;
  uk_arrival_date: string;
  employment: EmploymentDetails;
  // Benefits are gated behind this Yes/No so most applicants skip the section.
  receives_benefits: string;
  benefits: BenefitDetails;
}

export interface DepositDetails {
  savings: string;
  asset_sale_amount: string;
  asset_sale_details: string;
  gift_contributor_count: string;
  gift_amount: string;
  gift_donor_name: string;
  gift_donor_relationship: string;
  family_gifts: string;
}

export interface PartyContact {
  name: string;
  relationship: string;
  address: string;
  number: string;
  email: string;
}

export interface LoanDetails {
  property_value: string;
  purchase_price: string;
  deposit: DepositDetails;
  mortgage_required: string;
  // Remortgage-only.
  current_lender: string;
  outstanding_balance: string;
  remortgage_purpose: string;
  term_years: string;
  fixed_term: string;
  repayment_method: string;
  budget: string;
  fee_arrangement: string;
  property_address: AddressDetails;
  property_type: string;
  bedrooms: string;
  near_commercial: string;
  // Purchase-only, optional "if known".
  estate_agent: PartyContact;
  seller: PartyContact;
  convictions: string;
  additional_info: string;
}

// Household-level monthly outgoings, used for affordability.
export interface CommitmentDetails {
  current_housing_cost: string;
  credit_cards: string;
  loans: string;
  car_finance: string;
  childcare: string;
  other: string;
}

// Adverse-credit disclosure.
export interface CreditDetails {
  has_ccjs: string;
  has_defaults: string;
  has_missed_payments: string;
  has_bankruptcy_or_iva: string;
  notes: string;
}

export interface InformationFormDetails {
  // Step 1 triage — drives conditional sections downstream.
  purchase_or_remortgage: string;
  residential_or_btl: string;
  first_time_buyer: string;
  purchase_stage: string;
  applied_elsewhere: string;
  applied_outcome: string;

  applicant1: ApplicantDetails;
  has_second_applicant: boolean;
  applicant2: ApplicantDetails;
  dependents: Dependent[];
  properties_owned: string;
  properties_mortgaged: string;
  other_adult_occupants: string;

  commitments: CommitmentDetails;
  credit: CreditDetails;

  loan: LoanDetails;
  expected_retirement_age: string;

  // Declarations — required before submit.
  consent_data_processing: boolean;
  consent_credit_search: boolean;
}

// ---------------------------------------------------------------------------
// Option lists
// ---------------------------------------------------------------------------

export const PURCHASE_REMORTGAGE_OPTIONS = ["Purchase", "Remortgage"] as const;

export const RESIDENTIAL_BTL_OPTIONS = ["Residential", "Buy to Let"] as const;

export const PURCHASE_STAGE_OPTIONS = [
  "Still looking",
  "Viewing properties",
  "Offer made",
  "Offer accepted",
] as const;

export const TITLE_OPTIONS = ["Mr", "Mrs", "Miss", "Ms", "Dr", "Other"] as const;

export const RESIDENTIAL_STATUS_OPTIONS = [
  "Owner Occupier",
  "Renting - Private",
  "Renting - Council",
  "Living with Friends",
  "Living with Family",
  "Other",
] as const;

export const RESIDENCY_STATUS_OPTIONS = [
  "UK Citizen",
  "Permanent Resident / ILR",
  "EU Settled Status",
  "Visa Holder",
  "Other",
] as const;

export const MARITAL_STATUS_OPTIONS = [
  "Single",
  "Married",
  "Civil Partnership",
  "Divorced",
  "Separated",
  "Widowed",
  "Cohabiting",
] as const;

export const EMPLOYMENT_STATUS_OPTIONS = [
  "Employed",
  "Self-employed",
  "Contractor",
  "Retired",
  "Unemployed",
] as const;

export const REPAYMENT_METHOD_OPTIONS = [
  "Capital Repayment",
  "Interest Only",
  "Part and Part",
] as const;

export const FIXED_TERM_OPTIONS = ["2 years", "5 years", "Other"] as const;

export const PROPERTY_TYPE_OPTIONS = [
  "Detached",
  "Semi-detached",
  "Terraced",
  "Back to Back Terraced",
  "Flat / Apartment",
  "Maisonette",
  "Bungalow",
  "Other",
] as const;

export const YES_NO_OPTIONS = ["Yes", "No"] as const;

// ---------------------------------------------------------------------------
// Factories for empty values
// ---------------------------------------------------------------------------

export function emptyAddress(): AddressDetails {
  return { line1: "", line2: "", city: "", county: "", postcode: "", country: "United Kingdom" };
}

function emptyPreviousEmployment(): PreviousEmployment {
  return {
    employer_name: "",
    address: emptyAddress(),
    from: "",
    to: "",
    salary: "",
    reason_for_leaving: "",
  };
}

function emptyEmployment(): EmploymentDetails {
  return {
    status: "",
    employer_name: "",
    employer_address: emptyAddress(),
    start_date: "",
    job_title: "",
    work_phone: "",
    gross_salary: "",
    net_profit_year1: "",
    net_profit_year2: "",
    net_profit_year3: "",
    previous_employment: emptyPreviousEmployment(),
  };
}

function emptyBenefits(): BenefitDetails {
  return {
    universal_credit_last_month: "",
    universal_credit_previous_month: "",
    universal_credit_prior_month: "",
    pip_dla: "",
    child_benefit_annual: "",
    carers_allowance: "",
    other_benefits: "",
    paid_to: "",
  };
}

export function emptyApplicant(): ApplicantDetails {
  return {
    title: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    residential_status: "",
    current_address: emptyAddress(),
    date_moved_in: "",
    previous_address: emptyAddress(),
    previous_date_moved_in: "",
    previous_date_moved_out: "",
    previous_residential_status: "",
    home_phone: "",
    mobile: "",
    email: "",
    marital_status: "",
    nin: "",
    nationality: "",
    residency_status: "",
    visa_type: "",
    uk_arrival_date: "",
    employment: emptyEmployment(),
    receives_benefits: "",
    benefits: emptyBenefits(),
  };
}

function emptyPartyContact(): PartyContact {
  return { name: "", relationship: "", address: "", number: "", email: "" };
}

function emptyLoan(): LoanDetails {
  return {
    property_value: "",
    purchase_price: "",
    deposit: {
      savings: "",
      asset_sale_amount: "",
      asset_sale_details: "",
      gift_contributor_count: "",
      gift_amount: "",
      gift_donor_name: "",
      gift_donor_relationship: "",
      family_gifts: "",
    },
    mortgage_required: "",
    current_lender: "",
    outstanding_balance: "",
    remortgage_purpose: "",
    term_years: "",
    fixed_term: "",
    repayment_method: "",
    budget: "",
    fee_arrangement: "",
    property_address: emptyAddress(),
    property_type: "",
    bedrooms: "",
    near_commercial: "",
    estate_agent: emptyPartyContact(),
    seller: emptyPartyContact(),
    convictions: "",
    additional_info: "",
  };
}

function emptyCommitments(): CommitmentDetails {
  return {
    current_housing_cost: "",
    credit_cards: "",
    loans: "",
    car_finance: "",
    childcare: "",
    other: "",
  };
}

function emptyCredit(): CreditDetails {
  return {
    has_ccjs: "No",
    has_defaults: "No",
    has_missed_payments: "No",
    has_bankruptcy_or_iva: "No",
    notes: "",
  };
}

export function emptyDetails(): InformationFormDetails {
  return {
    purchase_or_remortgage: "",
    residential_or_btl: "Residential",
    first_time_buyer: "",
    purchase_stage: "",
    applied_elsewhere: "",
    applied_outcome: "",
    applicant1: emptyApplicant(),
    has_second_applicant: false,
    applicant2: emptyApplicant(),
    dependents: [],
    properties_owned: "0",
    properties_mortgaged: "0",
    other_adult_occupants: "",
    commitments: emptyCommitments(),
    credit: emptyCredit(),
    loan: emptyLoan(),
    expected_retirement_age: "",
    consent_data_processing: false,
    consent_credit_search: false,
  };
}

// Merge a stored (possibly partial / older) payload onto a complete default so
// the form never sees `undefined` for a control. Deep-merges known nested
// objects; arrays are taken from the stored value when present.
export function mergeDetails(stored: unknown): InformationFormDetails {
  const base = emptyDetails();
  if (!stored || typeof stored !== "object") return base;
  const s = stored as Record<string, unknown>;

  const mergeObj = <T extends object>(def: T, val: unknown): T => {
    if (!val || typeof val !== "object") return def;
    const out = { ...def } as Record<string, unknown>;
    for (const key of Object.keys(def as Record<string, unknown>)) {
      const dv = (def as Record<string, unknown>)[key];
      const vv = (val as Record<string, unknown>)[key];
      if (dv && typeof dv === "object" && !Array.isArray(dv)) {
        out[key] = mergeObj(dv as object, vv);
      } else if (vv !== undefined && vv !== null) {
        out[key] = vv;
      }
    }
    return out as T;
  };

  const str = (v: unknown, fallback: string) => (typeof v === "string" ? v : fallback);

  return {
    ...base,
    purchase_or_remortgage: str(s.purchase_or_remortgage, base.purchase_or_remortgage),
    residential_or_btl: str(s.residential_or_btl, base.residential_or_btl),
    first_time_buyer: str(s.first_time_buyer, base.first_time_buyer),
    purchase_stage: str(s.purchase_stage, base.purchase_stage),
    applied_elsewhere: str(s.applied_elsewhere, base.applied_elsewhere),
    applied_outcome: str(s.applied_outcome, base.applied_outcome),
    applicant1: mergeObj(base.applicant1, s.applicant1),
    has_second_applicant: Boolean(s.has_second_applicant),
    applicant2: mergeObj(base.applicant2, s.applicant2),
    dependents: Array.isArray(s.dependents)
      ? (s.dependents as Dependent[]).map((d) => ({
          name: d?.name ?? "",
          date_of_birth: d?.date_of_birth ?? "",
        }))
      : base.dependents,
    properties_owned: str(s.properties_owned, base.properties_owned),
    properties_mortgaged: str(s.properties_mortgaged, base.properties_mortgaged),
    other_adult_occupants: str(s.other_adult_occupants, base.other_adult_occupants),
    commitments: mergeObj(base.commitments, s.commitments),
    credit: mergeObj(base.credit, s.credit),
    loan: mergeObj(base.loan, s.loan),
    expected_retirement_age: str(s.expected_retirement_age, base.expected_retirement_age),
    consent_data_processing: Boolean(s.consent_data_processing),
    consent_credit_search: Boolean(s.consent_credit_search),
  };
}
