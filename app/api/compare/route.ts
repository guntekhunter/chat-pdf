import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { createClient } from "@supabase/supabase-js";

const supabaseClient = createClient(
  "https://puuxxlofycwueeuxgycm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1dXh4bG9meWN3dWVldXhneWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc4MjAwNDYsImV4cCI6MjAzMzM5NjA0Nn0.PfuPRmukJ2FrneHKSxaqXy693WtnptE2rv9U6qNOkZw"
);

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const reqBody = await req.json();
    const input = reqBody.input;
    const vector = reqBody.vector;

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
        match_threshold: 0.73,
        match_count: 10,
      }
    );

    //declare the varible
    let contentText = "";

    //looping trought the database data for the same vectors comparing data
    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];
      const content = document.content;

      contentText = `${content.trim()}---\n`;
    }

    //create prompt
    const promptTemplate = `kamu adalah asisten ai yang mengetahui segalanya
    
    Context section: ${contentText} pertanyaan: """${input}"""`;
    // ask ai using groq api

    const model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a helpful assistant"],
      ["human", promptTemplate],
    ]);

    const outputParser = new StringOutputParser();
    const chain = prompt.pipe(model).pipe(outputParser);

    const responseStream = await chain.stream({
      input: input,
    });

    let res = "";
    for await (const item of responseStream) {
      res += item;
    }

    return NextResponse.json({
      response: res,
      datanya: contentText,
    });
  } catch (error) {
    console.log(error);
  }
}
