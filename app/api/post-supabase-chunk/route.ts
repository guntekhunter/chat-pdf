import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from 'uuid';

const supabaseClient = createClient(
  "https://puuxxlofycwueeuxgycm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1dXh4bG9meWN3dWVldXhneWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc4MjAwNDYsImV4cCI6MjAzMzM5NjA0Nn0.PfuPRmukJ2FrneHKSxaqXy693WtnptE2rv9U6qNOkZw"
);

export async function POST(req: NextRequest, res: NextResponse) {
  const reqBody = await req.json();
  const pdf = reqBody.pdf;
  const requestId = uuidv4(); 
  
  try {
    const dataToInsert = pdf.data.response.map((item: any) => ({
        pdf_id: requestId,
        content: item.text,
        embedding: item.vectors,
      }));
    const { error } = await supabaseClient.from("documents").insert(dataToInsert);

    if (error) throw error;

    return NextResponse.json({
      response: "success",
      vector: pdf,
      id: requestId
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      response: "error",
      message: error,
    });
  }
}
