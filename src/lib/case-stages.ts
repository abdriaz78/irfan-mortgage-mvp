export interface CaseStage {
  number: number;
  key: string;
  title: string;
  clientDescription: string;
}

export const CASE_STAGES: CaseStage[] = [
  {
    number: 1,
    key: "inquiry",
    title: "Inquiry Received",
    clientDescription: "We've received your inquiry and a case has been opened for you.",
  },
  {
    number: 2,
    key: "information_form",
    title: "Information Form",
    clientDescription: "Please complete your personal, income, and property details.",
  },
  {
    number: 3,
    key: "document_upload",
    title: "Document Upload",
    clientDescription: "Upload the documents we need to assess your application.",
  },
  {
    number: 4,
    key: "eligibility",
    title: "Eligibility Assessment",
    clientDescription: "We're reviewing your affordability and credit history.",
  },
  {
    number: 5,
    key: "packaging",
    title: "Packaging",
    clientDescription: "We're verifying your documents ahead of submission.",
  },
  {
    number: 6,
    key: "research_submission",
    title: "Research & Submission to Lender",
    clientDescription: "We're researching the best lender fit and submitting your application.",
  },
  {
    number: 7,
    key: "lender_requirements",
    title: "Lender Requirements & Property Visit",
    clientDescription:
      "The lender is reviewing your case and may request more information or a property visit.",
  },
  {
    number: 8,
    key: "mortgage_offer",
    title: "Mortgage Offer",
    clientDescription: "Your mortgage offer has been issued by the lender.",
  },
  {
    number: 9,
    key: "solicitor_updates",
    title: "Solicitor Updates",
    clientDescription: "Your solicitor is handling conveyancing and registry updates.",
  },
  {
    number: 10,
    key: "completion",
    title: "Completion",
    clientDescription: "Congratulations — your mortgage case is complete!",
  },
];

export const TOTAL_STAGES = CASE_STAGES.length;

export function getStage(stageNumber: number): CaseStage {
  return CASE_STAGES.find((s) => s.number === stageNumber) ?? CASE_STAGES[0];
}

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  id_proof: "Proof of ID (passport / driving licence)",
  proof_of_address: "Proof of address (utility bill / bank statement)",
  payslips: "Payslips (last 3 months)",
  bank_statements: "Bank statements (last 3 months)",
  credit_report: "Credit report",
  sa302_tax_return: "SA302 / tax return (self-employed)",
  mortgage_offer: "Mortgage offer document",
  other: "Other document",
};

export const REQUIRED_DOCUMENT_TYPES = [
  "id_proof",
  "proof_of_address",
  "payslips",
  "bank_statements",
] as const;
