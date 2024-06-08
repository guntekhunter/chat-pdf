import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
import { SupabaseClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest, res: NextResponse) {
  const reqBody = await req.json();
  const pdf = reqBody.pdf;
  try {
    const hf = new HfInference(process.env.HF_TOKEN);
    const vectors = await hf.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: `${pdf}`,
      });

    // const final = await SupabaseClient.from(pdf).insert({
    //   content : pdf,
    //   embedding: vectors
    // })
    return NextResponse.json({
      response: vectors,
    });
  } catch (error) {
    console.log(error);
  }
}
