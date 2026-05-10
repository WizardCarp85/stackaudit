/**
 * Audit History — localStorage persistence helpers
 * ─────────────────────────────────────────────────────────────────────────────
 * Stores an ordered list of AuditResult objects in localStorage.
 * Newest first. Max 50 entries (trims oldest).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { AuditResult } from "./types";

const HISTORY_KEY = "stackaudit_history_v1";
const MAX_ENTRIES = 50;

export function loadHistory(): AuditResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AuditResult[];
  } catch {
    return [];
  }
}

export function saveAuditToHistory(result: AuditResult): void {
  if (typeof window === "undefined") return;
  try {
    const history = loadHistory();
    // Prepend newest, deduplicate by id, cap at MAX_ENTRIES
    const updated = [result, ...history.filter((r) => r.id !== result.id)].slice(
      0,
      MAX_ENTRIES
    );
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // Storage quota exceeded — silently ignore
  }
}

export function getAuditById(id: string): AuditResult | null {
  const history = loadHistory();
  return history.find((r) => r.id === id) ?? null;
}

export function deleteAuditFromHistory(id: string): AuditResult[] {
  if (typeof window === "undefined") return [];
  const updated = loadHistory().filter((r) => r.id !== id);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
}
