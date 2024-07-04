"use client";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { uploadPdf, vectorizeChunks } from "../fetch/FetchData";
import Button from "../component/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PdfResponse {
  response: Array<{
    text: string;
    vectors: number[];
  }>;
}

export default function page() {
  const [pdfData, setPdfData] = useState();
  const [pdfUpload, setPdfUpload] = useState<any>();
  const [fileName, setFileName] = useState("");
  const [embedData, setEmbedData] = useState();
  const [vector, setVector] = useState();
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File>();
  const [inputData, setInputData] = useState<string | ArrayBuffer | null>(null);

  const route = useRouter();

  const fetchPdf = async () => {
    const res = await axios.get("/api/pdf-parse");
    setPdfData(res.data.response);
    return res.data.response;
  };
  const fetchVectors = async (pdfContent: any) => {
    const dataPdf = await fetchPdf();
    const res = await axios.post("/api/embed", { pdf: pdfContent });
    console.log(res.data);
    setEmbedData(res.data.response);
    setVector(res.data);
    return res.data.response;
  };
  const createTable = async () => {
    const data1 = await fetchPdf();
    const data2 = await fetchVectors(data1);
    console.log(data1);
    console.log(data2);
    const res = await axios.post("/api/post-supabase", {
      pdf: pdfUpload,
      vector: data2,
    });
    console.log(res.data);
  };

  const compare = async () => {
    const res = await axios.post("/api/compare", {
      input,
      vector: embedData,
    });
    console.log("vector chatnya", res.data.response);
    return res;
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFile(e.target.files[0]);
      console.log("Selected file:", file);
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/api/pdf-reader-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = await vectorizeChunks(res.data.chunks);
      console.log(data);
      setPdfUpload(data);
    }
  };

  const createParse = async () => {
    console.log(file);
    if (!file) {
      console.error("No file selected");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    const res = uploadPdf(file);
    console.log(res);
  };

  const uploadToSupabase = async () => {
    console.log(pdfUpload.data.response);
    try {
      const res = await axios.post("/api/post-supabase-chunk", {
        pdf: pdfUpload,
        // vector: ,
      });
      console.log("Response:", res.data);
    } catch (error) {
      console.error("Error uploading to Supabase:", error);
    }
  };
  return (
    <div className="bg-[#F8F8F8] w-full flex justify-center py-[2rem] text-[#0B1215] h-[100vh]">
      <div className="w-[70%] bg-white rounded-md px-[3rem] py-[4rem] text-center flex justify-center align-center">
        <div className="w-[60%] space-y-[1rem]">
          <h1 className="font-bold text-[2rem]">Masukkan PDF Mu</h1>
          <div className="w-full h-[10rem] rounded-[1rem] border-dashed border-[2px] flex items-center justify-center relative">
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute opacity-0 w-full h-full cursor-pointer bg-black"
            />
            {fileName ? (
              <div className="bg-black text-white p-2 rounded flex justify-center content-center">
                {fileName}
              </div>
            ) : (
              <div className="bg-black text-white p-2 rounded flex justify-center content-center">
                Drop Atau Klik Disini
              </div>
            )}
          </div>
          <Button onClick={uploadToSupabase}>Mulai Chat</Button>
        </div>
      </div>
    </div>
  );
}
