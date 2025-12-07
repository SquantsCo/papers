import Link from "next/link";

export default function HomePage() {
  return (
    <main className="bg-background">
      <section className="border-b border-slate-200 bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:py-20">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary-500">
              Quantum · Papers · Community
            </p>
            <h1 className="mb-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
              A hub for{" "}
              <span className="text-primary-600">
                quantum papers & beginner pathways.
              </span>
            </h1>
            <p className="mb-6 max-w-xl text-sm text-slate-600 md:text-base">
              Squants.com helps learners and researchers navigate quantum
              physics and quantum machine learning — with paper explainers,
              curated learning paths, and, soon, a focused community space built
              just for the quantum ecosystem.
            </p>
            <div className="mb-4 flex flex-wrap gap-3">
              <Link
                href="/papers"
                className="rounded-full bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600"
              >
                Browse explained papers
              </Link>
              <Link
                href="/papers/submit"
                className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:border-primary-400 hover:text-primary-600"
              >
                Submit your explainer
              </Link>
            </div>
            <p className="text-xs text-slate-500">
              Start small. Explain one paper. Help the whole community.
            </p>
          </div>
          <div className="grid gap-4 text-sm">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="mb-1 text-xs font-semibold text-primary-600">
                PAPER EXPLAINERS
              </p>
              <p className="mb-1 font-medium text-slate-900">
                Turn dense arXiv papers into clear explanations.
              </p>
              <p className="text-xs text-slate-600">
                Each paper gets a summary, intuition, and (optionally) code —
                making research more accessible to students, engineers, and
                curious readers.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="mb-1 text-xs font-semibold text-primary-600">
                LEARNING PATHS
              </p>
              <p className="mb-1 font-medium text-slate-900">
                From classical intuition to quantum thinking.
              </p>
              <p className="text-xs text-slate-600">
                Light-weight, beginner-friendly pathways that connect the dots
                from classical physics to QC and QML, with room to grow into
                deeper courses and subscriptions.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="mb-1 text-xs font-semibold text-primary-600">
                COMMUNITY-FIRST
              </p>
              <p className="mb-1 font-medium text-slate-900">
                Built to grow with contributors, not just content.
              </p>
              <p className="text-xs text-slate-600">
                The platform is designed so that the community can add explainers,
                comments, and code — while you focus on curation, partnerships,
                and long-term sustainability.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
