import axios from "axios";

export const uploadPdf = async (file: File) => {
  try {
    const res = await axios.post("/api/pdf-reader-upload", file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
