import { createFileRoute } from "@tanstack/react-router";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Clock, Lock } from "lucide-react";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Document Portal — Secure Upload · Vantage & Co." },
      { name: "description", content: "Bank-grade encrypted document upload with OCR, automatic categorisation, and progress tracking." },
    ],
  }),
  component: DocumentsPage,
});

function DocumentsPage() {
  return (
    <section className="py-16">
      <div className="container-page">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="eyebrow mb-3 text-brand">Application MTG-9921</div>
              <h1 className="text-4xl font-semibold mb-3">Document Portal</h1>
              <p className="text-muted-foreground">Upload the outstanding documents below. Files are encrypted at rest and shared only with your assigned advisor.</p>
            </div>

            {/* Uploader */}
            <div className="p-10 border-2 border-dashed border-border rounded-3xl bg-card text-center hover:border-brand transition-colors">
              <div className="size-14 rounded-full bg-brand-soft text-brand grid place-items-center mx-auto mb-4">
                <UploadCloud className="size-6" />
              </div>
              <h3 className="font-semibold text-lg mb-1">Drop files here or click to upload</h3>
              <p className="text-sm text-muted-foreground mb-4">PDF, JPG, PNG or HEIC · Max 20MB per file</p>
              <button className="btn-primary mx-auto">Select files</button>
            </div>

            {/* File list */}
            <div className="bg-card rounded-2xl ring-1 ring-border overflow-hidden">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-sm">All documents</h3>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">8 files · 4 pending</span>
              </div>
              <ul className="divide-y divide-border">
                {FILES.map((f) => (
                  <li key={f.name} className="p-5 flex items-center gap-4">
                    <div className="size-10 bg-secondary rounded-lg grid place-items-center text-[10px] font-bold uppercase text-muted-foreground">
                      {f.type}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{f.name}</div>
                      <div className="text-xs text-muted-foreground">{f.meta}</div>
                    </div>
                    <StatusPill status={f.status} />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="p-6 bg-brand text-primary-foreground rounded-2xl">
              <div className="text-[11px] uppercase tracking-widest opacity-70 mb-2">Application progress</div>
              <div className="text-3xl font-semibold font-display mb-4">62%</div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-brand-accent w-[62%]" />
              </div>
              <div className="mt-4 text-xs opacity-80">Next milestone: Valuation booked</div>
            </div>

            <div className="p-6 bg-card rounded-2xl ring-1 ring-border">
              <h4 className="text-sm font-semibold mb-4">Still required</h4>
              <ul className="space-y-3 text-sm">
                {["3-month bank statements", "P60 tax document", "Utility bill (proof of address)", "Deposit source declaration"].map((t) => (
                  <li key={t} className="flex gap-2 text-muted-foreground">
                    <Clock className="size-4 text-brand-accent shrink-0 mt-0.5" /> {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-secondary/60 rounded-2xl flex gap-3">
              <Lock className="size-5 text-brand shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground leading-relaxed">
                All uploads are AES-256 encrypted, ISO 27001 stored, and GDPR compliant. Only your named advisor can access these files.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: "verified" | "review" | "pending" | "processing" }) {
  const map = {
    verified: { icon: <CheckCircle2 className="size-3" />, label: "Verified", cls: "bg-emerald-100 text-emerald-700" },
    review: { icon: <AlertCircle className="size-3" />, label: "Review required", cls: "bg-amber-100 text-amber-700" },
    pending: { icon: <Clock className="size-3" />, label: "Pending", cls: "bg-secondary text-muted-foreground" },
    processing: { icon: <FileText className="size-3" />, label: "OCR processing", cls: "bg-brand-soft text-brand" },
  } as const;
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${s.cls}`}>
      {s.icon} {s.label}
    </span>
  );
}

const FILES = [
  { name: "Payslips_Q3_2026.pdf", type: "PDF", meta: "2.4 MB · Uploaded 2 days ago", status: "verified" as const },
  { name: "Passport_Scan.jpg", type: "JPG", meta: "3.1 MB · Uploaded 3 days ago", status: "verified" as const },
  { name: "Bank_Statement_September.pdf", type: "PDF", meta: "1.8 MB · Uploaded today", status: "processing" as const },
  { name: "P60_2025-2026.pdf", type: "PDF", meta: "890 KB · Uploaded today", status: "review" as const },
  { name: "Utility_Bill.pdf", type: "PDF", meta: "Not yet uploaded", status: "pending" as const },
  { name: "Deposit_Source_Declaration.docx", type: "DOC", meta: "Not yet uploaded", status: "pending" as const },
];
