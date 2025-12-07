import { NextResponse } from "next/server";
import { extractArxivId, fetchArxivMetadata } from "@/lib/arxiv";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = typeof body.input === "string" ? body.input.trim() : "";

    if (!input) {
      return NextResponse.json({ error: "Missing input." }, { status: 400 });
    }

    const id = extractArxivId(input);
    if (!id) {
      return NextResponse.json(
        { error: "Could not parse arXiv ID from input." },
        { status: 400 }
      );
    }

    const meta = await fetchArxivMetadata(id);
    if (!meta) {
      return NextResponse.json(
        { error: "Could not fetch metadata from arXiv." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      arxivId: meta.id,
      title: meta.title,
      summary: meta.summary,
      url: meta.url
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unexpected error while looking up arXiv metadata." },
      { status: 500 }
    );
  }
}
