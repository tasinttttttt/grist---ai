<script lang="ts">
	import { Chat } from '@ai-sdk/svelte';
	import { toast } from 'svelte-sonner';
	// import { ChatHistory } from '$lib/hooks/chat-history.svelte';
	import type { Chat as DbChat, User } from '$lib/server/db/schema';
	import type { UIMessage } from '@ai-sdk/svelte';
	import { onMount, untrack } from 'svelte';
	import ChatHeader from './chat-header.svelte';
	import Messages from './messages.svelte';
	import MultimodalInput from './multimodal-input.svelte';

	import { PUBLIC_CHAT_URL } from '$env/static/public';
	import { apiKey } from '$lib/hooks/useApiKey';

	let {
		user,
		chat,
		readonly,
		initialMessages
	}: {
		user: User | undefined;
		chat: DbChat | undefined;
		initialMessages: UIMessage[];
		readonly: boolean;
	} = $props();

	// const chatHistory = ChatHistory.fromContext();

	let documentId = $state('');
	let tableId = $state('');
	const chatClient = $derived(
		new Chat({
			id: chat?.id,
			api: 'https://dev.bhub.cloud/chat', //PUBLIC_CHAT_URL,
			headers: {
				'x-api-key': '083a79c72668f8808e334d92fabb694f1148c940'
				// $apiKey
			},
			initialMessages: untrack(() => initialMessages),
			sendExtraMessageFields: true,
			streamProtocol: 'text',
			generateId: crypto.randomUUID.bind(crypto),
			onResponse: (r) => {
				console.log({ r });
			},
			body: {
				documentId,
				executionMode: 'production',
				webhookUrl: 'https://lol.ptdr'
				// tableId
			},
			onFinish: async (e) => {
				console.log({ e });
				// await chatHistory.refetch();
			},
			onError: (error) => {
				try {
					// If there's an API error, its message will be JSON-formatted
					const jsonError = JSON.parse(error.message);
					console.log(jsonError);
					if (
						typeof jsonError === 'object' &&
						jsonError !== null &&
						'message' in jsonError &&
						typeof jsonError.message === 'string'
					) {
						toast.error(jsonError.message);
					} else {
						toast.error(error.message);
					}
				} catch {
					toast.error(error.message);
				}
			}
		})
	);

	onMount(async () => {
		await grist.ready({
			// TODO: change this to more specific
			requiredAccess: 'full'
		});
		documentId = await grist?.docApi?.getDocName();
		tableId = await grist.getTable().getTableId();
	});
</script>

<div class="bg-background flex h-dvh min-w-0 flex-col">
	<ChatHeader {user} {chat} {readonly} />
	<Messages
		{readonly}
		loading={chatClient.status === 'streaming' || chatClient.status === 'submitted'}
		messages={chatClient?.messages}
	/>
	<form class="bg-background mx-auto flex w-full gap-2 px-4 pb-4 md:max-w-3xl md:pb-6">
		{#if !readonly}
			<MultimodalInput {user} {chatClient} class="flex-1" />
		{/if}
	</form>
</div>
