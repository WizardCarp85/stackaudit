"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors hover:bg-black/10 dark:hover:bg-white/20 focus:outline-none flex items-center justify-center border border-transparent dark:border-white/10"
      aria-label="Toggle dark mode"
    >
      {theme === "dark" ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
    </button>
  );
}
