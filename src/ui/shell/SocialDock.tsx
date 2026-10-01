"use client";

import { useTranslations } from "next-intl";
import { Dock, DockIcon } from "@/ui/shared/components/dock";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/shared/components/tooltip";
import { socialIcons } from "@/ui/shell/socialIcons";
import { socialLinks } from "@/ui/shell/socialLinks";

const ICON_SIZE = 40;
const ICON_MAGNIFICATION = 68;
const ICON_DISTANCE = 180;

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
        {socialLinks.map((link) => {
          const Icon = socialIcons[link.id];
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
                    className="flex size-full items-center justify-center rounded-pill border border-(--line) bg-(--nav-glass) text-(--color-text-secondary) shadow-[var(--surface-glass-shadow)] backdrop-blur-(--surface-glass-blur) transition-colors duration-150 hover:text-(--color-text-primary) dark:border-(--nav-glass-border)"
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
