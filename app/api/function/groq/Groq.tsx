// fetchData.ts
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const fetchData = (
  inputText: string,
  callback: (chunk: string) => void,
  onError: (error: any) => void,
  context: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Create prompt
      const promptTemplate = `Kamu adalah asisten AI yang akan menjawab pertanyaan berdasarkan konteks yang diberikan. Jika kamu kurang mengerti dengan konteksnya, minta informasi yang lebih jelas.\n\nContext section: ${context}\n\nPertanyaan: "${inputText}"`;
      const model = new ChatGroq({
        apiKey: "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",
      });

      const prompt = ChatPromptTemplate.fromMessages([
        [
          "system",
          "Kamu adalah asisten yang bisa menjawab dalam bahasa indonesia semua pertanyaan berdasarkan context yang diberikan. Buat semua jawabanmu dalam bentuk markup languange",
        ],
        ["human", promptTemplate],
      ]);

      const outputParser = new StringOutputParser();
      const chain = prompt.pipe(model).pipe(outputParser);

      const responseStream = await chain.stream({
        input: inputText,
      });

      let res = "";
      for await (const item of responseStream) {
        res += item;
        callback(item); // Callback for each chunk of data
      }
      resolve(res);
    } catch (error) {
      onError(error); // Callback for error handling
      reject(error);
    }
  });
};

export default fetchData;
