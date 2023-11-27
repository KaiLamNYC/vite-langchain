// document.addEventListener('submit', (e) => {
//     e.preventDefault()
//     progressConversation()
// })

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

//PROMPT TEMPLATES
//https://js.langchain.com/docs/modules/model_io/prompts/prompt_templates/

import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";

const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY;

//COOKBOOK PROMPT TEMPLATE + LLM
//https://js.langchain.com/docs/expression_language/cookbook/prompt_llm_parser

//LANGCHAIN AUTOMATICALLY PULL THE KEY FROM process.env.OPENAI_API_KEY IF NOT SUPPLIED
//LLM VS CHAT MODEL
//https://js.langchain.com/docs/modules/model_io/models/
const llm = new ChatOpenAI({ openAIApiKey });

//https://js.langchain.com/docs/modules/model_io/prompts/prompt_templates/#create-a-prompt-template
const tweetTemplate =
	"Generate a promotional tweet for a product, from this product description: {procuctDesc}";

const tweetPrompt = PromptTemplate.fromTemplate(tweetTemplate);

const formattedPrompt = await tweetPrompt.format({
	procuctDesc: "colorful socks",
});

console.log(formattedPrompt);

// console.log(openAIApiKey);
