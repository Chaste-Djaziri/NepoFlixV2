// src/components/sections/Anime/ui/layout/FooterAnime.tsx
"use client";

import { animeSiteConfig } from "@/config/animeSite";
import { cn } from "@/utils/helpers";
import { BreadcrumbItem, Breadcrumbs, Link } from "@heroui/react";
import { usePathname } from "next/navigation";
import { FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";

interface FooterProps {
  className?: string;
}

const FooterAnime: React.FC<FooterProps> = ({ className }) => {
  const pathName = usePathname();

  return (
    <footer
      className={cn("w-full bg-background/80 backdrop-blur py-6 text-center text-sm text-white/80", className)}
    >
      <p className="mb-3">{animeSiteConfig.description}</p>

      <div className="mb-3 flex justify-center gap-4">
        <Link isExternal href={animeSiteConfig.socials.github} color="foreground">
          <FaGithub size={20} />
        </Link>
        {animeSiteConfig.socials.twitter && (
          <Link isExternal href={animeSiteConfig.socials.twitter} color="foreground">
            <FaTwitter size={20} />
          </Link>
        )}
        {animeSiteConfig.socials.instagram && (
          <Link isExternal href={animeSiteConfig.socials.instagram} color="foreground">
            <FaInstagram size={20} />
          </Link>
        )}
      </div>

      <Breadcrumbs
        separator="•"
        itemClasses={{ separator: "px-2 text-white/60" }}
        className="mb-3 flex flex-wrap justify-center gap-1 text-sm"
      >
        {animeSiteConfig.navItems.map(({ label, href }) => (
          <BreadcrumbItem key={href} isCurrent={pathName === href} href={href}>
            {label}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>

      <p className="text-xs text-white/50">© 2025 Chaste Djaziri — NepoFlix Anime. All rights reserved.</p>
    </footer>
  );
};

export default FooterAnime;
