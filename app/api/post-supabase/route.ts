import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseClient = createClient(
  "https://ijevkvvdhwlnycjqbsln.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqZXZrdnZkaHdsbnljanFic2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2MjAzMzAsImV4cCI6MjA0OTE5NjMzMH0.fVlQ_uN_Q34VkiKJ1ge34w2GuDBfFMGczJ6ZarEJdUU"
);

export async function POST(req: NextRequest, res: NextResponse) {
  const reqBody = await req.json();
  const pdf = reqBody.pdf;
  const embedding = reqBody.vector;
  try {
    await supabaseClient.from("documents").insert({
      content: `${pdf}`,
      embedding,
    });

    return NextResponse.json({
      response: "success",
      vector: embedding,
    });
  } catch (error) {
    console.log(error);
  }
}
