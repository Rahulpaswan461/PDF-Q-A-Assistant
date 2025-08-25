import 'dotenv/config';
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import fs from 'fs';
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import readline from "readline";

async function getPdfContent(pdfPath) {
    const dataBuffer = fs.readFileSync(pdfPath); // Remove 'utf8'
    const pdf = await pdfParse(dataBuffer);
    return pdf.text;
}


async function allocateResources() {
    const pdfContent = await getPdfContent("./data/sample.pdf")

    // divide into chunks: 
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200
    })
   
     //
    const pdfs = await splitter.splitDocuments([
        new Document({
            pageContent: pdfContent,
            metadata: { source: 'sample.pdf' }
        })
    ])

    //creating the vecto store

    const vectorStore = await MemoryVectorStore.fromDocuments(
        pdfs,
        new GoogleGenerativeAIEmbeddings({ apiKey: process.env.GOOGLE_API_KEY })
    );
    return vectorStore.asRetriever();
}

async function main(question) {
    const retriever = await allocateResources()
    const result = await retriever.getRelevantDocuments(question)

    const context = result.map((doc, index) => `${index + 1}. ${doc.pageContent}`).join("\n");

    const prompt = `You are a helpful assistant. Use the context below to answer the question:
        
        Context:
        ${context}

        Question: ${question}
        `;

    const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.0-flash",
        temperature: 0,
        apiKey: process.env.GOOGLE_API_KEY
    });

    const response = await model.invoke(prompt);
    console.log(response.content);
}

function executeUserQuery() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function askQuestion() {
    rl.question("Enter your question (or type 'exit' to quit): ", async (question) => {
      if (question.toLowerCase() === "exit") {
        rl.close();
        process.exit(0);
      } else {
        await main(question);  // wait for model response
        askQuestion(); // ask again after finishing
      }
    });
  }

  askQuestion();
}

executeUserQuery();

