import { getTranslations } from "next-intl/server";
import { ContactView } from "@/ui/contact/views/contact/ContactView";

export default async function ContactPage() {
  const t = await getTranslations("Navigation");

  return <ContactView title={t("contact")} />;
}
