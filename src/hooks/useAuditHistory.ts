"use client";

import { useState, useEffect, useCallback } from "react";
import type { AuditResult } from "@/lib/types";
import {
  loadHistory,
  saveAuditToHistory,
  deleteAuditFromHistory,
} from "@/lib/audit-history";

export function useAuditHistory() {
  const [history, setHistory] = useState<AuditResult[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory(loadHistory());
    setHydrated(true);
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
