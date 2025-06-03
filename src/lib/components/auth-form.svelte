<script module lang="ts">
	export type FormSuccessData = {
		success: true;
	};
	export type FormFailureData = {
		success: false;
		message: string;
		email?: string;
	};
	export type FormData = FormSuccessData | FormFailureData;

	export type AuthFormProps = {
		form?: FormData;
		submitButton: Snippet<[{ pending: boolean; success: boolean }]>;
		children: Snippet;
	};
</script>

<script lang="ts">
	import { enhance } from '$app/forms';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { Snippet } from 'svelte';
	import { toast } from 'svelte-sonner';

	import { apiKey, setApiKey } from '$lib/hooks/useApiKey';
	let { form, submitButton, children }: AuthFormProps = $props();

	let pending = $state(false);
	const enhanceCallback: SubmitFunction<FormSuccessData, FormFailureData> = () => {
		pending = true;
		return async ({ result, update }) => {
			if (result.type === 'failure' && result.data?.message) {
				toast.error(result.data.message, { duration: 5000 });
			}
			pending = false;
			return update();
		};
	};
</script>

<form method="POST" class="flex flex-col gap-4 px-4 sm:px-16" use:enhance={enhanceCallback}>
	<div class="flex flex-col gap-2">
		<Label for="apikey" class="text-zinc-600 dark:text-zinc-400">ApiKey</Label>

		<Input
			id="apikey"
			name="apikey"
			class="text-md bg-muted md:text-sm"
			type="password"
			required
			on:input={(e) => {
				setApiKey(e.target.value);
				console.log($apiKey);
			}}
		/>
	</div>

	{@render submitButton({ pending, success: !!form?.success })}
	{@render children()}
</form>
