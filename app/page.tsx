"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [pdfData, setPdfData] = useState();
  const [embedData, setEmbedData] = useState();
  const [vector, setVector] = useState();
  const [input, setInput] = useState("");
  const [inputData, setInputData] = useState();
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
      pdf: data1,
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

  return (
    <div>
      {embedData}
      <input type="text" onChange={(e) => setInput(e.target.value)} />
      <button onClick={createTable}>Click</button>
      <button onClick={compare} className="bg-red-200">
        Clicknya
      </button>
    </div>
  );
}
