import { NextResponse, type NextRequest } from "next/server";
import fs from "fs";
import pdf from "pdf-parse";
import path from "path";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const pdfPath = path.resolve(process.cwd(), "app/ommaleka.pdf");
    console.log(pdfPath);
    let dataBuffer = fs.readFileSync(pdfPath);

    const data = await pdf(dataBuffer);
    return NextResponse.json({
      response: data.text,
    });
  } catch (error: any) {
    console.error("Error parsing PDF:", error);
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
