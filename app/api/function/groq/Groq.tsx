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
      //create prompt
      const promptTemplate = `kamu adalah asisten ai yang mengetahui segalanya
    
    Context section: ${context} pertanyaan: """${inputText}"""`;
      // ask ai using groq api

      const model = new ChatGroq({
        apiKey: "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",
      });

      const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a helpful assistant"],
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
