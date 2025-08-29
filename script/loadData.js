import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { KVVectorStore } from "@vercel/kv";

const docs = [
  { id: "1", text: "Max Verstappen es piloto de Red Bull Racing." },
  { id: "2", text: "Lewis Hamilton corre para Mercedes." },
  { id: "3", text: "La Fórmula 1 tiene 23 carreras en 2023." },
];

const run = async () => {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const store = new KVVectorStore(embeddings);

  await store.addDocuments(docs.map(d => ({ pageContent: d.text, metadata: { id: d.id } })));

  console.log("✅ Datos cargados en KV");
};

run();
