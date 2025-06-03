<script lang="ts">
	import { innerWidth } from 'svelte/reactivity/window';
	import { Tooltip, TooltipTrigger } from './ui/tooltip';
	import { Button } from './ui/button';
	let {}: {} = $props();
</script>

<header class="bg-background sticky top-0 flex items-center gap-2 p-2">
	{#if (innerWidth.current ?? 768) < 768}
		<Tooltip>
			<TooltipTrigger>
				{#snippet child({ props })}{/snippet}
			</TooltipTrigger>
			<span class="cursor-default">Grist ♥️ AI</span>
		</Tooltip>
	{/if}
	<Button href="/signin" class="ml-auto px-2 py-1.5 md:h-[34px]">Clé API Grist</Button>
</header>
