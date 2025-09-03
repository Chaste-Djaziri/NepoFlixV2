"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export default function SearchFloatingBarAnime({ onOpen }: { onOpen: () => void }) {
  const [hotkey, setHotkey] = useState("⌘K");
  useEffect(() => {
    const isMac = typeof window !== "undefined" && /Mac/i.test(navigator.platform);
    setHotkey(isMac ? "⌘K" : "Ctrl+K");
  }, []);
  return (
    <div className="pointer-events-auto absolute left-1/2 top-6 z-40 w-[92%] max-w-2xl -translate-x-1/2">
      <button
        onClick={onOpen}
        className="flex w-full items-center justify-between rounded-xl border border-white/15 bg-black/35 px-4 py-2.5 text-sm text-white/90 shadow-lg backdrop-blur transition hover:bg-black/45 focus:outline-none focus:ring-2 focus:ring-white/40"
        aria-label="Open search (shortcut)"
      >
        <span className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <span className="opacity-90">Search anime or manga… (press {hotkey})</span>
        </span>
        <kbd className="rounded bg-white/15 px-2 py-0.5 text-xs">{hotkey}</kbd>
      </button>
    </div>
  );
}
