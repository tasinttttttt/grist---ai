export const DEFAULT_CHAT_MODEL: string = 'o3-mini';

interface ChatModel {
	id: string;
	name: string;
	description: string;
}

export const chatModels: Array<ChatModel> = [
	{
		id: 'Meta-Llama-3.1-8B-Instruct',
		name: 'Petit Albert',
		description: 'Le petit'
	},
	{
		id: 'albert-large',
		name: 'Grand Albert',
		description: 'Le grand'
	}
];
