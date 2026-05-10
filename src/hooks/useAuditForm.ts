"use client";

import { useState, useEffect, useCallback } from "react";
import type { AuditFormState, ToolEntry, ToolId } from "@/lib/types";
import { TOOLS_CONFIG } from "@/lib/tools-config";

const STORAGE_KEY = "stackaudit_form_v1";

function buildDefaultState(): AuditFormState {
  const tools = Object.fromEntries(
    TOOLS_CONFIG.map((t) => [
      t.id,
      {
        toolId: t.id,
        enabled: false,
        plan: t.plans[0]?.value ?? "",
        monthlySpend: "",
        seats: "",
        useCase: "",
      } satisfies ToolEntry,
    ])
  ) as Record<ToolId, ToolEntry>;

  return {
    tools,
    teamSize: "",
    companyName: "",
    email: "",
  };
}

function loadFromStorage(): AuditFormState {
  if (typeof window === "undefined") return buildDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildDefaultState();
    const parsed = JSON.parse(raw) as AuditFormState;
    // Merge with defaults so new tools added later still appear
    const defaults = buildDefaultState();
    return {
      ...defaults,
      ...parsed,
      tools: { ...defaults.tools, ...parsed.tools },
    };
  } catch {
    return buildDefaultState();
  }
}

export function useAuditForm() {
  const [form, setForm] = useState<AuditFormState>(buildDefaultState);

  // Hydrate from localStorage on mount (client only)
  useEffect(() => {
    setForm(loadFromStorage());
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {
      // storage quota exceeded — silently ignore
    }
  }, [form]);

  // ── helpers ────────────────────────────────────────────────────────────────

  const setTopLevel = useCallback(
    <K extends keyof Omit<AuditFormState, "tools">>(
      key: K,
      value: AuditFormState[K]
    ) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const setToolField = useCallback(
    <K extends keyof ToolEntry>(toolId: ToolId, key: K, value: ToolEntry[K]) => {
      setForm((prev) => ({
        ...prev,
        tools: {
          ...prev.tools,
          [toolId]: { ...prev.tools[toolId], [key]: value },
        },
      }));
    },
    []
  );

  const toggleTool = useCallback((toolId: ToolId) => {
    setForm((prev) => ({
      ...prev,
      tools: {
        ...prev.tools,
        [toolId]: {
          ...prev.tools[toolId],
          enabled: !prev.tools[toolId].enabled,
        },
      },
    }));
  }, []);

  const resetForm = useCallback(() => {
    const fresh = buildDefaultState();
    setForm(fresh);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const enabledTools = TOOLS_CONFIG.filter((t) => form.tools[t.id]?.enabled);

  return {
    form,
    enabledTools,
    setTopLevel,
    setToolField,
    toggleTool,
    resetForm,
  };
}
