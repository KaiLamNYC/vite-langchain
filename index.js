import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";

//https://js.langchain.com/docs/modules/model_io/output_parsers/string
import { StringOutputParser } from "langchain/schema/output_parser";

//IMPORT FROM UTILS
import { combineDocuments } from "./utils/combineDocuments";
import { formatConvHistory } from "./utils/formatConvHistory";
import { retriever } from "/utils/retriever";

import {
	RunnablePassthrough,
	RunnableSequence,
} from "langchain/schema/runnable";

document.addEventListener("submit", (e) => {
	e.preventDefault();
	progressConversation();
});

const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY;
const llm = new ChatOpenAI({ openAIApiKey });

const standalonePrompt = new PromptTemplate({
	inputVariables: ["question", "conv_history"],
	template: `Given some conversation history (if any) and a question, convert it to a standalone question.
		conversation history: {conv_history}
		question: {question} 
		standalone question:`,
});

const finalPrompt = new PromptTemplate({
	inputVariables: ["question", "context", "conv_history"],
	template: `You are a helpful and enthusiastic chatbot thats an expert on Drake's recent interview, you are tasked to provide accurate and insightful responses. Question posed: '{question}'. In the context of Drake's interview, he remarked: {context}. Should you require additional specifics or further clarification on this or any other aspect of the interview, please do not hesitate to inquire for more in-depth insights. Always speak as if you were talking to a friend. If the answer is not given in the context, try find the answer in the conversation history if possible: {conv_history}`,
});

const standaloneChain = RunnableSequence.from([
	standalonePrompt,
	llm,
	new StringOutputParser(),
]);

const retrieverChain = RunnableSequence.from([
	(prevResult) => prevResult.standalone_question,
	retriever,
	combineDocuments,
]);

const answerChain = RunnableSequence.from([
	finalPrompt,
	llm,
	new StringOutputParser(),
]);

const chain = RunnableSequence.from([
	{
		standalone_question: standaloneChain,
		original_input: new RunnablePassthrough(),
	},
	{
		context: retrieverChain,
		question: ({ original_input }) => original_input.question,
		conv_history: ({ original_input }) => original_input.conv_history,
	},
	answerChain,
]);

const convHistory = [];

async function progressConversation() {
	const userInput = document.getElementById("user-input");
	const chatbotConversation = document.getElementById(
		"chatbot-conversation-container"
	);
	const question = userInput.value;
	userInput.value = "";

	// add human message
	const newHumanSpeechBubble = document.createElement("div");
	newHumanSpeechBubble.classList.add("speech", "speech-human");
	chatbotConversation.appendChild(newHumanSpeechBubble);
	newHumanSpeechBubble.textContent = question;
	chatbotConversation.scrollTop = chatbotConversation.scrollHeight;

	//what is one thing drake likes to wear?
	const response = await chain.invoke({
		question: question,
		conv_history: formatConvHistory(convHistory),
	});

	convHistory.push(question);
	convHistory.push(response);

	// add AI message
	const newAiSpeechBubble = document.createElement("div");
	newAiSpeechBubble.classList.add("speech", "speech-ai");
	chatbotConversation.appendChild(newAiSpeechBubble);
	newAiSpeechBubble.textContent = response;
	chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
}
