<script lang="ts">
	import { SidebarInset, SidebarProvider } from '$lib/components/ui/sidebar';
	import { ChatHistory } from '$lib/hooks/chat-history.svelte.js';

	let { data, children } = $props();

	const chatHistory = new ChatHistory(data.chats);
	chatHistory.setContext();
</script>

<SidebarProvider open={!data.sidebarCollapsed}>
	<SidebarInset>{@render children?.()}</SidebarInset>
</SidebarProvider>
