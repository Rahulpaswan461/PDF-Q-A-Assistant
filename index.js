import 'dotenv/config';
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import fs from 'fs';
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import readline from "readline";

// 1. Extract PDF content once
async function getPdfContent(pdfPath) {
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdf = await pdfParse(dataBuffer);
    return pdf.text;
}

// 2. Allocate resources (only once)
async function setupRetriever() {
    const pdfContent = await getPdfContent("./data/sample.pdf");

    // Split into chunks
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200
    });

    const pdfs = await splitter.splitDocuments([
        new Document({
            pageContent: pdfContent,
            metadata: { source: 'sample.pdf' }
        })
    ]);

    // Create vector store (once)
    const vectorStore = await MemoryVectorStore.fromDocuments(
        pdfs,
        new GoogleGenerativeAIEmbeddings({ apiKey: process.env.GOOGLE_API_KEY })
    );

    console.log("✅ PDF loaded, chunks created, embeddings stored.");
    return vectorStore.asRetriever();
}

// 3. Answer questions using retriever
async function answerQuestion(question, retriever) {
    const result = await retriever.getRelevantDocuments(question);

    const context = result
        .map((doc, index) => `${index + 1}. ${doc.pageContent}`)
        .join("\n");

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
    console.log("\n📌 Answer:", response.content, "\n");
}

// 4. CLI interaction
async function startCLI() {
    const retriever = await setupRetriever();

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
                await answerQuestion(question, retriever);
                askQuestion(); // continue loop
            }
        });
    }

    askQuestion();
}

startCLI();
