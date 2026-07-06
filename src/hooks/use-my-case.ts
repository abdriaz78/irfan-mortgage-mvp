import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import type { CaseRow } from "@/lib/database.types";

export function useMyCase() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const [caseData, setCaseData] = useState<CaseRow | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) {
      setCaseData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase.from("cases").select("*").eq("client_id", userId).maybeSingle();
    setCaseData((data as CaseRow | null) ?? null);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { case: caseData, loading, refresh };
}
