import { getTranslations } from "next-intl/server";
import { getProfile } from "@/lib/content";

export default async function Home() {
  const t = await getTranslations("HomePage");
  const profile = getProfile();

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="space-y-3 text-center">
        <p className="text-sm tracking-[0.2em] uppercase">{profile.name}</p>
        <h1 className="text-4xl font-semibold tracking-tight">{t("heading")}</h1>
        <p className="text-neutral-500">{t("role")}</p>
      </div>
    </main>
  );
}
