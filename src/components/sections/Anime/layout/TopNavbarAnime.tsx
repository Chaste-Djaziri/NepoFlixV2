"use client";

import { animeSiteConfig } from "@/config/animeSite";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Dropdown, DropdownMenu, DropdownItem, DropdownTrigger, Button, Chip } from "@heroui/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/utils/helpers";
import { useWindowScroll } from "@mantine/hooks";
import ThemeSwitchDropdown from "@/components/ui/input/ThemeSwitchDropdown";
import FullscreenToggleButton from "@/components/ui/button/FullscreenToggleButton";
import UserProfileButton from "@/components/ui/button/UserProfileButton";
import { Search } from "lucide-react";
import { useState } from "react";

// Simple brand to mirror your main site Brand
function AnimeBrand() {
  return (
    <Link href="/anime" className="text-xl font-extrabold tracking-wide text-primary">
      NepoFlix<span className="text-foreground/80">·Anime</span>
    </Link>
  );
}

// EN/JP title toggle (global preference)
export function TitleLangToggle() {
  const [lang, setLang] = useState<"en" | "jp">("en");
  return (
    <Chip
      size="md"
      variant="flat"
      onClick={() => setLang((p) => (p === "en" ? "jp" : "en"))}
      className="cursor-pointer select-none"
    >
      {lang === "en" ? "Title: EN" : "Title: JP"}
    </Chip>
  );
}

const TopNavbarAnime = () => {
  const pathName = usePathname();
  const [{ y }] = useWindowScroll();
  const opacity = Math.min((y / 1000) * 5, 1);

  // pages that show solid background
  const hrefs = ["/anime", "/anime/search"];
  const show = hrefs.includes(pathName);

  return (
    <Navbar
      disableScrollHandler
      isBlurred={false}
      position="sticky"
      maxWidth="full"
      className={cn("top-0 h-20 md:h-24 bg-transparent transition-colors", { "bg-background": show })}
      classNames={{ wrapper: "px-3 md:px-6 mx-0 md:mx-10 pl-[max(env(safe-area-inset-left),0px)] pr-[max(env(safe-area-inset-right),0px)]" }}
    >
      {!show && (
        <div
          className="absolute inset-0 h-full w-full border-b border-background bg-background"
          style={{ opacity }}
        />
      )}

      {/* Left: Brand + primary nav */}
      <NavbarBrand className="gap-5">
        <AnimeBrand />
        <nav className="hidden items-center gap-5 md:flex">
          {animeSiteConfig.navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-base font-semibold tracking-wide hover:text-primary transition-colors",
                pathName === href ? "text-primary" : "text-foreground/85"
              )}
            >
              {label}
            </Link>
          ))}

          {/* More menu */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="light"
                className="px-2 text-base font-semibold tracking-wide text-foreground/85 hover:text-primary"
                endContent={animeSiteConfig.headerIcons.more}
              >
                More
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="More anime links" className="min-w-[240px]">
              {animeSiteConfig.moreItems.map((it) => (
                <DropdownItem key={it.href} as={Link} href={it.href}>
                  {it.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </nav>
      </NavbarBrand>

      {/* Right: search, lang toggle, theme, fullscreen, profile */}
      <NavbarContent justify="end" className="items-center gap-3 md:gap-4">
        <NavbarItem className="hidden md:flex">
          <TitleLangToggle />
        </NavbarItem>

        <NavbarItem>
          <Link
            href="/anime/search"
            aria-label="Search"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-transparent bg-white/10 backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <Search className="h-5 w-5 text-white" />
          </Link>
        </NavbarItem>

        <NavbarItem>
          <ThemeSwitchDropdown />
        </NavbarItem>

        <NavbarItem className="hidden md:block">
          <FullscreenToggleButton />
        </NavbarItem>

        <NavbarItem>
          <UserProfileButton />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default TopNavbarAnime;
