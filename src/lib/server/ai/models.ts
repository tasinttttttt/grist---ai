// import { createXai } from '@ai-sdk/xai';
// import { createGroq } from '@ai-sdk/groq';
import { createOpenAI } from '@ai-sdk/openai';
import { customProvider, extractReasoningMiddleware, wrapLanguageModel } from 'ai';
// import { XAI_API_KEY, GROQ_API_KEY } from '$env/static/private';
import { CHAT_URL } from '$env/static/private';

// const xai = createXai({ apiKey: XAI_API_KEY });
// const groq = createGroq({ apiKey: GROQ_API_KEY });
const albert = createOpenAI({
	baseURL: CHAT_URL
});

export const myProvider = customProvider({
	languageModels: {
		// 'chat-model': albert('meta-llama/Llama-3.1-8B-Instruct')
		// 'chat-model': xai('grok-2-1212'),
		// 'chat-model-reasoning': wrapLanguageModel({
		// 	model: groq('deepseek-r1-distill-llama-70b'),
		// 	middleware: extractReasoningMiddleware({ tagName: 'think' })
		// }),
		// 'title-model': xai('grok-2-1212'),
		// 'artifact-model': xai('grok-2-1212')
	},
	imageModels: {
		// 'small-model': xai.image('grok-2-image')
	}
});
