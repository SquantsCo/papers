export default function LearnPage() {
  return (
    <main className="bg-background px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-3xl font-semibold text-slate-900">Learn</h1>
        <p className="mb-4 text-sm text-slate-700">
          The Learn section will organize beginner-friendly pathways through
          classical physics, quantum mechanics, quantum computing, and quantum
          machine learning. The goal is not to replace textbooks, but to act as
          a guided map through them.
        </p>
        <p className="mb-4 text-sm text-slate-700">
          Initial tracks might include:
        </p>
        <ul className="mb-4 list-inside list-disc text-sm text-slate-700">
          <li>From classical intuition to quantum states.</li>
          <li>Quantum computing basics for software engineers.</li>
          <li>Quantum machine learning for ML practitioners.</li>
        </ul>
        <p className="text-sm text-slate-700">
          This part of the site is intentionally light at first, so you can
          iterate quickly and invite collaborators to co-create structured
          learning content.
        </p>
      </div>
    </main>
  );
}
