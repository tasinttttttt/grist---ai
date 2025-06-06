<script lang="ts">
	import { cn } from '$lib/utils/shadcn';
	import type { UIMessage } from '@ai-sdk/svelte';
	import { fly } from 'svelte/transition';
	import SparklesIcon from '../icons/sparkles.svelte';
	import { Markdown } from '../markdown';
	import MessageReasoning from '../message-reasoning.svelte';

	let { message, readonly, loading }: { message: UIMessage; readonly: boolean; loading: boolean } =
		$props();

	let mode = $state<'view'>('view');

	console.log(message);
</script>

<div
	class="group/message mx-auto w-full max-w-3xl px-4"
	data-role={message.role}
	in:fly|global={{ opacity: 0, y: 5 }}
>
	<div
		class={cn(
			'relative flex w-full gap-4 group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl',
			{
				'group-data-[role=user]/message:w-fit': true
			}
		)}
	>
		{#if message.role === 'assistant'}
			<div class="bg-background relative top-4 flex size-4 shrink-0 items-center justify-center">
				<div class="translate-y-px">
					<SparklesIcon size={12} />
				</div>
			</div>
		{/if}

		<div class="flex w-full flex-col gap-4">
			<!-- {#if message.experimental_attachments && message.experimental_attachments.length > 0}
				<div class="flex flex-row justify-end gap-2">
					{#each message.experimental_attachments as attachment (attachment.url)}
						<PreviewAttachment {attachment} />
					{/each}
				</div>
			{/if} -->

			{#if message.role === 'assistant'}
				<!-- {JSON.stringify(message.parts)} -->
				<!-- <Markdown md={message.content.output} /> -->
				<!-- {:else} -->
				<!-- <Markdown md={part.text} /> -->
			{/if}
			{#each message.parts as part, i (`${message.id}-${i}`)}
				{@const { type } = part}
				{#if type === 'reasoning'}
					<MessageReasoning {loading} reasoning={part.reasoning} />
				{:else if type === 'text'}
					{#if mode === 'view'}
						<div class="flex flex-row items-start gap-2">
							<div
								class={cn('flex flex-col gap-4', {
									'bg-primary text-primary-foreground rounded-xl px-3 py-2': message.role === 'user'
								})}
							>
								{#if message.role === 'assistant'}
									<Markdown md={JSON.parse(part.text).response} />
									{#if JSON.parse(part.text)?.sql_query}
										<div class="flex flex-col">
											<div>🧮 La requête SQL qui a été concoctée pour arriver à ce résultat:</div>
											<Markdown md={'`\n' + JSON.parse(part.text)?.sql_query + '`'} />
										</div>
									{/if}
								{:else}
									<Markdown md={part.text} />
								{/if}
								{#if message.role === 'assistant'}
									<div class="text-center text-sm text-gray-400/50">
										Cuisiné le {new Intl.DateTimeFormat('fr-FR', {
											dateStyle: 'full',
											timeStyle: 'short'
										}).format(new Date(message.createdAt))} par Grist ✧ Ai
									</div>
								{/if}
							</div>
						</div>
					{/if}
				{/if}
			{/each}
		</div>
	</div>
</div>
