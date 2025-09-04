// src/components/sections/Anime/ui/layout/TopNavbarAnime.tsx
"use client";

import { animeSiteConfig } from "@/config/animeSite";
import { usePathname } from "next/navigation";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import BackButton from "@/components/ui/button/BackButton";
import { useWindowScroll } from "@mantine/hooks";
import ThemeSwitchDropdown from "@/components/ui/input/ThemeSwitchDropdown";
import FullscreenToggleButton from "@/components/ui/button/FullscreenToggleButton";
import UserProfileButton from "@/components/ui/button/UserProfileButton";
import Link from "next/link";
import { cn } from "@/utils/helpers";
import Brand from "@/components/ui/other/Brand";
import { Search } from "lucide-react";

const TopNavbarAnime = () => {
  const pathName = usePathname();
  const [{ y }] = useWindowScroll();
  const opacity = Math.min((y / 1000) * 5, 1);

  const hrefs = animeSiteConfig.navItems.map((item) => item.href);
  const show = hrefs.includes(pathName);
  const player = pathName.includes("/anime/player");
  const auth = pathName.includes("/auth");

  if (auth || player) return null;

  return (
    <Navbar
      disableScrollHandler
      isBlurred={false}
      position="sticky"
      maxWidth="full"
      className={cn("top-0 h-20 md:h-24 bg-transparent transition-colors", {
        "bg-background": show,
      })}
      classNames={{
        wrapper:
          "px-3 md:px-6 mx-0 md:mx-10 pl-[max(env(safe-area-inset-left),0px)] pr-[max(env(safe-area-inset-right),0px)]",
      }}
    >
      {!show && (
        <div
          className="absolute inset-0 h-full w-full border-b border-background bg-background"
          style={{ opacity }}
        />
      )}

      <NavbarBrand className="gap-5">
        {show ? (
          <>
            <Brand />
            <nav className="hidden items-center gap-5 md:flex">
              {animeSiteConfig.navItems.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "text-base font-semibold tracking-wide hover:text-primary transition-colors",
                    pathName === href ? "text-primary" : "text-foreground/85",
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </>
        ) : (
          <BackButton href="/anime" />
        )}
      </NavbarBrand>

      <NavbarContent justify="end" className="items-center gap-3 md:gap-4">
        <NavbarItem>
          <Link
            href="/anime/search"
            aria-label="Search anime"
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
