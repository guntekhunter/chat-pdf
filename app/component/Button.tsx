import React from "react";

export default function Button(props: any) {
  return (
    <button
      onClick={props.onClick}
      className={`rounded-md bg-[#0B1215] py-[.3rem] px-[2rem] text-white ${props.className} w-full`}
    >
      {props.children}
    </button>
  );
}
