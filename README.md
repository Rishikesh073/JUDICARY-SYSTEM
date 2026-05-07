# LexAgent — Your Autonomous Junior Legal Clerk

LexAgent is a high-fidelity, premium legal research platform designed to fast-track the workflow of advocates and judges. It uses a sophisticated multi-agent pipeline to scan legal precedents, analyze complex queries, and generate court-ready memorandums in seconds.

## 🚀 Key Features
- **Agentic Search**: A 5-step pipeline that parses intent, retrieves specific precedents, and filters for high-accuracy results.
- **Premium Legal Aesthetic**: A dark obsidian theme with burnt orange accents, optimized for professional legal environments.
- **Live Workspace**: Interactive research interface with real-time status indicators.
- **Case Explorer**: Tabular view for browsing high-profile judgments (2025 onwards).
- **One-Click Export**: Download synthesized memos as professionally formatted PDFs.
- **Fasttrack AI Engine**: Powered by **Llama 3.2 (3B)** for ultra-fast local inference.

## 🛠 Tech Stack
- **Frontend**: React, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons.
- **Backend**: Node.js (Express) as an orchestration bridge.
- **AI Engine**: FastAPI, LangChain, ChromaDB (Vector Store), Ollama.
- **Data**: 2025 Supreme Court judgments with cloud-hosted original PDF links.

## 🏁 Getting Started

### Prerequisites
To run the AI Engine locally, you must install and configure Ollama:
1. **Install Ollama**: Download and install Ollama from [ollama.com](https://ollama.com/). It must be running in the background while using LexAgent.
2. **Download the Model**: Open your terminal/command prompt and download the required Llama 3.2 model by running:
   ```bash
   ollama pull llama3.2
   ```
*(Note: No separate embedding model download is required via Ollama; ChromaDB will download the embedding model automatically via Python).*

### Installation
1. **Clone the repo**:
   ```bash
   git clone https://github.com/Rishikesh073/JUDICARY-SYSTEM.git
   cd JUDICARY-SYSTEM
   ```

2. **Setup Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Setup Backend (Bridge)**:
   ```bash
   cd ../backend
   npm install
   node server.js
   ```

4. **Setup AI Engine**:
   ```bash
   cd ../ai-engine
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```


## 🏗 Architecture & RAG Workflow

LexAgent operates on a **Retrieval-Augmented Generation (RAG)** pipeline to ensure all legal advice is grounded in actual Supreme Court precedents.

### 1. Data Ingestion (The 400 Files)
- **Source**: 400+ Supreme Court Judgments (2025) are stored in PDF format.
- **Extraction**: `PyPDF2` scans these documents and extracts clean text into a centralized JSON store.
- **Vectorization**: Using `ChromaDB`, the text is broken into 2,000-character chunks and converted into high-dimensional vectors (embeddings) using a local Sentence Transformer model.
- **Persistence**: These vectors are saved in the `ai-engine/chroma_db` folder, allowing for instant semantic search without re-processing PDFs.

### 2. Search & Retrieval
- When a user submits a query, the AI engine converts the query into a vector.
- It performs a **Semantic Search** against the vector store to find the most relevant case chunks.
- These chunks are provided as "Context" to the **Llama 3.2** model via Ollama.
- The model generates a synthesized memo with citations linked directly to the original source files.

## 🔒 Decentralized Vault
LexAgent features a **Web3-powered Document Vault** for secure, decentralized document management:
- **IPFS Storage**: Documents are pinned to the IPFS network via **Pinata**.
- **On-Chain Metadata**: Case Status, Case Number, and Title are stored natively as Pinata metadata (key-values), eliminating the need for a traditional centralized database.
- **Audit Ready**: Every upload returns a unique CID (Content Identifier) for immutable verification.

## 📄 License
Internal / Private use for Judiciary System optimization.
