import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractArxivId } from "@/lib/arxiv";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const title =
      typeof body.title === "string" ? body.title.trim().slice(0, 500) : "";
    const abstractText =
      typeof body.abstract === "string"
        ? body.abstract.trim().slice(0, 8000)
        : "";
    const url =
      typeof body.url === "string" ? body.url.trim().slice(0, 2000) : null;
    const arxivInput =
      typeof body.arxivInput === "string" ? body.arxivInput.trim() : null;
    const authorName =
      typeof body.authorName === "string"
        ? body.authorName.trim().slice(0, 200)
        : null;
    const summary =
      typeof body.summary === "string"
        ? body.summary.trim().slice(0, 8000)
        : "";
    const intuition =
      typeof body.intuition === "string"
        ? body.intuition.trim().slice(0, 8000)
        : "";
    const technical =
      typeof body.technical === "string"
        ? body.technical.trim().slice(0, 8000)
        : null;
    const codeUrl =
      typeof body.codeUrl === "string"
        ? body.codeUrl.trim().slice(0, 2000)
        : null;

    if (!title || !abstractText) {
      return NextResponse.json(
        { error: "Title and abstract are required." },
        { status: 400 }
      );
    }

    if (!summary || !intuition) {
      return NextResponse.json(
        { error: "Summary and intuition are required." },
        { status: 400 }
      );
    }

    const arxivId = arxivInput ? extractArxivId(arxivInput) : null;

    const paper = await prisma.paper.create({
      data: {
        title,
        abstract: abstractText,
        url: url || (arxivId ? `https://arxiv.org/abs/${arxivId}` : ""),
        arxivId: arxivId,
        submittedBy: authorName,
        explanations: {
          create: {
            authorName,
            summary,
            intuition,
            technical,
            codeUrl
          }
        }
      }
    });

    return NextResponse.json({ paperId: paper.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unexpected error while creating paper." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const papers = await prisma.paper.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        explanations: true,
        comments: true
      }
    });

    return NextResponse.json({ papers });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unexpected error while fetching papers." },
      { status: 500 }
    );
  }
}
