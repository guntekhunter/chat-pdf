"use client";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { uploadPdf, vectorizeChunks } from "../fetch/FetchData";
import Button from "../component/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function page() {
  const [pdfUpload, setPdfUpload] = useState<any>();
  const [fileName, setFileName] = useState("");
  const [input, setInput] = useState("");
  const [pdfId, setPdfId] = useState();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      console.log("Selected file:", file);
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/api/pdf-reader-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = await vectorizeChunks(res.data.chunks);
      setPdfUpload(data);
    }
  };

  const uploadToSupabase = async () => {
    console.log(pdfUpload.data.response);
    try {
      const res = await axios.post("/api/post-supabase-chunk", {
        pdf: pdfUpload,
      });
      setPdfId(res?.data.id);
    } catch (error) {
      console.error("Error uploading to Supabase:", error);
    }
  };

  const compare = async () => {
    const res = await axios.post("/api/compare", {
      input,
      pdfId,
    });
    console.log("vector chatnya", res.data.response);
    return res;
  };
  return (
    <div className="bg-red-200 flex text-[.8rem] h-[100vh]">
      <div className="w-[20%] bg-[#F8F8F8] p-[1rem] space-y-[1rem]">
        <div className="px-[1rem]">
          <p className="text-[#949494]">Fitur Lainnya</p>
        </div>
        <div className="px-[1rem]">
          <p className="text-black font-medium">Buat Daftar Pustaka</p>
        </div>
        <div className="bg-[#ECECEC] px-[1rem] py-[.5rem] rounded-md">
          <p className="text-black font-medium">Chat PDF</p>
        </div>
        <div className="w-full h-[5rem] rounded-[1rem] border-dashed border-[2px] flex items-center justify-center relative">
          <input
            type="file"
            onChange={handleFileChange}
            className="absolute opacity-0 w-full h-full cursor-pointer"
          />
          {fileName ? (
            <div className="text-black font-medium p-2 rounded flex justify-center content-center">
              {fileName}
            </div>
          ) : (
            <div className="text-black font-medium p-2 rounded flex justify-center content-center">
              Drop File Atau Klik Disini
            </div>
          )}
        </div>
        <Button onClick={uploadToSupabase} className="w-full">
          Mulai Chat
        </Button>
      </div>
      <div className="w-[40%] bg-yellow-200">dua</div>
      <div className="w-[40%] bg-white py-[2rem] flex flex-col ">
        <div className="flex-grow"></div>
        <div className="bg-[#F4F4F4] px-[1rem] h-[2.5rem] flex rounded-full mx-[1.5rem] relative ">
          <input
            type="text"
            className="w-full py-[.5rem] px-[.5rem] bg-[#F4F4F4] focus:outline-none focus:ring-0"
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex justify-center items-center h-full absolute right-[.5rem]">
            <button
              className="bg-[#D9D9D9] w-[1.5rem] h-[1.5rem] rounded-full"
              onClick={compare}
            ></button>
          </div>
        </div>
      </div>
    </div>
  );
}
