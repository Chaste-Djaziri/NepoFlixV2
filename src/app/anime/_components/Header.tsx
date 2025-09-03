"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { animeSiteConfig } from "@/config/animeSite";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-default-200/30 backdrop-blur bg-background/70">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
        <Link href="/anime" className="font-bold tracking-wide">NepoFlix Anime</Link>
        <ul className="flex items-center gap-3 text-sm">
          {animeSiteConfig.navItems.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`inline-flex items-center gap-2 px-2 py-1 rounded-lg ${active ? "bg-default-100" : ""}`}
                >
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <Link href="/" className="inline-flex items-center gap-2 px-2 py-1 rounded-lg">
              <span>Switch to Movies</span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
