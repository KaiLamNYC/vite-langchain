import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";

//MULTIPLE CHAINS
//https://js.langchain.com/docs/expression_language/cookbook/multiple_chains
//https://js.langchain.com/docs/expression_language/how_to/map
//RUNNABLE PASSTHROUGH
//https://js.langchain.com/docs/expression_language/how_to/map#manipulating-outputsinputs
import {
	RunnablePassthrough,
	RunnableSequence,
} from "langchain/schema/runnable";

const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY;
const llm = new ChatOpenAI({ openAIApiKey });

const punctuationTemplate = `Given a sentence, add puntuation where needed.
sentence: {sentence}
sentence with punctuation:
`;

const punctuationPrompt = PromptTemplate.fromTemplate(punctuationTemplate);

const grammarTemplate = `Given a sentence correct the grammar.
sentence: {punctuated_sentence}
senence with correct grammar:`;

const grammarPrompt = PromptTemplate.fromTemplate(grammarTemplate);

const translationTemplate = `Given a sentence, translate that sentence into {language}
sentence: {grammatically_correct_sentence}
translated sentence: `;

const translationPrompt = PromptTemplate.fromTemplate(translationTemplate);

const punctuationChain = RunnableSequence.from([
	punctuationPrompt,
	llm,
	new StringOutputParser(),
]);

const grammarChain = RunnableSequence.from([
	grammarPrompt,
	llm,
	new StringOutputParser(),
]);

const translationChain = RunnableSequence.from([
	translationPrompt,
	llm,
	new StringOutputParser(),
]);

const chain = RunnableSequence.from([
	//CHAINING MULTIPLE SEQUENCES
	{
		punctuated_sentence: punctuationChain,
		//TAKING THE ORIGINAL INPUT AND PASSING IT ONTO THE NEXT RUNNABLE
		original_input: new RunnablePassthrough(),
	},
	{
		grammatically_correct_sentence: grammarChain,
		//PARSING LANGUAGE FROM THE
		language: ({ original_input }) => original_input.language,
	},
	translationChain,
]);

//INVOKING THE RUNNABLE SEQUENCES
const response = await chain.invoke({
	sentence: "i dont liked mondays",
	language: "french",
});

console.log(response);
