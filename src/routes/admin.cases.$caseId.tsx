import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ChevronLeft, CheckCircle2, XCircle, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { CASE_STAGES, DOCUMENT_TYPE_LABELS, getStage } from "@/lib/case-stages";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  CaseRow,
  Profile,
  InformationFormResponse,
  DocumentRow,
  CaseRequestRow,
  CaseStageHistoryRow,
  RequestType,
} from "@/lib/database.types";

export const Route = createFileRoute("/admin/cases/$caseId")({
  head: () => ({ meta: [{ title: "Case detail · Admin" }] }),
  component: CaseDetailPage,
});

function CaseDetailPage() {
  const { caseId } = Route.useParams();
  const [caseRow, setCaseRow] = useState<CaseRow | null>(null);
  const [client, setClient] = useState<Profile | null>(null);
  const [infoForm, setInfoForm] = useState<InformationFormResponse | null>(null);
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [requests, setRequests] = useState<CaseRequestRow[]>([]);
  const [history, setHistory] = useState<CaseStageHistoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    const { data: c } = await supabase.from("cases").select("*").eq("id", caseId).single();
    setCaseRow(c ?? null);

    if (c) {
      const [{ data: clientRow }, { data: form }, { data: docs }, { data: reqs }, { data: hist }] =
        await Promise.all([
          supabase.from("profiles").select("*").eq("id", c.client_id).single(),
          supabase.from("information_form_responses").select("*").eq("case_id", c.id).maybeSingle(),
          supabase
            .from("documents")
            .select("*")
            .eq("case_id", c.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("case_requests")
            .select("*")
            .eq("case_id", c.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("case_stage_history")
            .select("*")
            .eq("case_id", c.id)
            .order("created_at", { ascending: false }),
        ]);
      setClient(clientRow ?? null);
      setInfoForm(form ?? null);
      setDocuments(docs ?? []);
      setRequests(reqs ?? []);
      setHistory(hist ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, [caseId]);

  if (loading || !caseRow) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  const currentStage = getStage(caseRow.current_stage);

  return (
    <section className="py-12">
      <div className="container-page max-w-5xl space-y-8">
        <div>
          <Link
            to="/admin"
            className="text-sm text-muted-foreground inline-flex items-center gap-1 mb-4"
          >
            <ChevronLeft className="size-3.5" /> All cases
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="eyebrow mb-2 text-brand">Case {caseRow.case_number}</div>
              <h1 className="text-2xl font-semibold">{client?.full_name}</h1>
              <p className="text-sm text-muted-foreground">
                {client?.email} · {client?.phone}
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {currentStage.number}. {currentStage.title}
            </Badge>
          </div>
        </div>

        <StageMover caseRow={caseRow} onMoved={loadAll} />

        <InformationFormSummary infoForm={infoForm} />

        <DocumentsReview documents={documents} requests={requests} onReviewed={loadAll} />

        <CaseRequests caseId={caseRow.id} requests={requests} onCreated={loadAll} />

        <StageHistory history={history} />
      </div>
    </section>
  );
}

function StageMover({ caseRow, onMoved }: { caseRow: CaseRow; onMoved: () => void }) {
  const [targetStage, setTargetStage] = useState(String(caseRow.current_stage));
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleMove() {
    if (!note.trim()) {
      toast.error("Add a note explaining this stage change.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.rpc("move_case_stage", {
      p_case_id: caseRow.id,
      p_new_stage: Number(targetStage),
      p_note: note.trim(),
    });
    setSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Case stage updated — client notified.");
    setNote("");
    onMoved();
  }

  return (
    <div className="bg-card p-6 rounded-2xl ring-1 ring-border">
      <h2 className="text-lg font-semibold mb-4">Move case stage</h2>
      <div className="grid sm:grid-cols-[220px_1fr_auto] gap-4 items-end">
        <div className="space-y-2">
          <Label>New stage</Label>
          <Select value={targetStage} onValueChange={setTargetStage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CASE_STAGES.map((s) => (
                <SelectItem key={s.number} value={String(s.number)}>
                  {s.number}. {s.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Note (required, visible to client as an update)</Label>
          <Textarea rows={1} value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        <Button onClick={handleMove} disabled={submitting}>
          {submitting ? "Moving…" : "Move stage"}
        </Button>
      </div>
    </div>
  );
}

function InformationFormSummary({ infoForm }: { infoForm: InformationFormResponse | null }) {
  if (!infoForm) {
    return (
      <div className="bg-card p-6 rounded-2xl ring-1 ring-border">
        <h2 className="text-lg font-semibold mb-2">Information form</h2>
        <p className="text-sm text-muted-foreground">The client hasn't submitted this yet.</p>
      </div>
    );
  }

  const rows: [string, string][] = [
    ["Full name", infoForm.full_name ?? "—"],
    ["Date of birth", infoForm.date_of_birth ?? "—"],
    ["Phone", infoForm.phone ?? "—"],
    ["Address", infoForm.address ?? "—"],
    ["Employment status", infoForm.employment_status ?? "—"],
    ["Employer", infoForm.employer_name ?? "—"],
    ["Annual income", infoForm.annual_income ? `£${infoForm.annual_income}` : "—"],
    ["CCJs", infoForm.has_ccjs ? "Yes" : "No"],
    ["Defaults", infoForm.has_defaults ? "Yes" : "No"],
    ["Bankruptcy/IVA", infoForm.has_bankruptcy_or_iva ? "Yes" : "No"],
    ["Credit notes", infoForm.credit_notes ?? "—"],
    ["Property value", infoForm.property_value ? `£${infoForm.property_value}` : "—"],
    ["Deposit", infoForm.deposit_amount ? `£${infoForm.deposit_amount}` : "—"],
    ["Mortgage type", infoForm.mortgage_type ?? "—"],
    ["Timeline", infoForm.purchase_timeline ?? "—"],
  ];

  return (
    <div className="bg-card p-6 rounded-2xl ring-1 ring-border">
      <h2 className="text-lg font-semibold mb-4">Information form</h2>
      <dl className="grid sm:grid-cols-2 gap-x-8 divide-y divide-border sm:divide-y-0">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex justify-between py-2 gap-4 text-sm border-b border-border sm:border-none"
          >
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-medium text-right">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function DocumentsReview({
  documents,
  requests,
  onReviewed,
}: {
  documents: DocumentRow[];
  requests: CaseRequestRow[];
  onReviewed: () => void;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const requestById = new Map(requests.map((r) => [r.id, r]));

  async function review(doc: DocumentRow, status: "verified" | "rejected") {
    setBusyId(doc.id);
    const { error } = await supabase.rpc("review_document", {
      p_document_id: doc.id,
      p_status: status,
      p_note: notes[doc.id]?.trim() ?? "",
    });
    setBusyId(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Document ${status}.`);
    onReviewed();
  }

  async function viewFile(doc: DocumentRow) {
    const { data, error } = await supabase.storage
      .from("case-documents")
      .createSignedUrl(doc.file_path, 60);
    if (error || !data) {
      toast.error(error?.message ?? "Unable to open file");
      return;
    }
    window.open(data.signedUrl, "_blank");
  }

  return (
    <div className="bg-card p-6 rounded-2xl ring-1 ring-border">
      <h2 className="text-lg font-semibold mb-4">Documents</h2>
      {documents.length === 0 ? (
        <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
      ) : (
        <ul className="space-y-4">
          {documents.map((d) => (
            <li key={d.id} className="p-4 rounded-xl bg-secondary/40 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="text-sm font-medium">{DOCUMENT_TYPE_LABELS[d.document_type]}</div>
                  <div className="text-xs text-muted-foreground">
                    Uploaded {new Date(d.created_at).toLocaleDateString()}
                  </div>
                  {d.request_id && requestById.get(d.request_id) && (
                    <div className="text-xs text-brand mt-0.5">
                      For request: {requestById.get(d.request_id)?.description}
                    </div>
                  )}
                </div>
                <DocStatusBadge status={d.status} />
              </div>
              <button onClick={() => viewFile(d)} className="text-xs font-semibold text-brand">
                View file
              </button>
              {d.status === "pending" && (
                <div className="flex items-end gap-2 flex-wrap">
                  <div className="flex-1 min-w-[200px] space-y-1">
                    <Label className="text-xs">Reviewer note (optional)</Label>
                    <Textarea
                      rows={1}
                      value={notes[d.id] ?? ""}
                      onChange={(e) => setNotes((prev) => ({ ...prev, [d.id]: e.target.value }))}
                    />
                  </div>
                  <Button
                    size="sm"
                    disabled={busyId === d.id}
                    onClick={() => review(d, "verified")}
                  >
                    <CheckCircle2 className="size-3.5" /> Verify
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={busyId === d.id}
                    onClick={() => review(d, "rejected")}
                  >
                    <XCircle className="size-3.5" /> Reject
                  </Button>
                </div>
              )}
              {d.reviewer_note && (
                <p className="text-xs text-muted-foreground">Note: {d.reviewer_note}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DocStatusBadge({ status }: { status: DocumentRow["status"] }) {
  const map = {
    verified: { label: "Verified", cls: "bg-emerald-100 text-emerald-700" },
    rejected: { label: "Rejected", cls: "bg-red-100 text-red-700" },
    pending: { label: "Pending", cls: "bg-secondary text-muted-foreground" },
  } as const;
  const s = map[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${s.cls}`}
    >
      {s.label}
    </span>
  );
}

function CaseRequests({
  caseId,
  requests,
  onCreated,
}: {
  caseId: string;
  requests: CaseRequestRow[];
  onCreated: () => void;
}) {
  const [type, setType] = useState<RequestType>("document");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fulfillingId, setFulfillingId] = useState<string | null>(null);

  async function markFulfilled(requestId: string) {
    setFulfillingId(requestId);
    const { error } = await supabase
      .from("case_requests")
      .update({ status: "fulfilled", fulfilled_at: new Date().toISOString() })
      .eq("id", requestId);
    setFulfillingId(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Request marked fulfilled.");
    onCreated();
  }

  async function create() {
    if (!description.trim()) {
      toast.error("Describe what you need from the client.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.rpc("create_case_request", {
      p_case_id: caseId,
      p_type: type,
      p_description: description.trim(),
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Request sent to client.");
    setDescription("");
    onCreated();
  }

  return (
    <div className="bg-card p-6 rounded-2xl ring-1 ring-border">
      <h2 className="text-lg font-semibold mb-4">Requests to client</h2>
      <p className="text-xs text-muted-foreground mb-4">
        Use this when a lender (or you) needs more information or documents mid-pipeline — it
        notifies the client without changing the case stage.
      </p>

      <div className="grid sm:grid-cols-[160px_1fr_auto] gap-4 items-end mb-6">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as RequestType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="information">Information</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea rows={1} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <Button onClick={create} disabled={submitting}>
          {submitting ? "Sending…" : "Send request"}
        </Button>
      </div>

      {requests.length === 0 ? (
        <p className="text-sm text-muted-foreground">No requests yet.</p>
      ) : (
        <ul className="space-y-3">
          {requests.map((r) => (
            <li
              key={r.id}
              className="p-4 rounded-xl bg-secondary/40 flex items-center justify-between gap-4"
            >
              <div>
                <div className="text-sm font-medium capitalize">{r.type} request</div>
                <div className="text-xs text-muted-foreground">{r.description}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={r.status === "open" ? "secondary" : "outline"}>{r.status}</Badge>
                {r.status === "open" && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={fulfillingId === r.id}
                    onClick={() => markFulfilled(r.id)}
                  >
                    Mark fulfilled
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StageHistory({ history }: { history: CaseStageHistoryRow[] }) {
  return (
    <div className="bg-card p-6 rounded-2xl ring-1 ring-border">
      <h2 className="text-lg font-semibold mb-4">Stage history</h2>
      {history.length === 0 ? (
        <p className="text-sm text-muted-foreground">No stage changes yet.</p>
      ) : (
        <ul className="space-y-3">
          {history.map((h) => (
            <li key={h.id} className="flex items-start gap-3 text-sm">
              <Clock className="size-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <div>
                  {h.from_stage
                    ? `Stage ${h.from_stage} → ${h.to_stage}`
                    : `Started at stage ${h.to_stage}`}
                </div>
                <div className="text-xs text-muted-foreground">
                  {h.note} · {new Date(h.created_at).toLocaleString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
