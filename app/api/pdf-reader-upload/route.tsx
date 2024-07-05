import { NextResponse, type NextRequest } from "next/server";
import { writeFile } from "fs/promises";
import fs from "fs";
import pdf from "pdf-parse";
import path from "path";

// Function to chunk text with overlap
function chunkText(
  text: string,
  chunkSize = 2000,
  overlapSize = 500
): string[] {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end);
    chunks.push(chunk);
    start += chunkSize - overlapSize;
  }

  return chunks;
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a directory if it doesn't exist
    const tempDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const tempFilePath = path.join(tempDir, file.name);

    // Save the file to the filesystem
    await writeFile(tempFilePath, buffer);

    // Read and parse the PDF file
    const dataBuffer = fs.readFileSync(tempFilePath);
    const pdfData = await pdf(dataBuffer);

    // Clean up the temp file
    fs.unlinkSync(tempFilePath);

    // Chunk the PDF text
    let pdfText = pdfData.text;
    const chunks = chunkText(pdfText);

    return NextResponse.json({
      response: pdfData.text,
      chunks,
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
