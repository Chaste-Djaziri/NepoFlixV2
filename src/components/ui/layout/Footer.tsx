// src/components/ui/layout/Footer.tsx
"use client";

import { siteConfig } from "@/config/site";
import { cn } from "@/utils/helpers";
import { BreadcrumbItem, Breadcrumbs, Link } from "@heroui/react";
import { usePathname } from "next/navigation";
import { FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const pathName = usePathname();

  return (
    <footer
      className={cn(
        "w-full bg-background/80 backdrop-blur py-6 text-center text-sm text-white/80",
        className
      )}
    >
      {/* Site description */}
      <p className="mb-3">{siteConfig.description}</p>

      {/* Social icons */}
      <div className="mb-3 flex justify-center gap-4">
        <Link isExternal href={siteConfig.socials.github} color="foreground">
          <FaGithub size={20} />
        </Link>
        {siteConfig.socials.twitter && (
          <Link isExternal href={siteConfig.socials.twitter} color="foreground">
            <FaTwitter size={20} />
          </Link>
        )}
        {siteConfig.socials.instagram && (
          <Link isExternal href={siteConfig.socials.instagram} color="foreground">
            <FaInstagram size={20} />
          </Link>
        )}
      </div>

      {/* Footer navigation links */}
      <Breadcrumbs
        separator="•"
        itemClasses={{
          separator: "px-2 text-white/60",
        }}
        className="mb-3 flex flex-wrap justify-center gap-1 text-sm"
      >
        {siteConfig.navItems.map(({ label, href }) => (
          <BreadcrumbItem key={href} isCurrent={pathName === href} href={href}>
            {label}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>

      {/* Copyright */}
      <p className="text-xs text-white/50">
        © 2025 Chaste Djaziri — NepoFlix. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
