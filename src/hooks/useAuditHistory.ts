"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { AuditResult } from "@/lib/types";
import {
  loadHistory,
  saveAuditToHistory,
  deleteAuditFromHistory,
} from "@/lib/audit-history";
import { supabase } from "@/lib/supabase";

export function useAuditHistory() {
  const [history, setHistory] = useState<AuditResult[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const syncAttempted = useRef(false);

  useEffect(() => {
    const localHistory = loadHistory();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory(localHistory);
    setHydrated(true);

    // Background sync: check if the cron job marked any of these audits as outdated
    if (localHistory.length > 0 && !syncAttempted.current) {
      syncAttempted.current = true;
      const ids = localHistory.map((a) => a.id);
      
      supabase
        .from("audits")
        .select("id, pricing_outdated")
        .in("id", ids)
        .then(({ data, error }) => {
          if (!error && data) {
            let changed = false;
            const updatedHistory = localHistory.map((audit) => {
              const dbRow = data.find((d) => d.id === audit.id);
              if (dbRow && dbRow.pricing_outdated !== audit.pricingOutdated) {
                changed = true;
                return { ...audit, pricingOutdated: dbRow.pricing_outdated };
              }
              return audit;
            });

            if (changed) {
              setHistory(updatedHistory);
              try {
                localStorage.setItem("stackaudit_history_v1", JSON.stringify(updatedHistory));
              } catch { /* ignore */ }
            }
          }
        });
    }
  }, []);

  const saveAudit = useCallback((result: AuditResult) => {
    saveAuditToHistory(result);
    setHistory(loadHistory());
  }, []);

  const deleteAudit = useCallback((id: string) => {
    // Optimistically update local storage
    const updated = deleteAuditFromHistory(id);
    setHistory(updated);
    
    // Also delete from Supabase database
    fetch(`/api/audits?id=${id}`, { method: "DELETE" }).catch((err) => {
      console.error("[useAuditHistory] Failed to delete from database:", err);
    });
  }, []);

  return { history, hydrated, saveAudit, deleteAudit };
}
