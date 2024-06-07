import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const hf = new HfInference(process.env.HF_TOKEN);
    const vectors = await hf.featureExtraction({
      model: "intfloat/e5-small-v2",
      inputs: "That is a happy person",
    });
    return NextResponse.json({
      response: vectors,
    });
  } catch (error) {
    console.log(error);
  }
}
