import { pageContainerClassName } from "@/ui/shell/pageContainer";

export function ContactView({ title }: { title: string }) {
  return (
    <main className={`flex min-h-screen items-center justify-center ${pageContainerClassName}`}>
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-(--color-text-primary)">
        {title}
      </h1>
    </main>
  );
}
