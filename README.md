# 📘 PDF Q&A Assistant

A **retrieval-augmented Q&A system over PDFs** powered by [LangChain](https://js.langchain.com/), [Google Generative AI (Gemini)](https://ai.google/), and [pdf-parse](https://www.npmjs.com/package/pdf-parse).

This project lets you:
- Parse PDF documents 📄
- Split them into manageable chunks ✂️
- Store them in a vector store (in-memory) for semantic search 🔎
- Query the document with natural language questions 💬
- Get AI-powered answers from Gemini based on retrieved context ⚡

---

## 🚀 Features
- PDF parsing using **pdf-parse**
- Chunking text with **LangChain RecursiveCharacterTextSplitter**
- Embedding & semantic retrieval using **Google Generative AI Embeddings**
- Conversational Q&A with **ChatGoogleGenerativeAI**
- Interactive CLI for asking multiple questions

---

## 📂 Project Structure

├── data/
  - │ └── sample.pdf # Sample PDF for testing
  - ├── index.js # Main code
  - ├── package.json
  - ├── .env # Environment variables (Google API Key)
  - └── README.md

## 🔧 Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/Rahulpaswan461/PDF-Q-A-Assistant
   cd pdf-qa-assistant

2. Install dependencies
    - npm install
3. Set up environment variables
    - Create a .env file in the root of the project:
    - GOOGLE_API_KEY=your_google_genai_api_key

5. Add a PDF to the data/ folder
   -  /data/sample.pdf

▶️ Usage
 - Run the assistant:
 - npm start


⚡ Tech Stack
 - Node.js – Runtime
 - LangChain.js – Document splitting, embeddings, retrieval
 - Google Generative AI – Embeddings + Chat model (Gemini)
 - pdf-parse – PDF text extraction

 🛠 Future Improvements
 - Support for multiple PDFs
 - Persistent vector store (e.g., Pinecone, Weaviate, FAISS)
 - Web-based UI instead of CLI
 - Summarization mode

## 🧩 System Architecture

```mermaid
flowchart TD
    A[📄 PDF File] --> B[🔍 Extract Text with pdf-parse]
    B --> C[✂️ Split Text with RecursiveCharacterTextSplitter]
    C --> D[🔢 Generate Embeddings with Google Generative AI]
    D --> E[🧠 Memory Vector Store]
    E --> F[🔎 Retrieve Relevant Chunks]
    F --> G[🤖 ChatGoogleGenerativeAI]
    G --> H[💬 Answer to User Question]

📜 License
MIT License. Feel free to fork and modify!
