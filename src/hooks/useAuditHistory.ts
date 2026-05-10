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
    setHistory(loadHistory());
    setHydrated(true);
  }, []);

  const saveAudit = useCallback((result: AuditResult) => {
    saveAuditToHistory(result);
    setHistory(loadHistory());
  }, []);

  const deleteAudit = useCallback((id: string) => {
    const updated = deleteAuditFromHistory(id);
    setHistory(updated);
  }, []);

  return { history, hydrated, saveAudit, deleteAudit };
}
