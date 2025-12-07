import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PaperComments } from "./paper-comments";

interface PaperPageProps {
  params: { id: string };
}

export default async function PaperPage({ params }: PaperPageProps) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    notFound();
  }

  const paper = await prisma.paper.findUnique({
    where: { id },
    include: {
      explanations: {
        orderBy: { createdAt: "asc" }
      },
      comments: {
        orderBy: { createdAt: "asc" }
      }
    }
  });

  if (!paper) {
    notFound();
  }

  return (
    <main className="bg-background px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/papers"
          className="mb-4 inline-flex text-xs text-slate-500 hover:text-primary-600"
        >
          ← Back to papers
        </Link>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-xl font-semibold text-slate-900 md:text-2xl">
              {paper.title}
            </h1>
            {paper.arxivId && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
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
            className="text-xs font-medium text-primary-600 underline"
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
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
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
                  <p className="text-[11px] text-slate-400">
                    Added on {exp.createdAt.toLocaleDateString()}
                  </p>
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
