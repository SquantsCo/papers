import { notFound } from "next/navigation";
import Link from "next/link";
import { PaperComments } from "./paper-comments";

interface PaperPageProps {
  params: { id: string };
}

interface Explanation {
  id: number;
  authorName: string | null;
  summary: string;
  intuition: string;
  technical: string | null;
  codeUrl: string | null;
  createdAt?: Date;
}

interface DemoPaper {
  id: number;
  title: string;
  abstract: string;
  url: string;
  arxivId: string;
  submittedBy: string | null;
  summary: string;
  intuition: string;
  technical: string;
  codeUrl: string | null;
  createdAt: Date;
  explanations: Explanation[];
  comments: Comment[];
}

interface Comment {
  id: number;
  authorName: string | null;
  content: string;
  createdAt: Date | string;
}

export default async function PaperPage({ params }: PaperPageProps) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    notFound();
  }

  // Demo data - backend not yet deployed
  if (id !== 1) {
    notFound();
  }

  const paper: DemoPaper = {
    id: 1,
    title: "Quantum Machine Learning: An Overview",
    abstract: "A comprehensive overview of quantum machine learning algorithms and their applications.",
    url: "https://arxiv.org/abs/2103.15027",
    arxivId: "2103.15027",
    submittedBy: "Demo Author",
    summary: "This paper provides a comprehensive overview of quantum machine learning, discussing various quantum algorithms that can be applied to machine learning tasks.",
    intuition: "Quantum computers can process information in fundamentally different ways than classical computers, enabling faster solutions to certain machine learning problems.",
    technical: "The paper discusses variational quantum algorithms (VQA), quantum neural networks, and their implementation on NISQ devices.",
    codeUrl: "https://github.com/example/qml",
    createdAt: new Date("2024-01-15"),
    explanations: [],
    comments: []
  };

  return (
    <main className="bg-background px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/papers"
          className="mb-4 inline-flex text-xs text-primary-700 hover:text-primary-900 font-medium transition-colors"
        >
          ← Back to papers
        </Link>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-xl font-semibold text-slate-900 md:text-2xl">
              {paper.title}
            </h1>
            {paper.arxivId && (
              <span className="rounded-full bg-gradient-to-r from-primary-100 to-primary-50 px-2 py-0.5 text-[11px] font-medium text-primary-800">
                arXiv: {paper.arxivId}
              </span>
            )}
          </div>
          <p className="mb-3 text-xs text-slate-500">
            Submitted on {paper.createdAt.toLocaleDateString()}{" "}
            {paper.submittedBy ? `· by ${paper.submittedBy}` : ""}
          </p>
          <p className="mb-3 whitespace-pre-line text-sm text-slate-700">
            {paper.abstract}
          </p>
          <a
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-primary-700 hover:text-primary-900 underline transition-colors"
          >
            View original paper →
          </a>
        </div>

        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900 md:text-base">
              Explainers
            </h2>
          </div>
          {paper.explanations.length === 0 ? (
            <p className="text-sm text-slate-600">
              No explainers have been added yet. In a later version, you can
              allow multiple explainers per paper (e.g. beginner-friendly vs
              technical). For now, you can add or edit the main explainer
              through the submission flow.
            </p>
          ) : (
            <div className="space-y-4">
              {paper.explanations.map((exp) => (
                <article
                  key={exp.id}
                  className="rounded-2xl border-2 border-primary-200 bg-white p-4 shadow-sm hover:border-primary-300 transition-colors"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Explainer
                    </h3>
                    {exp.authorName && (
                      <span className="text-[11px] text-slate-500">
                        by {exp.authorName}
                      </span>
                    )}
                  </div>
                  <div className="mb-3 space-y-2 text-sm text-slate-700">
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Summary
                      </p>
                      <p className="whitespace-pre-line">{exp.summary}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Intuition
                      </p>
                      <p className="whitespace-pre-line">{exp.intuition}</p>
                    </div>
                    {exp.technical && (
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Technical notes
                        </p>
                        <p className="whitespace-pre-line">{exp.technical}</p>
                      </div>
                    )}
                    {exp.codeUrl && (
                      <p className="text-xs text-primary-600">
                        Code:{" "}
                        <a
                          href={exp.codeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          {exp.codeUrl}
                        </a>
                      </p>
                    )}
                  </div>
                  {exp.createdAt && (
                    <p className="text-[11px] text-slate-400">
                      Added on {exp.createdAt.toLocaleDateString()}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <PaperComments paperId={paper.id} comments={paper.comments} />
      </div>
    </main>
  );
}
