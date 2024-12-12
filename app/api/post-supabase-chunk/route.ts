import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const supabaseClient = createClient(
  // "https://lzhroqglyjdgqotwhnmt.supabase.co",
  "https://rwlpznxmstymuqxyyvcz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3bHB6bnhtc3R5bXVxeHl5dmN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2MjU0MTAsImV4cCI6MjA0OTIwMTQxMH0.ZK_Ohs4FsKNlBZ_O0EhIQLK1JW3Lp84JMbGxv_nOdfM"
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6aHJvcWdseWpkZ3FvdHdobm10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2MjQwNjQsImV4cCI6MjA0OTIwMDA2NH0.5T0uKA1yiEo9vAuLhowUmPJIcs4vvavZXQTsJ2tDLKc"
);

export async function POST(req: NextRequest, res: NextResponse) {
  const reqBody = await req.json();
  const pdf = reqBody.pdf;
  const requestId = uuidv4();

  try {
    const dataToInsert = pdf.data.response.map((item: any) => ({
      // id: requestId,
      content: item.text,
      embedding: item.vectors,
    }));
    const { error } = await supabaseClient
      .from("documents")
      .insert(dataToInsert);

    if (error) throw error;

    return NextResponse.json({
      response: "success",
      vector: pdf,
      id: requestId,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      response: "error",
      message: error,
    });
  }
}
