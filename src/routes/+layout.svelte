<script lang="ts">
	import '../app.css';
	import { ThemeProvider } from '@sejohnson/svelte-themes';
	import { Toaster } from '$lib/components/ui/sonner';
	import { pbStore } from '$lib/stores/pb';
	import { env } from '$env/dynamic/public';

	let { children } = $props();

	pbStore.set(env.PUBLIC_API_URL);
</script>

<ThemeProvider attribute="class" disableTransitionOnChange>
	<Toaster position="top-center" />
	{@render children()}
</ThemeProvider>
