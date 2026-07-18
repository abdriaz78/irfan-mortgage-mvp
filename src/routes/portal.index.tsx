import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  FileText,
  ClipboardList,
  ChevronRight,
  CheckCircle2,
  Clock,
  UploadCloud,
  AlertCircle,
  PartyPopper,
  Star,
  Gift,
} from "lucide-react";
import confetti from "canvas-confetti";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { useMyCase } from "@/hooks/use-my-case";
import { CASE_STAGES, TOTAL_STAGES, getStage, REQUIRED_DOCUMENT_TYPES } from "@/lib/case-stages";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { NotificationRow, CaseRequestRow, DocumentRow } from "@/lib/database.types";
import { REVIEW_MESSAGE_KEY, DEFAULT_REVIEW_MESSAGE, GOOGLE_REVIEW_URL } from "@/lib/settings";

// Stages the client is responsible for; when they submit their part these
// enter a "pending advisor approval" state until the admin advances the case.
const INFORMATION_FORM_STAGE = 2;
const DOCUMENT_UPLOAD_STAGE = 3;

type DocSummary = Pick<DocumentRow, "document_type" | "status">;

export const Route = createFileRoute("/portal/")({
  head: () => ({ meta: [{ title: "Your Case · Fasttrack Mortgages" }] }),
  component: PortalPage,
});

function PortalPage() {
  const { profile } = useAuth();
  const { case: myCase, loading: caseLoading } = useMyCase();
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [openRequests, setOpenRequests] = useState<CaseRequestRow[]>([]);
  const [infoSubmittedAt, setInfoSubmittedAt] = useState<string | null>(null);
  const [documents, setDocuments] = useState<DocSummary[]>([]);
  const [reviewMessage, setReviewMessage] = useState(DEFAULT_REVIEW_MESSAGE);
  const [loadingExtras, setLoadingExtras] = useState(true);

  useEffect(() => {
    if (caseLoading) return;
    if (!myCase) {
      setLoadingExtras(false);
      return;
    }
    (async () => {
      const [
        { data: notifs },
        { data: requests },
        { data: form },
        { data: docs },
        { data: reviewSetting },
      ] = await Promise.all([
        supabase
          .from("notifications")
          .select("*")
          .eq("case_id", myCase.id)
          .order("created_at", { ascending: false })
          .limit(20),
        supabase
          .from("case_requests")
          .select("*")
          .eq("case_id", myCase.id)
          .eq("status", "open")
          .order("created_at", { ascending: false }),
        supabase
          .from("information_form_responses")
          .select("submitted_at")
          .eq("case_id", myCase.id)
          .maybeSingle(),
        supabase.from("documents").select("document_type, status").eq("case_id", myCase.id),
        supabase.from("app_settings").select("value").eq("key", REVIEW_MESSAGE_KEY).maybeSingle(),
      ]);
      setNotifications(notifs ?? []);
      setOpenRequests(requests ?? []);
      setInfoSubmittedAt(form?.submitted_at ?? null);
      setDocuments(docs ?? []);
      setReviewMessage(reviewSetting?.value ?? DEFAULT_REVIEW_MESSAGE);
      setLoadingExtras(false);
    })();
  }, [caseLoading, myCase?.id]);

  async function markAllRead() {
    if (!myCase) return;
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length === 0) return;
    await supabase.from("notifications").update({ read: true }).in("id", unreadIds);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  if (caseLoading || loadingExtras) {
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

  const stageNo = myCase.current_stage;
  const currentStage = getStage(stageNo);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const progressPct = Math.round((stageNo / TOTAL_STAGES) * 100);
  const isComplete = stageNo === TOTAL_STAGES;

  // Document tallies (only the required set counts toward "complete").
  const uploadedRequired = REQUIRED_DOCUMENT_TYPES.filter((t) =>
    documents.some((d) => d.document_type === t),
  ).length;
  const verifiedRequired = REQUIRED_DOCUMENT_TYPES.filter((t) =>
    documents.some((d) => d.document_type === t && d.status === "verified"),
  ).length;
  const awaitingApproval = documents.filter((d) => d.status === "pending").length;
  const rejectedCount = documents.filter((d) => d.status === "rejected").length;
  const noDocsUploaded = documents.length === 0;
  const allRequiredUploaded = uploadedRequired === REQUIRED_DOCUMENT_TYPES.length;

  // A client-owned step is "pending" once they've submitted their part but the
  // advisor hasn't approved it yet — i.e. the case hasn't advanced past that
  // step. This is independent of the exact current stage, because a client can
  // complete their form/uploads while the case is still at an earlier stage.
  const infoStepPending = !!infoSubmittedAt && stageNo <= INFORMATION_FORM_STAGE;
  const documentsStepPending =
    allRequiredUploaded && verifiedRequired < uploadedRequired && stageNo <= DOCUMENT_UPLOAD_STAGE;
  const pendingStepLabel = documentsStepPending
    ? "Document Upload"
    : infoStepPending
      ? "Information Form"
      : null;

  type StageVisual = "done" | "pending" | "active" | "upcoming";
  const stageVisual = (n: number): StageVisual => {
    if (n < stageNo) return "done";
    if (n === INFORMATION_FORM_STAGE && infoStepPending) return "pending";
    if (n === DOCUMENT_UPLOAD_STAGE && documentsStepPending) return "pending";
    if (n === stageNo) return "active";
    return "upcoming";
  };

  return (
    <section className="py-12">
      <div className="container-page">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Welcome back,</div>
            <h1 className="text-2xl font-semibold">{profile?.full_name || profile?.email}</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={markAllRead}>
              <Bell className="size-4" /> {unreadCount} new update{unreadCount === 1 ? "" : "s"}
            </Button>
            <Link to="/portal/documents" className="btn-primary">
              <FileText className="size-4" /> My documents
            </Link>
          </div>
        </div>

        {isComplete && <CelebrationBanner caseNumber={myCase.case_number} />}
        {isComplete && <ReviewRequestCard message={reviewMessage} />}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Case progress */}
          <div className="lg:col-span-2 bg-card p-8 rounded-2xl ring-1 ring-border">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                  Case {myCase.case_number}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-semibold">{currentStage.title}</h2>
                  {pendingStepLabel && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-700 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider">
                      <Clock className="size-3 motion-safe:animate-pulse" /> {pendingStepLabel} ·
                      awaiting approval
                    </span>
                  )}
                </div>
              </div>
              <Badge variant="secondary">{progressPct}% complete</Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              {pendingStepLabel
                ? `You've submitted your ${pendingStepLabel}. Your advisor will review it and approve the next step shortly.`
                : currentStage.clientDescription}
            </p>

            <div className="mb-6">
              <div className="flex gap-1 mb-1.5">
                {CASE_STAGES.map((s) => {
                  const v = stageVisual(s.number);
                  const num =
                    v === "done"
                      ? "text-emerald-600"
                      : v === "pending"
                        ? "text-amber-600"
                        : v === "active"
                          ? "text-brand"
                          : "text-muted-foreground/50";
                  return (
                    <div
                      key={s.key}
                      className={`flex-1 text-center text-[11px] font-semibold tabular-nums ${num}`}
                    >
                      {s.number}
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-1 h-2">
                {CASE_STAGES.map((s) => {
                  const v = stageVisual(s.number);
                  const bar =
                    v === "done"
                      ? "bg-emerald-500"
                      : v === "pending"
                        ? "bg-amber-400 motion-safe:animate-pulse"
                        : v === "active"
                          ? "bg-brand"
                          : "bg-secondary";
                  return (
                    <div key={s.key} className={`flex-1 rounded-full transition-all ${bar}`} />
                  );
                })}
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-y-3 gap-x-2 text-[10px] uppercase font-semibold tracking-widest">
                {CASE_STAGES.map((s) => {
                  const v = stageVisual(s.number);
                  const cls =
                    v === "done"
                      ? "text-emerald-600"
                      : v === "pending"
                        ? "text-amber-600"
                        : v === "active"
                          ? "text-brand-accent"
                          : "text-muted-foreground";
                  return (
                    <div key={s.key} className={`flex items-center gap-1 ${cls}`}>
                      {v === "done" && <CheckCircle2 className="size-3" />}
                      {v === "pending" && <Clock className="size-3 motion-safe:animate-pulse" />}
                      {s.number}. {s.title}
                    </div>
                  );
                })}
              </div>
            </div>

            <Link
              to="/portal/information-form"
              className="text-xs font-semibold text-brand shrink-0 inline-flex items-center gap-1"
            >
              <ClipboardList className="size-3.5" /> View / edit your Information Form{" "}
              <ChevronRight className="size-3" />
            </Link>
          </div>

          {/* Requests / to-dos */}
          <div className="bg-ink text-primary-foreground p-8 rounded-2xl flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-lg bg-white/10 text-brand-accent grid place-items-center">
                <ClipboardList className="size-5" />
              </div>
              <h2 className="text-lg font-semibold">Action needed</h2>
            </div>

            <div className="space-y-4 flex-1">
              {/* Incomplete information form */}
              {!infoSubmittedAt && (
                <Link
                  to="/portal/information-form"
                  className="block pb-4 border-b border-white/10 group"
                >
                  <div className="text-sm font-semibold flex items-center gap-2">
                    <ClipboardList className="size-4 text-brand-accent" /> Complete your Information
                    Form
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    We need this before we can assess your application.
                  </div>
                </Link>
              )}

              {/* Advisor / lender requests */}
              {openRequests.map((r) => (
                <div key={r.id} className="pb-4 border-b border-white/10">
                  <div className="text-sm font-semibold capitalize flex items-center gap-2">
                    <AlertCircle className="size-4 text-amber-300" /> {r.type} request
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">{r.description}</div>
                </div>
              ))}

              {/* Documents */}
              {noDocsUploaded ? (
                <Link
                  to="/portal/documents"
                  className="block rounded-xl bg-white/5 ring-1 ring-white/10 p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-full bg-brand-accent/15 text-brand-accent shrink-0">
                      <UploadCloud className="size-5 motion-safe:animate-bounce" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold">Upload your documents</div>
                      <div className="text-xs text-zinc-400 mt-0.5">
                        You haven't uploaded any documents yet — tap to get started.
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                    <span className="uppercase tracking-widest">Documents</span>
                    <span>
                      {uploadedRequired}/{REQUIRED_DOCUMENT_TYPES.length} uploaded
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-accent transition-all"
                      style={{
                        width: `${(uploadedRequired / REQUIRED_DOCUMENT_TYPES.length) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[11px] font-medium">
                    {awaitingApproval > 0 && (
                      <span className="inline-flex items-center gap-1 text-amber-300">
                        <Clock className="size-3" /> {awaitingApproval} awaiting approval
                      </span>
                    )}
                    {verifiedRequired > 0 && (
                      <span className="inline-flex items-center gap-1 text-emerald-300">
                        <CheckCircle2 className="size-3" /> {verifiedRequired} verified
                      </span>
                    )}
                    {rejectedCount > 0 && (
                      <span className="inline-flex items-center gap-1 text-red-300">
                        <AlertCircle className="size-3" /> {rejectedCount} need re-upload
                      </span>
                    )}
                  </div>
                  {!allRequiredUploaded && (
                    <div className="text-xs text-zinc-400 mt-2">
                      {REQUIRED_DOCUMENT_TYPES.length - uploadedRequired} more required document
                      {REQUIRED_DOCUMENT_TYPES.length - uploadedRequired === 1 ? "" : "s"} to
                      upload.
                    </div>
                  )}
                </div>
              )}

              {/* All clear */}
              {infoSubmittedAt && openRequests.length === 0 && allRequiredUploaded && (
                <p className="text-sm text-zinc-400">
                  {awaitingApproval > 0
                    ? "You're all caught up — your advisor is reviewing your submissions."
                    : "Nothing outstanding right now."}
                </p>
              )}
            </div>

            <Link
              to="/portal/documents"
              className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-brand-accent"
            >
              {noDocsUploaded ? "Go to documents" : "Manage documents"}{" "}
              <ChevronRight className="size-3" />
            </Link>
          </div>

          {/* Notifications */}
          <div className="lg:col-span-3 bg-card p-8 rounded-2xl ring-1 ring-border">
            <h2 className="text-lg font-semibold mb-6">Recent updates</h2>
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No updates yet.</p>
            ) : (
              <ul className="space-y-3">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`p-4 rounded-xl flex items-start justify-between gap-4 ${
                      n.read ? "bg-secondary/40" : "bg-brand-soft/60"
                    }`}
                  >
                    <span className="text-sm">{n.message}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {new Date(n.created_at).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewRequestCard({ message }: { message: string }) {
  return (
    <div className="mb-8 p-8 rounded-2xl bg-card ring-1 ring-border">
      <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft text-brand px-3 py-1 text-[11px] font-semibold uppercase tracking-widest mb-4">
            <Gift className="size-3.5" /> Thank-you offer
          </div>
          <h2 className="text-2xl font-semibold mb-3">Enjoyed working with us? Spread the word.</h2>
          <div className="flex gap-0.5 text-brand-accent mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-5 fill-current" />
            ))}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-[54ch] whitespace-pre-line">
            {message}
          </p>
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <Star className="size-4" /> Leave a Google review
          </a>
        </div>
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="rounded-xl bg-white p-3 ring-1 ring-border">
            <img
              src="/images/review-qr.png"
              alt="Scan to review Fasttrack Mortgages on Google"
              width={160}
              height={160}
              className="size-40"
            />
          </div>
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Scan to review us
          </span>
        </div>
      </div>
    </div>
  );
}

function CelebrationBanner({ caseNumber }: { caseNumber: string }) {
  useEffect(() => {
    const colors = ["#0f4d3f", "#d4a94a", "#ffffff"];
    const duration = 2500;
    const end = Date.now() + duration;

    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  return (
    <div className="mb-8 p-8 rounded-2xl bg-gradient-to-r from-brand to-brand/80 text-primary-foreground flex items-center gap-4 flex-wrap">
      <div className="size-14 rounded-full bg-white/15 grid place-items-center shrink-0">
        <PartyPopper className="size-7" />
      </div>
      <div>
        <h2 className="text-2xl font-semibold font-display mb-1">Congratulations!</h2>
        <p className="text-sm opacity-90">
          Case {caseNumber} is complete — your mortgage journey is done. Thank you for trusting us
          with it.
        </p>
      </div>
    </div>
  );
}
