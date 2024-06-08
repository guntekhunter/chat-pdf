"use client";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [pdf, setPdf] = useState();
  const [embed, setEmbed] = useState();
  const fetchPdf = async () => {
    const res = await axios.get("/api/pdf-parse");
    setPdf(res.data.response);
  };
  const fetchVectors = async () => {
    const res = await axios.post("/api/embed", {pdf});
    console.log(res.data)
    setEmbed(res.data.response);
  };
  console.log(embed)

  useEffect(() => {
    fetchPdf();
    fetchVectors();
  }, []);

  return <div>{embed}</div>;
}
