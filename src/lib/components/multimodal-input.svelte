<script lang="ts">
	import type { Chat } from '@ai-sdk/svelte';
	import { Textarea } from './ui/textarea';
	import { cn } from '$lib/utils/shadcn';
	import { onMount } from 'svelte';
	import { LocalStorage } from '$lib/hooks/local-storage.svelte';
	import { innerWidth } from 'svelte/reactivity/window';
	import { toast } from 'svelte-sonner';
	import { Button } from './ui/button';
	import StopIcon from './icons/stop.svelte';
	import ArrowUpIcon from './icons/arrow-up.svelte';
	import SuggestedActions from './suggested-actions.svelte';
	import { replaceState } from '$app/navigation';
	import type { User } from '$lib/server/db/schema';

	let {
		user,
		chatClient,
		class: c
	}: {
		user: User | undefined;
		chatClient: Chat;
		class?: string;
	} = $props();

	let mounted = $state(false);
	let textareaRef = $state<HTMLTextAreaElement | null>(null);
	let fileInputRef = $state<HTMLInputElement | null>(null);
	let uploadQueue = $state<string[]>([]);
	const storedInput = new LocalStorage('input', '');
	const loading = $derived(chatClient.status === 'streaming' || chatClient.status === 'submitted');

	const adjustHeight = () => {
		if (textareaRef) {
			textareaRef.style.height = 'auto';
			textareaRef.style.height = `${textareaRef.scrollHeight + 2}px`;
		}
	};

	const resetHeight = () => {
		if (textareaRef) {
			textareaRef.style.height = 'auto';
			textareaRef.style.height = '98px';
		}
	};

	function setInput(value: string) {
		chatClient.input = value;
		adjustHeight();
	}

	async function submitForm(event?: Event) {
		if (user) {
			replaceState(`/chat/${chatClient.id}`, {});
		}

		await chatClient.handleSubmit(event, {
			experimental_attachments: []
		});

		resetHeight();

		if (innerWidth.current && innerWidth.current > 768) {
			textareaRef?.focus();
		}
	}

	async function uploadFile(file: File) {
		const formData = new FormData();
		formData.append('file', file);

		try {
			const response = await fetch('/api/files/upload', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				const data = await response.json();
				const { url, pathname, contentType } = data;

				return {
					url,
					name: pathname,
					contentType: contentType
				};
			}
			const { message } = await response.json();
			toast.error(message);
		} catch {
			toast.error('Failed to upload file, please try again!');
		}
	}

	async function handleFileChange(
		event: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) {
		const files = Array.from(event.currentTarget.files || []);
		uploadQueue = files.map((file) => file.name);

		try {
			const uploadPromises = files.map((file) => uploadFile(file));
			const uploadedAttachments = await Promise.all(uploadPromises);
			const successfullyUploadedAttachments = uploadedAttachments.filter(
				(attachment) => attachment !== undefined
			);
		} catch (error) {
			console.error('Error uploading files!', error);
		} finally {
			uploadQueue = [];
		}
	}

	onMount(() => {
		chatClient.input = storedInput.value;
		adjustHeight();
		mounted = true;
	});
	$effect.pre(() => {
		storedInput.value = chatClient.input;
	});
</script>

<div class="relative flex w-full flex-col gap-4">
	{#if mounted && chatClient.messages.length === 0 && uploadQueue.length === 0}
		<SuggestedActions {user} {chatClient} />
	{/if}

	<input
		type="file"
		class="pointer-events-none fixed -left-4 -top-4 size-0.5 opacity-0"
		bind:this={fileInputRef}
		multiple
		onchange={handleFileChange}
		tabIndex={-1}
	/>

	<Textarea
		bind:ref={textareaRef}
		placeholder="Send a message..."
		bind:value={() => chatClient.input, setInput}
		class={cn(
			'bg-muted max-h-[calc(75dvh)] min-h-[24px] resize-none overflow-hidden rounded-2xl pb-10 !text-base dark:border-zinc-700',
			c
		)}
		rows={2}
		autofocus
		onkeydown={(event) => {
			if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
				event.preventDefault();

				if (loading) {
					toast.error('Please wait for the model to finish its response!');
				} else {
					submitForm();
				}
			}
		}}
	/>

	<div class="absolute bottom-0 right-0 flex w-fit flex-row justify-end p-2">
		{#if loading}
			{@render stopButton()}
		{:else}
			{@render sendButton()}
		{/if}
	</div>
</div>

{#snippet stopButton()}
	<Button
		class="h-fit rounded-full border p-1.5 dark:border-zinc-600"
		onclick={(event) => {
			event.preventDefault();
			stop();
			chatClient.messages = chatClient.messages;
		}}
	>
		<StopIcon size={14} />
	</Button>
{/snippet}

{#snippet sendButton()}
	<Button
		class="h-fit rounded-full border p-1.5 dark:border-zinc-600"
		onclick={(event) => {
			event.preventDefault();
			submitForm();
		}}
		disabled={chatClient.input.length === 0 || uploadQueue.length > 0}
	>
		<ArrowUpIcon size={14} />
	</Button>
{/snippet}
