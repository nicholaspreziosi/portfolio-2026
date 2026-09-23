import { getTranslations } from "next-intl/server";
import { WorkView } from "@/ui/work/views/work/WorkView";

export default async function WorkPage() {
  const t = await getTranslations("Navigation");

  return <WorkView title={t("work")} />;
}
