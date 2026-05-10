"use client";

import { useEffect } from "react";
import { useUiStore } from "@/stores/ui";

type Theme = "light" | "dark" | "system";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
  } else {
    root.classList.toggle("dark", theme === "dark");
  }
}

/** Light / dark / system toggle. Writes to ui store + applies class to <html>. */
export function ThemeToggle() {
  const { theme, setTheme } = useUiStore();

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const next: Theme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  const label = theme === "light" ? "☀️" : theme === "dark" ? "🌙" : "💻";

  return (
    <button
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
      className="rounded-md p-2 text-sm transition-colors hover:bg-[var(--color-surface-raised)]"
    >
      {label}
    </button>
  );
}
