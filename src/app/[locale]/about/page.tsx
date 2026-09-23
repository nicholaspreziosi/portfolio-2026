import { getTranslations } from "next-intl/server";
import { AboutView } from "@/ui/about/views/about/AboutView";

export default async function AboutPage() {
  const t = await getTranslations("Navigation");

  return <AboutView title={t("about")} />;
}
