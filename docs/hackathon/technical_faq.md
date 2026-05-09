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

## **Part 2: Critical "Counter-Attack" Defense**

### **Q7: Hallucination is the biggest fear in Law. How do you prevent the AI from "inventing" a law?**
*   **Answer**: "We implement **Source-Grounded Extraction.** Our Summarizer Agent is strictly instructed to extract **Verbatim Holdings**—meaning it must copy-paste the exact legal text from the PDF. Furthermore, the **Critic Agent** performs a cross-check: if the summary contains a legal principle not found in the original text chunk, it rejects the result. We don't ask the AI to 'tell us about the law'; we ask it to 'find and quote the law' from the provided 37,000 files."

### **Q8: Does a user need a supercomputer to run 4 agents locally?**
*   **Answer**: "No. We use **4-bit Quantization** (GGUF format) for our Llama 3.2 model. This allows the model to fit into ~4GB of VRAM. By orchestrating the agents sequentially (Intent → Research → Summarize → Critic), we manage the compute load so that even a modern consumer laptop can handle the entire research cycle in under 60 seconds. This makes high-end AI accessible to the average Indian law firm."

### **Q9: How do you handle "Data Freshness"? Today's judgment could change everything.**
*   **Answer**: "Our architecture is **Vector-First.** The `ai-engine` includes a `bulk_uploader.py` utility that can ingest new judgments from official court websites in minutes. Since we use ChromaDB, we don't need to 'retrain' the model. We simply add new vectors to the vault, and the agents immediately have access to the latest law without any downtime."

### **Q10: What if the AI gives a wrong citation? Who is responsible?**
*   **Answer**: "LexAgent is positioned as a **Research Assistant (Clerk)**, not a Judge. Every result in our UI includes a direct link to the **Original raw PDF** from the local vault. We empower the lawyer to verify the AI's findings in one click. Our Relational Map also shows the 'Selection Reason,' making the AI's logic transparent (White-box AI) rather than a mystery (Black-box AI)."

### **Q11: Can LexAgent handle multi-lingual judgments from regional courts?**
*   **Answer**: "Currently, we focus on Supreme Court judgments (English). However, because we use Llama 3.2, which is a multi-lingual model, the architecture is 'Language-Agnostic.' We can easily scale to High Court judgments in Hindi, Marathi, or Tamil by simply updating the vector embeddings for those specific languages."

### **Q12: Is the Web3/IPFS part just a 'buzzword' or does it serve a purpose?**
*   **Answer**: "It is a critical **Security Feature.** Legal research memos are highly sensitive. By pinning them to **IPFS**, we ensure that once a research session is finalized, it is immutable and decentralized. It prevents 'Data Loss' if a local system fails and provides a tamper-proof audit trail for the law firm's internal archives."
