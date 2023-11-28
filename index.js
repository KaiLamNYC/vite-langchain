// const openAIApiKey = process.env.OPENAI_API_KEY

// async function progressConversation() {
//     const userInput = document.getElementById('user-input')
//     const chatbotConversation = document.getElementById('chatbot-conversation-container')
//     const question = userInput.value
//     userInput.value = ''

//     // add human message
//     const newHumanSpeechBubble = document.createElement('div')
//     newHumanSpeechBubble.classList.add('speech', 'speech-human')
//     chatbotConversation.appendChild(newHumanSpeechBubble)
//     newHumanSpeechBubble.textContent = question
//     chatbotConversation.scrollTop = chatbotConversation.scrollHeight

//     // add AI message
//     const newAiSpeechBubble = document.createElement('div')
//     newAiSpeechBubble.classList.add('speech', 'speech-ai')
//     chatbotConversation.appendChild(newAiSpeechBubble)
//     newAiSpeechBubble.textContent = result
//     chatbotConversation.scrollTop = chatbotConversation.scrollHeight
// }

import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";

//SUPABASE STUFF
import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";

document.addEventListener("submit", (e) => {
	e.preventDefault();
	progressConversation();
});

//VITE SPECIFIC ENV VAR
const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY;

const llm = new ChatOpenAI({ openAIApiKey });

// const standaloneQuestionTemplate =
// 	"given a question, convert it to a standalone question: {question} standalone question:";

// const standaloneQuestionPrompt;

const standalonePrompt = new PromptTemplate({
	inputVariables: ["question"],
	template:
		"Given a question, convert it to a standalone question: {question} standalone question:",
});

const standaloneQuestionChain = standalonePrompt.pipe(llm);

const response = await standaloneQuestionChain.invoke({
	question:
		"what are the techincal requirements for running Scrimba? i only have a very old laptop which is not that powerful",
});

console.log(response);
