import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: { id: string };
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const id = Number(context.params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid paper ID." }, { status: 400 });
    }

    const body = await request.json();
    const authorName =
      typeof body.authorName === "string"
        ? body.authorName.trim().slice(0, 200)
        : null;
    const content =
      typeof body.content === "string"
        ? body.content.trim().slice(0, 2000)
        : "";

    if (!content) {
      return NextResponse.json(
        { error: "Comment content is required." },
        { status: 400 }
      );
    }

    // Ensure the paper exists (basic protection)
    const paper = await prisma.paper.findUnique({
      where: { id }
    });
    if (!paper) {
      return NextResponse.json({ error: "Paper not found." }, { status: 404 });
    }

    const newComment = await prisma.comment.create({
      data: {
        paperId: id,
        authorName,
        content
      }
    });

    return NextResponse.json({
      comment: {
        id: newComment.id,
        authorName: newComment.authorName,
        content: newComment.content,
        createdAt: newComment.createdAt.toISOString()
      }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unexpected error while creating comment." },
      { status: 500 }
    );
  }
}
