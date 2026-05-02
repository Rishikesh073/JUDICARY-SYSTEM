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
- [Ollama](https://ollama.com/) installed and running.
- `llama3.2` model pulled: `ollama pull llama3.2`

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

## 📄 License
Internal / Private use for Judiciary System optimization.
