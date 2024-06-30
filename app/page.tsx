"use client";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";

export default function Home() {
  const [pdfData, setPdfData] = useState();
  const [pdfUpload, setPdfUpload] = useState();
  const [embedData, setEmbedData] = useState();
  const [vector, setVector] = useState();
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File>();
  const [inputData, setInputData] = useState<string | ArrayBuffer | null>(null);
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

  console.log(vector);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // setFile(file)
      console.log("Selected file:", file);
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/api/pdf-reader-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setPdfUpload(res.data.response);
    }
  };

  const createParse = async () => {
    console.log("Selected file:", file);
    const res = await axios.post("/api/pdf-reader-upload", file);
    console.log(res);
  };

  return (
    <div>
      {embedData}
      <input type="text" onChange={(e) => setInput(e.target.value)} />
      <input type="file" onChange={handleFileChange} />
      <button onClick={createParse}>Click</button>
      <button onClick={createTable}>Click</button>
      <button onClick={compare} className="bg-red-200">
        Clicknya
      </button>
    </div>
  );
}
