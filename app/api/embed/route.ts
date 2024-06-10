import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
// import { createClient } from "@supabase/supabase-js";

// const supabaseClient = createClient('https://puuxxlofycwueeuxgycm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1dXh4bG9meWN3dWVldXhneWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc4MjAwNDYsImV4cCI6MjAzMzM5NjA0Nn0.PfuPRmukJ2FrneHKSxaqXy693WtnptE2rv9U6qNOkZw');

export async function POST(req: NextRequest, res: NextResponse) {
  const reqBody = await req.json();
  const pdf = reqBody.pdf;
  try {
    const hf = new HfInference(process.env.HF_TOKEN);
    const vectors = await hf.featureExtraction({
      model: "ggrn/e5-small-v2",
      inputs: `${pdf}`,
    });

    return NextResponse.json({
      response: vectors,
    });
  } catch (error) {
    console.log(error);
  }
}
