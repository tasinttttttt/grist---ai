<script lang="ts">
	import { apiKey } from '$lib/hooks/useApiKey';
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';
</script>

<div class="mx-auto max-w-3xl md:mt-20" transition:scale={{ opacity: 0, start: 0.98 }}>
	<div class="flex max-w-xl flex-col gap-8 rounded-xl p-6 text-center leading-relaxed">
		{#if !$apiKey}
			<p class="flex flex-row items-center justify-center gap-4">
				<li>1. Le widget a-t-il accès à la table?</li>
				<li>2. La clé API est-elle renseignée?</li>
			</p>
		{:else}
			<p class="flex flex-row items-center justify-center gap-4">Grist ♥️ AI</p>
		{/if}
	</div>
</div>
