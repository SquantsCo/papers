export type ArxivMetadata = {
  id: string;
  title: string;
  summary: string;
  url: string;
};

/**
 * Extract an arXiv ID from a URL or raw ID input.
 */
export function extractArxivId(input: string): string | null {
  const trimmed = input.trim();
  // If it looks like a bare ID
  if (/^\d{4}\.\d{4,5}(v\d+)?$/.test(trimmed)) {
    return trimmed.replace(/v\d+$/, "");
  }
  // Try to pull from URL
  const match = trimmed.match(/arxiv\.org\/abs\/([0-9\.v]+)/i);
  if (match?.[1]) {
    return match[1].replace(/v\d+$/, "");
  }
  return null;
}

/**
 * Fetch basic metadata from arXiv's API.
 * This runs on the server only.
 */
export async function fetchArxivMetadata(id: string): Promise<ArxivMetadata | null> {
  const queryId = id.replace(/v\d+$/, "");
  const url = `https://export.arxiv.org/api/query?id_list=${encodeURIComponent(queryId)}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "SquantsPapers/0.1 (https://squants.com)"
    },
    cache: "no-store"
  });

  if (!res.ok) {
    return null;
  }

  const xml = await res.text();
  // Very light-weight XML parsing using regex just for demo purposes.
  const titleMatch = xml.match(/<title>([\s\S]*?)<\/title>/);
  const summaryMatch = xml.match(/<summary>([\s\S]*?)<\/summary>/);
  const idMatch = xml.match(/<id>([\s\S]*?)<\/id>/);

  if (!titleMatch || !summaryMatch || !idMatch) {
    return null;
  }

  const title = titleMatch[1].replace(/\s+/g, " ").trim();
  const summary = summaryMatch[1].replace(/\s+/g, " ").trim();
  const entryId = idMatch[1].trim();
  const link = entryId || `https://arxiv.org/abs/${queryId}`;

  return {
    id: queryId,
    title,
    summary,
    url: link
  };
}
