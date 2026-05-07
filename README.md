# LexAgent — Your Autonomous Junior Legal Clerk

LexAgent is a high-fidelity, premium legal research platform designed to fast-track the workflow of advocates and judges. It uses a sophisticated multi-agent pipeline to scan legal precedents, analyze complex queries, and generate court-ready memorandums in seconds.

## 🚀 Key Features
- **5-Agent Pipeline (LangGraph)**: Specialized agents (Parser, Researcher, Summarizer, Critic, Synthesizer) orchestrate the research flow.
- **Citation Graph**: Interactive **D3.js** network visualization of case relationships.
- **Premium Legal Aesthetic**: Optimized for professional legal environments with real-time **Agent Activity logs**.
- **One-Click Export**: Download synthesized memos as professionally formatted PDFs via **jsPDF**.
- **Decentralized Vault**: IPFS-backed file storage with Pinata for immutable case records.

## 🛠 Tech Stack
- **Frontend**: React, Vite, Tailwind CSS v4, **D3.js**, **jsPDF**, Framer Motion.
- **Backend**: Node.js (Express) as an orchestration bridge with Pinata (IPFS).
- **AI Engine**: FastAPI, **LangGraph**, ChromaDB (Vector Store), Ollama (Llama 3.2).
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

LexAgent uses a multi-agent system powered by **LangGraph** to ensure legal accuracy and prevent hallucinations. For a deep dive, see the [Full Architecture Guide](./architecture.md).

### 1. The 5-Agent Pipeline
- **Parser**: Structures the query (Intent, Court, Year).
- **Researcher**: Pulls relevant case law from **ChromaDB**.
- **Summarizer**: Distills legal logic (Ratio Decidendi).
- **Critic**: Audits findings and explicitly searches for **Dissenting Views**.
- **Synthesizer**: Compiles the final memorandum with **D3.js Graph** metadata.

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
