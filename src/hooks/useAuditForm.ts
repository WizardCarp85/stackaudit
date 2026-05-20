"use client";

import { useState, useEffect, useCallback } from "react";
import type { AuditFormState, ToolEntry, ToolId } from "@/lib/types";
import { TOOLS_CONFIG } from "@/lib/tools-config";

const STORAGE_KEY = "stackaudit_form_v2";

function generateInstanceId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 9);
}

function buildDefaultState(): AuditFormState {
  return {
    tools: [],
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
    // Basic validation to ensure we have the right shape
    if (!Array.isArray(parsed.tools)) {
      return buildDefaultState();
    }
    const defaults = buildDefaultState();
    return {
      ...defaults,
      ...parsed,
      tools: parsed.tools,
    };
  } catch {
    return buildDefaultState();
  }
}

export function useAuditForm() {
  const [form, setForm] = useState<AuditFormState>(buildDefaultState);

  // Hydrate from localStorage on mount (client only)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <K extends keyof ToolEntry>(instanceId: string, key: K, value: ToolEntry[K]) => {
      setForm((prev) => ({
        ...prev,
        tools: prev.tools.map((entry) =>
          entry.instanceId === instanceId ? { ...entry, [key]: value } : entry
        ),
      }));
    },
    []
  );

  const addTool = useCallback((toolId: ToolId) => {
    const config = TOOLS_CONFIG.find((t) => t.id === toolId);
    if (!config) return;

    setForm((prev) => ({
      ...prev,
      tools: [
        ...prev.tools,
        {
          instanceId: generateInstanceId(),
          toolId,
          plan: config.plans[0]?.value ?? "",
          monthlySpend: "",
          seats: "",
          useCase: "",
        },
      ],
    }));
  }, []);

  const removeTool = useCallback((instanceId: string) => {
    setForm((prev) => ({
      ...prev,
      tools: prev.tools.filter((t) => t.instanceId !== instanceId),
    }));
  }, []);

  const resetForm = useCallback(() => {
    const fresh = buildDefaultState();
    setForm(fresh);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    form,
    setTopLevel,
    setToolField,
    addTool,
    removeTool,
    resetForm,
  };
}
