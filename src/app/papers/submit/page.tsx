"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type SubmitResponse = {
  paperId: number;
};

export default function SubmitPaperPage() {
  const router = useRouter();
  const [arxivInput, setArxivInput] = useState("");
  const [title, setTitle] = useState("");
  const [abstractText, setAbstractText] = useState("");
  const [url, setUrl] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [summary, setSummary] = useState("");
  const [intuition, setIntuition] = useState("");
  const [technical, setTechnical] = useState("");
  const [codeUrl, setCodeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !abstractText.trim()) {
      setError("Title and abstract are required (from arXiv or manually).");
      return;
    }
    if (!summary.trim() || !intuition.trim()) {
      setError("Please provide at least a summary and intuition for your explainer.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/papers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          arxivInput: arxivInput.trim() || null,
          title: title.trim(),
          abstract: abstractText.trim(),
          url: url.trim() || null,
          authorName: authorName.trim() || null,
          summary: summary.trim(),
          intuition: intuition.trim(),
          technical: technical.trim() || null,
          codeUrl: codeUrl.trim() || null
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to submit paper.");
      }

      const data = (await res.json()) as SubmitResponse;
      router.push(`/papers/${data.paperId}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFetchFromArxiv() {
    setError(null);
    if (!arxivInput.trim()) {
      setError("Please enter an arXiv ID or URL.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/arxiv/lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ input: arxivInput.trim() })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Could not fetch from arXiv.");
      }

      const data = (await res.json()) as {
        arxivId: string;
        title: string;
        summary: string;
        url: string;
      };

      setTitle(data.title);
      setAbstractText(data.summary);
      setUrl(data.url);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch from arXiv.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-background px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl border-2 border-primary-300 bg-white p-5 shadow-md">
        <h1 className="mb-2 text-2xl font-semibold bg-gradient-to-r from-primary-700 to-primary-900 bg-clip-text text-transparent">
          Submit a paper explainer
        </h1>
        <p className="mb-4 text-sm text-slate-600">
          Start with an arXiv link or ID, or enter details manually. Then add a
          clear summary and intuition so others can quickly understand the
          essence of the work.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-xl border-2 border-primary-200 bg-primary-50 p-3">
            <p className="mb-2 text-xs font-medium text-primary-900">
              1. Fetch from arXiv (optional but recommended)
            </p>
            <div className="flex flex-col gap-2 md:flex-row">
              <input
                type="text"
                placeholder="arXiv ID or URL (e.g. 2010.12345 or https://arxiv.org/abs/2010.12345)"
                value={arxivInput}
                onChange={(e) => setArxivInput(e.target.value)}
                className="flex-1 rounded-xl border-2 border-primary-300 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-300"
              />
              <button
                type="button"
                onClick={handleFetchFromArxiv}
                disabled={loading}
                className="rounded-full bg-gradient-to-r from-primary-700 to-primary-900 px-4 py-2 text-xs font-medium text-white shadow-md hover:from-primary-800 hover:to-primary-800 disabled:cursor-not-allowed disabled:from-primary-500 disabled:to-primary-500 transition-all"
              >
                {loading ? "Fetching..." : "Fetch from arXiv"}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              If the fetch fails, you can still fill in the details manually.
            </p>
          </div>

          <div>
            <p className="mb-1 text-xs font-medium text-primary-900\">
              2. Paper details
            </p>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Paper title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border-2 border-primary-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-300 transition-colors"
              />
              <textarea
                placeholder="Abstract (you can lightly edit to make it readable)"
                value={abstractText}
                onChange={(e) => setAbstractText(e.target.value)}
                className="h-28 w-full rounded-xl border-2 border-primary-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-300 transition-colors"
              />
              <input
                type="url"
                placeholder="Original paper URL (arXiv or publisher)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full rounded-xl border-2 border-primary-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-300 transition-colors"
              />
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs font-medium text-primary-900\">
              3. Your explainer
            </p>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Your name or handle (optional)"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full rounded-xl border-2 border-primary-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-300 transition-colors"
              />
              <textarea
                placeholder="Summary – what is this paper about, in a few short paragraphs?"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="h-28 w-full rounded-xl border-2 border-primary-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-300 transition-colors"
              />
              <textarea
                placeholder="Intuition – how can a reasonably informed student understand the main idea?"
                value={intuition}
                onChange={(e) => setIntuition(e.target.value)}
                className="h-28 w-full rounded-xl border-2 border-primary-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-300 transition-colors"
              />
              <textarea
                placeholder="Technical notes (optional) – derivations, caveats, or important math details."
                value={technical}
                onChange={(e) => setTechnical(e.target.value)}
                className="h-24 w-full rounded-xl border-2 border-primary-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-300 transition-colors"
              />
              <input
                type="url"
                placeholder="Code URL (optional, e.g. GitHub repo implementing this paper)"
                value={codeUrl}
                onChange={(e) => setCodeUrl(e.target.value)}
                className="w-full rounded-xl border-2 border-primary-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-300 transition-colors"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-gradient-to-r from-primary-700 to-primary-900 px-4 py-2 text-sm font-medium text-white shadow-md hover:from-primary-800 hover:to-primary-800 disabled:cursor-not-allowed disabled:from-primary-500 disabled:to-primary-500 transition-all"
          >
            {loading ? "Submitting..." : "Submit explainer"}
          </button>
        </form>
      </div>
    </main>
  );
}
