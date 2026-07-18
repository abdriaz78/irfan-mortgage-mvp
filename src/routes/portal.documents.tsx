import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { FileText, CheckCircle2, AlertCircle, Clock, Lock, UploadCloud } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { useMyCase } from "@/hooks/use-my-case";
import { DOCUMENT_TYPE_LABELS, REQUIRED_DOCUMENT_TYPES } from "@/lib/case-stages";
import { Button } from "@/components/ui/button";
import type { CaseRequestRow, DocumentRow, DocumentType } from "@/lib/database.types";

export const Route = createFileRoute("/portal/documents")({
  head: () => ({ meta: [{ title: "Documents · Fasttrack Mortgages" }] }),
  component: DocumentsPage,
});

function DocumentsPage() {
  const { session } = useAuth();
  const { case: myCase, loading: caseLoading } = useMyCase();
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [requests, setRequests] = useState<CaseRequestRow[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [uploadingType, setUploadingType] = useState<string | null>(null);

  async function loadDocuments() {
    if (!myCase) {
      setLoadingDocs(false);
      return;
    }
    const [{ data: docs }, { data: reqs }] = await Promise.all([
      supabase
        .from("documents")
        .select("*")
        .eq("case_id", myCase.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("case_requests")
        .select("*")
        .eq("case_id", myCase.id)
        .eq("type", "document")
        .eq("status", "open")
        .order("created_at", { ascending: false }),
    ]);
    setDocuments(docs ?? []);
    setRequests(reqs ?? []);
    setLoadingDocs(false);
  }

  useEffect(() => {
    if (caseLoading) return;
    loadDocuments();
  }, [caseLoading, myCase?.id]);

  async function uploadFile(documentType: DocumentType, file: File, requestId: string | null) {
    if (!myCase || !session?.user) return;

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const filePath = `${myCase.id}/${documentType}/${Date.now()}_${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("case-documents")
      .upload(filePath, file, {
        upsert: false,
      });

    if (uploadError) {
      toast.error(uploadError.message);
      return false;
    }

    const { error: insertError } = await supabase.from("documents").insert({
      case_id: myCase.id,
      uploaded_by: session.user.id,
      document_type: documentType,
      file_path: filePath,
      status: "pending",
      request_id: requestId,
    });

    if (insertError) {
      toast.error(insertError.message);
      return false;
    }

    return true;
  }

  async function handleUpload(documentType: DocumentType, file: File) {
    setUploadingType(documentType);
    const ok = await uploadFile(documentType, file, null);
    setUploadingType(null);
    if (ok) {
      toast.success("Document uploaded — pending review.");
      loadDocuments();
    }
  }

  async function handleUploadForRequest(requestId: string, file: File) {
    setUploadingType(requestId);
    const ok = await uploadFile("other", file, requestId);
    setUploadingType(null);
    if (ok) {
      toast.success("Document uploaded — pending review.");
      loadDocuments();
    }
  }

  if (caseLoading || loadingDocs) {
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

  const verifiedCount = documents.filter((d) => d.status === "verified").length;
  const pendingRequired = REQUIRED_DOCUMENT_TYPES.filter(
    (type) => !documents.some((d) => d.document_type === type),
  ).length;
  const pendingRequests = requests.filter(
    (r) => !documents.some((d) => d.request_id === r.id),
  ).length;
  const outstanding = pendingRequired + pendingRequests;

  return (
    <section className="py-16">
      <div className="container-page">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="eyebrow mb-3 text-brand">Case {myCase.case_number}</div>
              <h1 className="text-4xl font-semibold mb-3">Document Portal</h1>
              <p className="text-muted-foreground">
                Upload the documents below. Your advisor will review and mark each one as verified.
              </p>
            </div>

            {outstanding > 0 && (
              <div className="flex items-center gap-3 rounded-2xl bg-brand-soft/70 ring-1 ring-brand/20 p-4 text-sm">
                <span className="grid size-9 place-items-center rounded-full bg-brand/10 text-brand shrink-0">
                  <UploadCloud className="size-4 motion-safe:animate-bounce" />
                </span>
                <p className="text-foreground">
                  You have <span className="font-semibold">{outstanding}</span>{" "}
                  {outstanding === 1 ? "document" : "documents"} still to upload. Look for the{" "}
                  <span className="font-semibold text-brand">highlighted rows</span> below — drag a
                  file straight onto a row, or use the Upload button.
                </p>
              </div>
            )}

            {/* Ad-hoc requests from advisor/lender */}
            {requests.length > 0 && (
              <div className="bg-card rounded-2xl ring-1 ring-border overflow-hidden">
                <div className="p-5 border-b border-border">
                  <h3 className="font-semibold text-sm">Requested by your advisor</h3>
                </div>
                <ul className="divide-y divide-border">
                  {requests.map((r) => {
                    const latest = documents.filter((d) => d.request_id === r.id)[0];
                    return (
                      <UploadRow
                        key={r.id}
                        title={r.description}
                        latest={latest}
                        uploading={uploadingType === r.id}
                        onFile={(file) => handleUploadForRequest(r.id, file)}
                      />
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Required checklist */}
            <div className="bg-card rounded-2xl ring-1 ring-border overflow-hidden">
              <div className="p-5 border-b border-border">
                <h3 className="font-semibold text-sm">Required documents</h3>
              </div>
              <ul className="divide-y divide-border">
                {REQUIRED_DOCUMENT_TYPES.map((type) => {
                  const latest = documents.filter((d) => d.document_type === type)[0];
                  return (
                    <UploadRow
                      key={type}
                      title={DOCUMENT_TYPE_LABELS[type]}
                      latest={latest}
                      uploading={uploadingType === type}
                      onFile={(file) => handleUpload(type, file)}
                    />
                  );
                })}
              </ul>
            </div>

            {/* All documents */}
            <div className="bg-card rounded-2xl ring-1 ring-border overflow-hidden">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-sm">All documents</h3>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {documents.length} files · {verifiedCount} verified
                </span>
              </div>
              {documents.length === 0 ? (
                <p className="p-5 text-sm text-muted-foreground">No documents uploaded yet.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {documents.map((d) => (
                    <li key={d.id} className="p-5 flex items-center gap-4">
                      <div className="size-10 bg-secondary rounded-lg grid place-items-center text-[10px] font-bold uppercase text-muted-foreground">
                        {d.document_type.slice(0, 3)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {DOCUMENT_TYPE_LABELS[d.document_type]}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Uploaded {new Date(d.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <StatusPill status={d.status} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="p-6 bg-brand text-primary-foreground rounded-2xl">
              <div className="text-[11px] uppercase tracking-widest opacity-70 mb-2">
                Documents verified
              </div>
              <div className="text-3xl font-semibold font-display mb-4">
                {verifiedCount}/{REQUIRED_DOCUMENT_TYPES.length}
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-accent"
                  style={{
                    width: `${Math.round((verifiedCount / REQUIRED_DOCUMENT_TYPES.length) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-6 bg-secondary/60 rounded-2xl flex gap-3">
              <Lock className="size-5 text-brand shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground leading-relaxed">
                Only you and your assigned advisor can access these files. Accepted formats: PDF or
                image, max 20MB.
              </div>
            </div>

            <Link to="/portal" className="text-sm font-medium text-brand inline-block">
              ← Back to case overview
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}

function UploadRow({
  title,
  latest,
  uploading,
  onFile,
}: {
  title: string;
  latest?: DocumentRow;
  uploading: boolean;
  onFile: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const notUploaded = !latest;

  function pickFile(files: FileList | null | undefined) {
    const file = files?.[0];
    if (file) onFile(file);
  }

  return (
    <li
      onDragOver={(e) => {
        e.preventDefault();
        if (!uploading && !dragging) setDragging(true);
      }}
      onDragLeave={(e) => {
        // Only clear when the pointer actually leaves the row, not its children.
        if (e.currentTarget === e.target) setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (!uploading) pickFile(e.dataTransfer.files);
      }}
      className={`flex items-center gap-4 flex-wrap p-5 transition-colors ${
        dragging
          ? "bg-brand-soft ring-2 ring-inset ring-brand"
          : notUploaded
            ? "bg-brand-soft/25"
            : ""
      }`}
    >
      <div
        className={`size-10 rounded-lg grid place-items-center shrink-0 transition-colors ${
          notUploaded ? "bg-brand/10 text-brand ring-1 ring-brand/30" : "bg-secondary text-brand"
        }`}
      >
        {notUploaded ? (
          <UploadCloud className={`size-4 ${dragging ? "" : "motion-safe:animate-bounce"}`} />
        ) : (
          <FileText className="size-4" />
        )}
      </div>
      <div className="flex-1 min-w-[200px]">
        <div className="text-sm font-medium">{title}</div>
        {latest ? (
          <div className="text-xs text-muted-foreground">
            Uploaded {new Date(latest.created_at).toLocaleDateString()}
            {latest.reviewer_note ? ` — ${latest.reviewer_note}` : ""}
          </div>
        ) : (
          <div className="text-xs font-medium text-brand">
            {dragging ? "Drop your file to upload" : "Drag a file here, or click Upload →"}
          </div>
        )}
      </div>
      {latest && <StatusPill status={latest.status} />}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="application/pdf,image/*"
        onChange={(e) => {
          pickFile(e.target.files);
          e.target.value = "";
        }}
      />
      <Button
        size="sm"
        variant={notUploaded ? "default" : "outline"}
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          "Uploading…"
        ) : latest ? (
          "Re-upload"
        ) : (
          <>
            <UploadCloud className="size-4" /> Upload
          </>
        )}
      </Button>
    </li>
  );
}

function StatusPill({ status }: { status: DocumentRow["status"] }) {
  const map = {
    verified: {
      icon: <CheckCircle2 className="size-3" />,
      label: "Verified",
      cls: "bg-emerald-100 text-emerald-700",
    },
    rejected: {
      icon: <AlertCircle className="size-3" />,
      label: "Rejected",
      cls: "bg-red-100 text-red-700",
    },
    pending: {
      icon: <Clock className="size-3" />,
      label: "Pending review",
      cls: "bg-secondary text-muted-foreground",
    },
  } as const;
  const s = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider shrink-0 ${s.cls}`}
    >
      {s.icon} {s.label}
    </span>
  );
}
