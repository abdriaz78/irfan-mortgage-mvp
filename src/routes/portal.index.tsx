import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  FileText,
  ClipboardList,
  ChevronRight,
  CheckCircle2,
  PartyPopper,
} from "lucide-react";
import confetti from "canvas-confetti";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { useMyCase } from "@/hooks/use-my-case";
import { CASE_STAGES, TOTAL_STAGES, getStage } from "@/lib/case-stages";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { NotificationRow, CaseRequestRow } from "@/lib/database.types";

export const Route = createFileRoute("/portal/")({
  head: () => ({ meta: [{ title: "Your Case · Fast Track Mortgages" }] }),
  component: PortalPage,
});

function PortalPage() {
  const { profile } = useAuth();
  const { case: myCase, loading: caseLoading } = useMyCase();
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [openRequests, setOpenRequests] = useState<CaseRequestRow[]>([]);
  const [loadingExtras, setLoadingExtras] = useState(true);

  useEffect(() => {
    if (caseLoading) return;
    if (!myCase) {
      setLoadingExtras(false);
      return;
    }
    (async () => {
      const [{ data: notifs }, { data: requests }] = await Promise.all([
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
      ]);
      setNotifications(notifs ?? []);
      setOpenRequests(requests ?? []);
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

  const currentStage = getStage(myCase.current_stage);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const progressPct = Math.round((myCase.current_stage / TOTAL_STAGES) * 100);
  const isComplete = myCase.current_stage === TOTAL_STAGES;

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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Case progress */}
          <div className="lg:col-span-2 bg-card p-8 rounded-2xl ring-1 ring-border">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                  Case {myCase.case_number}
                </div>
                <h2 className="text-lg font-semibold">{currentStage.title}</h2>
              </div>
              <Badge variant="secondary">{progressPct}% complete</Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-6">{currentStage.clientDescription}</p>

            <div className="mb-6">
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-y-3 gap-x-2 text-[10px] uppercase font-semibold tracking-widest">
                {CASE_STAGES.map((s) => (
                  <div
                    key={s.key}
                    className={
                      s.number < myCase.current_stage
                        ? "text-brand flex items-center gap-1"
                        : s.number === myCase.current_stage
                          ? "text-brand-accent flex items-center gap-1"
                          : "text-muted-foreground flex items-center gap-1"
                    }
                  >
                    {s.number < myCase.current_stage && <CheckCircle2 className="size-3" />}
                    {s.number}. {s.title}
                  </div>
                ))}
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
          <div className="bg-ink text-primary-foreground p-8 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-lg bg-white/10 text-brand-accent grid place-items-center">
                <ClipboardList className="size-5" />
              </div>
              <h2 className="text-lg font-semibold">Action needed</h2>
            </div>
            {openRequests.length === 0 ? (
              <p className="text-sm text-zinc-400">Nothing outstanding right now.</p>
            ) : (
              <ul className="space-y-4">
                {openRequests.map((r) => (
                  <li
                    key={r.id}
                    className="pb-4 border-b border-white/10 last:border-b-0 last:pb-0"
                  >
                    <div className="text-sm font-semibold capitalize">{r.type} request</div>
                    <div className="text-xs text-zinc-400 mt-1">{r.description}</div>
                  </li>
                ))}
              </ul>
            )}
            <Link
              to="/portal/documents"
              className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-brand-accent"
            >
              Upload documents <ChevronRight className="size-3" />
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
