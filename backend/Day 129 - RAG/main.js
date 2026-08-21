import "dotenv/config";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";

async function main() {
  // ==========================================
  // STEP 1: LOAD & SPLIT DOCUMENT
  // ==========================================
  // INPUT: Local file path string "./furqan-khan-story.pdf"
  const loader = new PDFLoader("./furqan-khan-story.pdf");
  
  // OUTPUT from loader.load(): Array of Document objects (1 per page)
  // [
  //   Document { pageContent: "From Fraud Desks to Founder...", metadata: { source: "./furqan-khan-story.pdf", loc: { pageNumber: 1 } } },
  //   Document { pageContent: "Building FKodeLabs...", metadata: { source: "./furqan-khan-story.pdf", loc: { pageNumber: 2 } } },
  //   ...
  // ]
  const rawDocs = await loader.load();

  // INPUT: Chunking configuration options
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  // INPUT: rawDocs (Array of 3 page-level Documents)
  // OUTPUT: Array of ~9 smaller Document chunks with metadata preserved
  const splitDocs = await splitter.splitDocuments(rawDocs);
  console.log(`Prepared ${splitDocs.length} chunks for ingestion.`);
  // Terminal Output: "Prepared 9 chunks for ingestion."

  // ==========================================
  // STEP 2: INITIALIZE MISTRAL EMBEDDINGS
  // ==========================================
  // INPUT: Configuration object with Mistral API Key and target model
  const embeddingModel = new MistralAIEmbeddings({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-embed", // Produces 1024-dimensional dense vectors
  });

  // ==========================================
  // STEP 3: CONNECT TO PINECONE CLIENT & INDEX
  // ==========================================
  // INPUT: Pinecone API credentials from process.env
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });
  
  // INPUT: Index name string (e.g., "rag-mistral-index")
  // OUTPUT: Targeted Pinecone Index handle
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

  // ==========================================
  // STEP 4: EMBED & UPSERT TO PINECONE
  // ==========================================
  console.log("Embedding chunks and uploading to Pinecone...");
  
  // INPUT:
  // 1. splitDocs: Array of 9 Document objects
  // 2. embeddingModel: MistralAIEmbeddings instance
  // 3. { pineconeIndex, maxConcurrency: 5 }
  //
  // WHAT HAPPENS UNDER THE HOOD:
  // - Mistral API converts each chunk to [0.012, -0.043, ..., 0.089] (1024 floats)
  // - Pinecone receives batch upsert payloads:
  //   { id: "uuid-1", values: [1024 floats], metadata: { text: "...", source: "...", loc: { pageNumber: 2 } } }
  //
  // OUTPUT: Initialized PineconeStore vector database instance
  const vectorStore = await PineconeStore.fromDocuments(splitDocs, embeddingModel, {
    pineconeIndex,
    maxConcurrency: 5,
  });

  console.log("Ingestion finished successfully!\n");

  // ==========================================
  // STEP 5: VERIFY WITH A SIMILARITY SEARCH
  // ==========================================
  // INPUT: Natural language query string and k (number of nearest documents to return)
  const query = "What automation did Furqan build at Danube Properties?";
  console.log(`Searching Pinecone for: "${query}"...\n`);

  // UNDER THE HOOD:
  // - query text is converted to a 1024-dim vector using embeddingModel.embedQuery()
  // - Pinecone calculates cosine similarity against all stored vectors
  // - Returns top k=2 most semantically aligned Document objects
  //
  // OUTPUT from similaritySearch:
  // [
  //   Document {
  //     pageContent: "I built a lead pipeline workflow in n8n with full Salesforce CRM integration...",
  //     metadata: { source: "./furqan-khan-story.pdf", loc: { pageNumber: 2 } }
  //   },
  //   Document {
  //     pageContent: "department. That evolution is probably the clearest evidence of how I work...",
  //     metadata: { source: "./furqan-khan-story.pdf", loc: { pageNumber: 2 } }
  //   }
  // ]
  const results = await vectorStore.similaritySearch(query, 2);

  // TERMINAL OUTPUT:
  // --- Match 1 (Page 2) ---
  // I built a lead pipeline workflow in n8n with full Salesforce CRM integration and relationship-manager assignment logic...
  //
  // --- Match 2 (Page 2) ---
  // department. That evolution is probably the clearest evidence of how I work: given a support role, I found the automation problem...
  results.forEach((doc, i) => {
    console.log(`--- Match ${i + 1} (Page ${doc.metadata?.loc?.pageNumber || "N/A"}) ---`);
    console.log(doc.pageContent);
    console.log("\n");
  });
}

main().catch(console.error);