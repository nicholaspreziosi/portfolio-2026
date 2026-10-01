import { getTranslations } from "next-intl/server";
import { cn } from "cn";
import { Link } from "@/i18n/navigation";
import { Button } from "@/ui/shared/components/button";
import { pageContainerClassName } from "@/ui/shell/pageContainer";
import { socialIcons } from "@/ui/shell/socialIcons";
import { socialLinks } from "@/ui/shell/socialLinks";

const pages = [
  { href: "/", id: "home" },
  { href: "/about", id: "about" },
  { href: "/work", id: "work" },
  { href: "/contact", id: "contact" },
] as const;

export async function Footer() {
  const t = await getTranslations("Footer");
  const nav = await getTranslations("Navigation");
  const social = await getTranslations("Social");
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full border-t border-(--line) bg-background">
      <div
        className={cn(
          pageContainerClassName,
          "flex flex-col gap-8 pt-10 pb-[calc(2.5rem+4.375rem+0.75rem+env(safe-area-inset-bottom))] sm:py-10"
        )}
      >
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-12 lg:gap-y-10">
          <div className="flex max-w-md flex-col gap-1">
            <Link href="/" className="w-fit text-lg font-semibold tracking-tight">
              <span className="gradient-text">nickprez</span>
              <span className="text-(--color-text-primary)">.dev</span>
            </Link>
            <p className="text-sm leading-5 tracking-[-0.07px] text-(--color-text-secondary)">
              {t("tagline")}
            </p>
          </div>
          <nav aria-label={nav("menu")} className="flex w-fit items-center gap-x-6 lg:justify-self-end">
            {pages.map((page) => (
              <Button key={page.id} variant="link" size="sm" className="h-auto px-0" asChild>
                <Link href={page.href}>{nav(page.id)}</Link>
              </Button>
            ))}
          </nav>
          <ul className="flex w-fit items-center gap-2 lg:col-start-2 lg:row-start-2 lg:justify-self-end">
            {socialLinks.map((link) => {
              const Icon = socialIcons[link.id];
              const external = "external" in link && link.external;
              const name = social(link.id);
              const detail = "detail" in link ? link.detail : undefined;

              return (
                <li key={link.id}>
                  <Button variant="outline" size="icon-sm" className="text-(--color-text-secondary)" asChild>
                    <a
                      href={link.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer noopener" : undefined}
                      aria-label={detail ? `${name}, ${detail}` : name}
                    >
                      <Icon />
                    </a>
                  </Button>
                </li>
              );
            })}
          </ul>
          <p className="text-xs leading-4 text-(--color-text-secondary) lg:col-start-1 lg:row-start-2">
            {t("copyright", { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}
