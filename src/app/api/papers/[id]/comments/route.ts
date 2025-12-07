import { NextResponse } from "next/server";

interface RouteContext {
  params: { id: string };
}

export async function POST(request: Request, context: RouteContext) {
  return NextResponse.json(
    { 
      error: "Backend API not yet deployed. Please deploy the microservices to enable this feature.",
      details: "Check the VERCEL-DEPLOYMENT-GUIDE.md for next steps"
    },
    { status: 503 }
  );
}
