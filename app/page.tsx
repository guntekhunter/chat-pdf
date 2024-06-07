"use client";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [pdf, setPdf] = useState();
  const fetchPdf = async () => {
    const res = await axios.get("/api/pdf-parse");
    setPdf(res.data.response);
  };
  const fetchVectors = async () => {
    const res = await axios.get("/api/embed");
    setPdf(res.data.response);
  };

  useEffect(() => {
    fetchPdf();
    fetchPdf();
  }, []);

  return <div>{pdf}</div>;
}
