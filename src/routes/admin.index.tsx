import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Inbox, TrendingUp, Loader, CheckCircle2, FileClock, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { CASE_STAGES, TOTAL_STAGES, getStage } from "@/lib/case-stages";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CaseRow, Profile } from "@/lib/database.types";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin · Case Pipeline" }] }),
  component: AdminCasesPage,
});

function AdminCasesPage() {
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [clients, setClients] = useState<Record<string, Profile>>({});
  const [docsPendingReview, setDocsPendingReview] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<number | "all">("all");

  useEffect(() => {
    (async () => {
      const [{ data: caseRows }, { count: pendingDocs }] = await Promise.all([
        supabase.from("cases").select("*").order("updated_at", { ascending: false }),
        supabase
          .from("documents")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
      ]);

      const rows = caseRows ?? [];
      setCases(rows);
      setDocsPendingReview(pendingDocs ?? 0);

      const clientIds = [...new Set(rows.map((c) => c.client_id))];
      if (clientIds.length > 0) {
        const { data: profileRows } = await supabase
          .from("profiles")
          .select("*")
          .in("id", clientIds);
        const map: Record<string, Profile> = {};
        (profileRows ?? []).forEach((p) => {
          map[p.id] = p;
        });
        setClients(map);
      }
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      const client = clients[c.client_id];
      const matchesStage = stageFilter === "all" || c.current_stage === stageFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        c.case_number.toLowerCase().includes(q) ||
        client?.full_name.toLowerCase().includes(q) ||
        client?.email.toLowerCase().includes(q);
      return matchesStage && matchesSearch;
    });
  }, [cases, clients, search, stageFilter]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  const weekAgo = Date.now() - 7 * 86_400_000;
  const total = cases.length;
  const newThisWeek = cases.filter((c) => new Date(c.created_at).getTime() >= weekAgo).length;
  const completed = cases.filter((c) => c.current_stage === TOTAL_STAGES).length;
  const inProgress = total - completed;
  const unassigned = cases.filter((c) => !c.assigned_admin_id).length;

  const stageCounts = CASE_STAGES.map((s) => ({
    ...s,
    count: cases.filter((c) => c.current_stage === s.number).length,
  }));
  const maxStageCount = Math.max(1, ...stageCounts.map((s) => s.count));

  return (
    <section className="py-12">
      <div className="container-page">
        <div className="mb-8">
          <div className="eyebrow mb-3 text-brand">Admin</div>
          <h1 className="text-3xl font-semibold mb-2">Case Pipeline</h1>
          <p className="text-muted-foreground text-sm">Overview of every case and where it sits.</p>
        </div>

        {/* KPI tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <KpiTile icon={<Inbox className="size-4" />} label="Total inquiries" value={total} />
          <KpiTile
            icon={<TrendingUp className="size-4" />}
            label="New this week"
            value={newThisWeek}
          />
          <KpiTile icon={<Loader className="size-4" />} label="In progress" value={inProgress} />
          <KpiTile
            icon={<CheckCircle2 className="size-4" />}
            label="Completed"
            value={completed}
            accent="emerald"
          />
          <KpiTile
            icon={<FileClock className="size-4" />}
            label="Docs to review"
            value={docsPendingReview}
            accent={docsPendingReview > 0 ? "amber" : undefined}
          />
          <KpiTile
            icon={<UserPlus className="size-4" />}
            label="Unassigned"
            value={unassigned}
            accent={unassigned > 0 ? "amber" : undefined}
          />
        </div>

        {/* Cases by stage */}
        <div className="bg-card rounded-2xl ring-1 ring-border p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Cases by stage</h2>
            {stageFilter !== "all" && (
              <button
                onClick={() => setStageFilter("all")}
                className="text-xs font-medium text-brand"
              >
                Clear filter
              </button>
            )}
          </div>
          <div className="space-y-1.5">
            {stageCounts.map((s) => {
              const selected = stageFilter === s.number;
              return (
                <button
                  key={s.number}
                  onClick={() => setStageFilter(selected ? "all" : s.number)}
                  className={`w-full flex items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-secondary/60 ${
                    selected ? "bg-secondary" : ""
                  }`}
                >
                  <span
                    className={`w-44 shrink-0 text-xs truncate ${
                      selected ? "font-semibold text-brand" : "text-muted-foreground"
                    }`}
                  >
                    {s.number}. {s.title}
                  </span>
                  <span className="flex-1 h-2.5 bg-secondary rounded-full overflow-hidden">
                    <span
                      className={`block h-full rounded-full transition-all ${
                        s.number === TOTAL_STAGES ? "bg-emerald-500" : "bg-brand"
                      }`}
                      style={{ width: `${(s.count / maxStageCount) * 100}%` }}
                    />
                  </span>
                  <span className="w-8 shrink-0 text-right text-sm font-medium tabular-nums">
                    {s.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <Input
            placeholder="Search by case number, name, or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <select
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            value={stageFilter}
            onChange={(e) =>
              setStageFilter(e.target.value === "all" ? "all" : Number(e.target.value))
            }
          >
            <option value="all">All stages</option>
            {CASE_STAGES.map((s) => (
              <option key={s.number} value={s.number}>
                {s.number}. {s.title}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-card rounded-2xl ring-1 ring-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => {
                const client = clients[c.client_id];
                const stage = getStage(c.current_stage);
                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      <Link
                        to="/admin/cases/$caseId"
                        params={{ caseId: c.id }}
                        className="font-medium text-brand"
                      >
                        {c.case_number}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{client?.full_name || "—"}</div>
                      <div className="text-xs text-muted-foreground">{client?.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {stage.number}. {stage.title}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(c.updated_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-sm text-muted-foreground py-10"
                  >
                    No cases match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}

function KpiTile({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent?: "emerald" | "amber";
}) {
  const accentCls =
    accent === "emerald"
      ? "bg-emerald-100 text-emerald-700"
      : accent === "amber"
        ? "bg-amber-100 text-amber-700"
        : "bg-secondary text-brand";
  return (
    <div className="bg-card rounded-2xl ring-1 ring-border p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</span>
        <span className={`grid size-8 place-items-center rounded-lg ${accentCls}`}>{icon}</span>
      </div>
      <div className="text-3xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}
