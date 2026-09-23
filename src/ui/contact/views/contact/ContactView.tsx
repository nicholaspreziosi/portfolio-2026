export function ContactView({ title }: { title: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-(--color-text-primary)">
        {title}
      </h1>
    </main>
  );
}
