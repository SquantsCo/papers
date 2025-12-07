"use client";

import { useState, FormEvent } from "react";

type Comment = {
  id: number;
  authorName: string | null;
  content: string;
  createdAt: string;
};

interface PaperCommentsProps {
  paperId: number;
  comments: Comment[];
}

export function PaperComments({ paperId, comments }: PaperCommentsProps) {
  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setError("Comment cannot be empty.");
      return;
    }
    if (trimmedContent.length > 2000) {
      setError("Comment is too long. Please keep it under 2000 characters.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`/api/papers/${paperId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          authorName: authorName.trim() || null,
          content: trimmedContent
        })
      });

      if (!res.ok) {
        throw new Error("Failed to submit comment");
      }

      const data = (await res.json()) as { comment: Comment };
      setLocalComments((prev) => [...prev, data.comment]);
      setContent("");
      setAuthorName("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while submitting your comment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-sm font-semibold text-slate-900 md:text-base">
        Comments
      </h2>
      {localComments.length === 0 ? (
        <p className="mb-3 text-sm text-slate-600">
          No comments yet. Share questions, clarifications, or insights related
          to this paper and its explainer.
        </p>
      ) : (
        <ul className="mb-4 space-y-3">
          {localComments.map((comment) => (
            <li
              key={comment.id}
              className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm"
            >
              <p className="mb-1 whitespace-pre-line">{comment.content}</p>
              <p className="text-[11px] text-slate-400">
                {comment.authorName ? `by ${comment.authorName} · ` : ""}
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <p className="mb-2 text-xs font-medium text-slate-700">
          Add a comment (keep it respectful and on-topic).
        </p>
        <div className="mb-2 flex gap-2">
          <input
            type="text"
            placeholder="Name (optional)"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-300"
          />
        </div>
        <textarea
          placeholder="Your comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mb-2 h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-300"
        />
        {error && <p className="mb-2 text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-primary-500 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-primary-300"
        >
          {submitting ? "Submitting..." : "Post comment"}
        </button>
      </form>
    </section>
  );
}
