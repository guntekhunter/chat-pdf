import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseClient = createClient(
  "https://puuxxlofycwueeuxgycm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1dXh4bG9meWN3dWVldXhneWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc4MjAwNDYsImV4cCI6MjAzMzM5NjA0Nn0.PfuPRmukJ2FrneHKSxaqXy693WtnptE2rv9U6qNOkZw"
);

export async function POST(req: NextRequest, res: NextResponse) {
  const reqBody = await req.json();
  const pdf = reqBody.pdf;
  const embedding = reqBody.vector;
  try {
    const supabaseResponse = await supabaseClient.from("documents").insert({
      content: `${pdf}`,
      embedding,
    });

    return NextResponse.json({
      response: supabaseResponse,
      vector: embedding,
    });
  } catch (error) {
    console.log(error);
  }
}
