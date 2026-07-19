// Hand-written types matching supabase/migrations/0001_init.sql.
// If the schema changes, update this file to match.

export type UserRole = "client" | "admin";
export type DocumentType =
  | "id_proof"
  | "proof_of_address"
  | "payslips"
  | "bank_statements"
  | "credit_report"
  | "sa302_tax_return"
  | "mortgage_offer"
  | "other";
export type DocumentStatus = "pending" | "verified" | "rejected";
export type RequestType = "document" | "information";
export type RequestStatus = "open" | "fulfilled";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  created_at: string;
}

export interface AppSettingRow {
  key: string;
  value: string;
  updated_at: string;
  updated_by: string | null;
}

export interface ReferralRow {
  id: string;
  client_name: string;
  client_phone: string | null;
  client_email: string | null;
  referrer_name: string;
  referrer_phone: string | null;
  created_at: string;
}

export interface PublicApplicationRow {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  mortgage_type: string | null;
  details: unknown;
  created_at: string;
}

export interface CaseRow {
  id: string;
  case_number: string;
  client_id: string;
  assigned_admin_id: string | null;
  current_stage: number;
  created_at: string;
  updated_at: string;
}

export interface CaseStageHistoryRow {
  id: string;
  case_id: string;
  from_stage: number | null;
  to_stage: number;
  moved_by: string;
  note: string;
  created_at: string;
}

export interface InformationFormResponse {
  case_id: string;
  full_name: string | null;
  date_of_birth: string | null;
  phone: string | null;
  address: string | null;
  employment_status: string | null;
  employer_name: string | null;
  annual_income: number | null;
  has_ccjs: boolean | null;
  has_defaults: boolean | null;
  has_bankruptcy_or_iva: boolean | null;
  credit_notes: string | null;
  property_value: number | null;
  deposit_amount: number | null;
  mortgage_type: string | null;
  purchase_timeline: string | null;
  // Full Fast Track questionnaire payload; shape defined in lib/information-form.ts.
  details: import("./information-form").InformationFormDetails | null;
  submitted_at: string | null;
  updated_at: string;
}

export interface DocumentRow {
  id: string;
  case_id: string;
  uploaded_by: string;
  document_type: DocumentType;
  file_path: string;
  status: DocumentStatus;
  reviewer_note: string | null;
  request_id: string | null;
  created_at: string;
  reviewed_at: string | null;
}

export interface CaseRequestRow {
  id: string;
  case_id: string;
  requested_by: string;
  type: RequestType;
  description: string;
  status: RequestStatus;
  created_at: string;
  fulfilled_at: string | null;
}

export interface NotificationRow {
  id: string;
  case_id: string;
  recipient_id: string;
  message: string;
  read: boolean;
  created_at: string;
}
