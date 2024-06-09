"use client";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [pdfData, setPdfData] = useState();
  const [embedData, setEmbedData] = useState();
  const [vector, setVector] = useState();
  const fetchPdf = async () => {
    const res = await axios.get("/api/pdf-parse");
    setPdfData(res.data.response);
    return res.data.response;
  };
  const fetchVectors = async () => {
    const res = await axios.post("/api/embed", { pdf: pdfData });
    console.log(res.data);
    setEmbedData(res.data.response);
    setVector(res.data);
    return res.data.response;
  };
  const createTable = async () => {
    const data1 = await fetchPdf();
    const data2 = await fetchVectors();
    console.log(data1);
    console.log(data2);
    const res = await axios.post("/api/post-supabase", {
      pdf: data1,
      vector: data2,
    });
    console.log(res.data);
    // setEmbed(res.data.response);
  };

  console.log(vector);

  useEffect(() => {
    createTable();
  }, []);

  return <div>{embedData}</div>;
}
