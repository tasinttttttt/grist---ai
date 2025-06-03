<script lang="ts">
	import AuthForm from '$lib/components/auth-form.svelte';
	import SubmitButton from '$lib/components/submit-button.svelte';
	import { page } from '$app/state';

	let { form } = $props();

	const apiKey = $derived(page.params.apikey);
</script>

<div
	class="bg-background flex h-dvh w-screen items-start justify-center pt-12 md:items-center md:pt-0"
>
	<div class="flex w-full max-w-md flex-col gap-12 overflow-hidden rounded-2xl">
		<AuthForm form={form ?? undefined}>
			{#snippet submitButton({ pending, success })}
				<SubmitButton {pending} {success}>Save</SubmitButton>
			{/snippet}

			{#if page.params.authType === 'signup'}
				{@render switchAuthType({
					question: 'Please provide your Grist Api Key',
					href: '/apikey',
					cta: 'Grist Api Key',
					postscript: ' instead.'
				})}
			{/if}
		</AuthForm>
	</div>
</div>

{#snippet switchAuthType({
	question,
	href,
	cta,
	postscript
}: {
	question: string;
	href: string;
	cta: string;
	postscript: string;
})}
	<p class="mt-4 text-center text-sm text-gray-600 dark:text-zinc-400">
		{question}
		<a {href} class="font-semibold text-gray-800 hover:underline dark:text-zinc-200">
			{cta}
		</a>
		{postscript}
	</p>
{/snippet}
