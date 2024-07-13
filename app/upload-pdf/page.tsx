"use client";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { uploadPdf, vectorizeChunks } from "../fetch/FetchData";
import Button from "../component/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import fetchData from "../api/function/groq/Groq";
import Markdown from "markdown-to-jsx";
import { Viewer, Worker } from "@react-pdf-Viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function Page() {
  const [pdfUpload, setPdfUpload] = useState<any>(null);
  const [fileName, setFileName] = useState("");
  const [input, setInput] = useState("");
  const [pdfId, setPdfId] = useState(null);
  const [answer, setAnswer] = useState("");
  const [pdfFile, setPdfFile] = useState("");
  const [answers, setAnswers] = useState<{ chat: any; type: string }[]>([]);
  const [arrayChat, setArrayChat] = useState<{ chat: any; type: string }[]>([]);
  const [question, setQuestion] = useState<{ chat: any; type: string }[]>([]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      console.log("Selected file:", file);
      let reader = new FileReader();
      console.log(reader);
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        setPdfFile(e.target?.result);
      };
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

    let theAnswer = "";
    const handleChunk = (chunk: string) => {
      console.log("Received chunk:", chunk);
      theAnswer += chunk;
      // setAnswer(theAnswer); // Update the state here
    };

    const handleError = (error: any) => {
      console.error("Error:", error);
    };

    console.log("vector chatnya", res.data.datanya);
    await fetchData(input, handleChunk, handleError, res.data.datanya).then(
      (response: any) => {
        console.log("Fetch data complete:", response);
        setAnswers((prev) => [...prev, { chat: response, type: "answer" }]);
      }
    );
    setQuestion((prev) => [...prev, { chat: input, type: "question" }]);
    setInput("");
    return res;
  };

  useEffect(() => {
    const combinedArray = [];
    const maxLength = Math.max(question.length, answers.length);

    for (let i = 0; i < maxLength; i++) {
      if (i < question.length) {
        combinedArray.push({ chat: question[i], type: "question" });
      }
      if (i < answers.length) {
        combinedArray.push({ chat: answers[i], type: "answer" });
      }
    }

    setArrayChat(combinedArray.reverse());
  }, [question, answers]);

  const newplugin = defaultLayoutPlugin();

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
      <div className="w-[40%] bg-yellow-200">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.15.139/build/pdf.worker.min.js">
          {pdfFile && (
            <>
              <Viewer fileUrl={pdfFile} plugins={[newplugin]} />
            </>
          )}
          {!pdfFile && <>No PDF</>}
        </Worker>
      </div>
      <div className="w-[40%] bg-white py-[2rem] flex flex-col ">
        <div className="flex-grow px-[1rem] overflow-y-scroll scrollbar-thin scrollbar-track-[#F5F8FA] scrollbar-thumb-black py-[1rem] dark:scrollbar-track-[#0F0F0F] dark:border-[#0F0F0F]">
          <div className="leading-3" />
          <div className="flex-col-reverse flex">
            {arrayChat.map((item, key) => (
              <div
                key={key}
                className={`${
                  item.chat.type === "question"
                    ? "p-[1.5rem] flex items-end justify-end w-full"
                    : ""
                }`}
              >
                <div
                  className={`${
                    item.chat.type === "question"
                      ? "w-full flex items-end justify-end"
                      : ""
                  }`}
                >
                  <div
                    className={`${
                      item.chat.type === "question"
                        ? "flex items-end justify-end p-[1rem] bg-[#ECECEC] rounded-md"
                        : "p-[1rem]"
                    }`}
                  >
                    {item.chat.type !== "answer" ? (
                      <p>{item.chat.chat}</p>
                    ) : (
                      // <div className="whitespace-pre-wrap">
                      <article className="prose prose-li:text-[.5rem] prose-h1:center prose-p:text-[.5rem] prose lg:prose-xl max-w-5xl mx-auto prose-headings:text-[.5rem] prose-tr:text-[.5rem] prose-th:bg-blue-200 prose-th:p-[.5rem] prose-td:border-[1px] prose-td:p-[.5rem] prose-h1:hidden">
                        {item.chat.chat}
                      </article>
                      // <div className="whitespace-pre-wrap">
                      //   {item.chat.chat}
                      // </div>
                      // </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#F4F4F4] px-[1rem] h-[2.5rem] flex rounded-full mx-[1.5rem] relative ">
          <input
            type="text"
            className="w-full py-[.5rem] px-[.5rem] bg-[#F4F4F4] focus:outline-none focus:ring-0"
            value={input}
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
