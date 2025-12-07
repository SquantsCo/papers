import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PapersPage() {
  // Demo data - backend not yet deployed
  const papers = [
    {
      id: 1,
      title: "Quantum Machine Learning: An Overview",
      abstract: "A comprehensive overview of quantum machine learning algorithms and their applications.",
      url: "https://arxiv.org/abs/2103.15027",
      arxivId: "2103.15027",
      createdAt: new Date("2024-01-15"),
      explanations: [],
      comments: []
    }
  ];

  return (
    <main className="bg-background px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h1 className="mb-1 text-3xl font-semibold text-slate-900">Explained Papers</h1>
            <p className="text-sm text-slate-600">
              A growing collection of quantum and QML papers with community-written summaries,
              intuition, and (optionally) code.
            </p>
          </div>
          <Link
            href="/papers/submit"
            className="rounded-full bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600"
          >
            Submit a paper explainer
          </Link>
        </div>

        {papers.length === 0 ? (
          <p className="mt-8 text-sm text-slate-600">
            No papers have been added yet. Be the first to{" "}
            <Link href="/papers/submit" className="text-primary-600 underline">
              submit an explainer
            </Link>
            .
          </p>
        ) : (
          <div className="grid gap-4">
            {papers.map((paper) => (
              <Link
                key={paper.id}
                href={`/papers/${paper.id}`}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-primary-300"
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold text-slate-900 md:text-base">
                    {paper.title}
                  </h2>
                  <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-medium text-primary-700">
                    {paper.explanations.length} explainer
                    {paper.explanations.length === 1 ? "" : "s"}
                  </span>
                </div>
                <p className="mb-2 line-clamp-3 text-xs text-slate-600 md:text-sm">
                  {paper.abstract}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  {paper.arxivId && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5">
                      arXiv: {paper.arxivId}
                    </span>
                  )}
                  <span>
                    {paper.comments.length} comment
                    {paper.comments.length === 1 ? "" : "s"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
