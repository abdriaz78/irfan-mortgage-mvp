import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { CASE_STAGES, getStage } from "@/lib/case-stages";
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
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<number | "all">("all");

  useEffect(() => {
    (async () => {
      const { data: caseRows } = await supabase
        .from("cases")
        .select("*")
        .order("updated_at", { ascending: false });

      const rows = caseRows ?? [];
      setCases(rows);

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

  return (
    <section className="py-12">
      <div className="container-page">
        <div className="mb-8">
          <div className="eyebrow mb-3 text-brand">Admin</div>
          <h1 className="text-3xl font-semibold mb-2">Case Pipeline</h1>
          <p className="text-muted-foreground text-sm">{cases.length} total cases</p>
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
