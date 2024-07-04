"use client";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { uploadPdf, vectorizeChunks } from "../fetch/FetchData";
import Button from "../component/Button";
import { useRouter, useSearchParams } from "next/navigation";

export default function page() {
  const searchParams = useSearchParams();
  //   const newParams = searchParams.get("data".toString);
  const data = searchParams.get("data");
  useEffect(() => {
    if (data) {
      console.log(data);
      // If you need to parse the data as JSON:
      // const parsedData = JSON.parse(data);
      // console.log(parsedData);
    }
  }, [data]);

  return (
    <div className="bg-[#F8F8F8] w-full flex justify-center py-[2rem] text-[#0B1215] h-[100vh]">
      <div className="w-[70%] bg-white rounded-md px-[3rem] py-[4rem] text-center flex justify-center align-center">
        <div className="w-[60%] space-y-[1rem]">
          <h1 className="font-bold text-[2rem]">Masukkan PDF Mu</h1>
          <div className="w-full h-[10rem] rounded-[1rem] border-dashed border-[2px] flex items-center justify-center relative">
            {/* {data} */}
          </div>
        </div>
      </div>
    </div>
  );
}
