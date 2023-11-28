import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";

//VITE SPECIFIC ENV VAR
const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY;

const embeddings = new OpenAIEmbeddings({ openAIApiKey });
const sbApiKey = import.meta.env.VITE_SUPABASE_API_KEY;
const sbUrl = import.meta.env.VITE_SUPABASE_URL;
const client = createClient(sbUrl, sbApiKey);

//https://js.langchain.com/docs/integrations/vectorstores/supabase
const vectorStore = new SupabaseVectorStore(embeddings, {
	client,
	tableName: "documents",
	queryName: "match_documents",
});

//https://js.langchain.com/docs/integrations/retrievers/vectorstore

//CAN ALSO USE THE SUPABASE HYBRID SEARCH
//https://js.langchain.com/docs/integrations/retrievers/supabase-hybrid
const retriever = vectorStore.asRetriever();

export { retriever };
