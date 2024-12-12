import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { createClient } from "@supabase/supabase-js";

const supabaseClient = createClient(
  "https://ijevkvvdhwlnycjqbsln.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqZXZrdnZkaHdsbnljanFic2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2MjAzMzAsImV4cCI6MjA0OTE5NjMzMH0.fVlQ_uN_Q34VkiKJ1ge34w2GuDBfFMGczJ6ZarEJdUU"
);

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const reqBody = await req.json();
    const input = reqBody.input;
    // const pdfId = reqBody.pdf_id;

    const hf = new HfInference(process.env.HF_TOKEN);
    const inputVectors = await hf.featureExtraction({
      model: "ggrn/e5-small-v2",
      inputs: `${input}`,
    });
    //find the same data with the database and the input

    const { data: documents, error } = await supabaseClient.rpc(
      "match_documents",
      {
        query_embedding: inputVectors,
        match_threshold: 0.75,
        match_count: 3,
      }
    );

    //declare the varible
    let contentText = "";
    // let id = "";

    //looping trought the database data for the same vectors comparing data
    if (!documents) {
      console.error("No documents returned");
      return NextResponse.json({ error: "No matching documents found" });
    } else {
      for (let i = 0; i < documents.length; i++) {
        const document = documents[i];
        const content = document.content;
        contentText = `${content.trim()}---\n`;
      }
    }

    // //create prompt
    // const promptTemplate = `kamu adalah asisten ai yang mengetahui segalanya

    // Context section: ${contentText} pertanyaan: """${input}"""`;
    // // ask ai using groq api

    // const model = new ChatGroq({
    //   apiKey: process.env.GROQ_API_KEY,
    // });

    // const prompt = ChatPromptTemplate.fromMessages([
    //   ["system", "You are a helpful assistant"],
    //   ["human", promptTemplate],
    // ]);

    // const outputParser = new StringOutputParser();
    // const chain = prompt.pipe(model).pipe(outputParser);

    // const responseStream = await chain.stream({
    //   input: input,
    // });

    // let res = "";
    // for await (const item of responseStream) {
    //   res += item;
    // }

    return NextResponse.json({
      // response: res,
      datanya: input,
      inpuvector: inputVectors,
      // document: documents.length,
      // contentText,
      error,
    });
  } catch (error) {
    console.log(error);
  }
}
