# LexAgent: Hackathon Technical FAQ (Judges’ Defense)

### **Q1: Why use an Agentic workflow instead of just a simple RAG (Retrieval-Augmented Generation)?**
*   **Answer**: "Standard RAG often suffers from 'Hallucinations' where the AI mixes up facts from different cases. By using a **Critic Agent** and a **Summarizer Agent**, we separate the 'finding' from the 'evaluating.' Our Critic Agent specifically checks the output for legal consistency and assigns a confidence score, ensuring that the lawyer only sees verified precedents."

### **Q2: How do you handle 37,000+ files? Isn't that too much for an LLM's context window?**
*   **Answer**: "We use **ChromaDB as our Vector Database.** We don't feed all 37k files to the LLM at once. Instead, we use **Semantic Vector Embedding** (Sentence Transformers) to find the top 10 most mathematically relevant chunks. This keeps the performance sub-second and the costs (or local compute) low."

### **Q3: Legal data is extremely sensitive. How do you ensure Privacy?**
*   **Answer**: "LexAgent is designed to be **Privacy-First.** Our AI engine runs on **Ollama (Llama 3.2)**, which executes entirely on the user's local hardware. No legal query or case text ever leaves the local environment. Additionally, for file storage, we use **IPFS (InterPlanetary File System)**, giving the user decentralized control over their documents."

### **Q4: How did you build the Relational Citation Graph? Is it just for show?**
*   **Answer**: "No, it’s a functional intelligence tool. We use **D3.js** to map two types of relationships:
    1.  **Relevance Vectors**: Connecting the user's query to specific cases.
    2.  **Citation Vectors**: We parse the 'Cited Precedents' list from each judgment. If Case A cites Case B (and both are in our result set), we draw a lateral link. This allows a lawyer to see the 'Chain of Law' visually."

### **Q5: What happens if the AI fails to find a case? Does it make one up (Hallucinate)?**
*   **Answer**: "We have strict **System Prompts** that prevent hallucination. If no cases meet the 60% confidence threshold, the Critic Agent is instructed to report 'No relevant precedents found' rather than inventing data. We prioritize **Veracity over Volume.**"

### **Q6: How is this different from SCC Online or Manupatra?**
*   **Answer**: "Legacy tools like SCC Online are 'Search Engines'—they give you results, and YOU have to read them. LexAgent is an **'Insight Engine'**—it reads them for you, synthesizes a memorandum, and visualizes the relationships between judgments automatically. It’s the difference between a Library and a Clerk."

---

### **Technical Summary for Reference:**
*   **Tech Stack**: React/Vite, Node.js (Express Bridge), Python (FastAPI), ChromaDB, Ollama (Llama 3.2).
*   **Data Volume**: 37,000+ Full-text Supreme Court Judgments (1950–2025).
*   **Security**: IPFS for decentralized storage, local LLM execution for sensitive legal data.
*   **Innovation**: Relational D3.js mapping of citation vectors—showing not just results, but the connections between them.
