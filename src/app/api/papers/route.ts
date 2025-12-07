import { NextResponse } from "next/server";

export async function POST(request: Request) {
  return NextResponse.json(
    { 
      error: "Backend API not yet deployed. Please deploy the microservices to enable this feature.",
      details: "Check the VERCEL-DEPLOYMENT-GUIDE.md for next steps"
    },
    { status: 503 }
  );
}

export async function GET() {
  return NextResponse.json(
    { 
      papers: [],
      message: "Backend API not yet deployed. Please deploy the microservices to enable this feature.",
      details: "Check the VERCEL-DEPLOYMENT-GUIDE.md for next steps"
    },
    { status: 503 }
  );
}
