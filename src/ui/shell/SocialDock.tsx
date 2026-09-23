"use client";

import { useTranslations } from "next-intl";
import { Dock, DockIcon } from "@/ui/shared/components/dock";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/shared/components/tooltip";

const ICON_SIZE = 40;
const ICON_MAGNIFICATION = 68;
const ICON_DISTANCE = 180;

const links = [
  {
    id: "email",
    href: "mailto:nickprez@gmail.com",
    detail: "nickprez@gmail.com",
    icon: MailIcon,
  },
  {
    id: "phone",
    href: "tel:+19083345888",
    detail: "+1 908 334 5888",
    icon: PhoneIcon,
  },
  {
    id: "linkedin",
    href: "https://www.linkedin.com/in/nicholas-preziosi-4b037214a/",
    external: true,
    icon: LinkedInIcon,
  },
  {
    id: "facebook",
    href: "https://www.facebook.com/nick.preziosi.33/",
    external: true,
    icon: FacebookIcon,
  },
  {
    id: "instagram",
    href: "https://www.instagram.com/nickpreziosi/",
    external: true,
    icon: InstagramIcon,
  },
] as const;

export function SocialDock() {
  const t = useTranslations("Social");

  return (
    <aside className="fixed end-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <Dock
        orientation="vertical"
        direction="end"
        iconSize={ICON_SIZE}
        iconMagnification={ICON_MAGNIFICATION}
        iconDistance={ICON_DISTANCE}
        iconPadding={0}
        className="gap-5"
      >
        {links.map((link) => {
          const Icon = link.icon;
          const name = t(link.id);
          const detail = "detail" in link ? link.detail : undefined;
          const external = "external" in link ? link.external : false;

          return (
            <DockIcon key={link.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={link.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer noopener" : undefined}
                    aria-label={detail ? `${name}, ${detail}` : name}
                    className="flex size-full items-center justify-center rounded-full border border-(--nav-glass-border) bg-(--nav-glass) text-(--color-text-secondary) shadow-[var(--surface-glass-shadow)] backdrop-blur-(--surface-glass-blur) transition-colors duration-150 hover:text-(--color-text-primary)"
                  >
                    <Icon className="size-1/2" />
                  </a>
                </TooltipTrigger>
                <TooltipContent side="left" sideOffset={12}>
                  {detail ?? name}
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          );
        })}
      </Dock>
    </aside>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"
      />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"
      />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"
      />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"
      />
    </svg>
  );
}
