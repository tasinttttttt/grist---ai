import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';

function createPbStore(baseUrl?: string | undefined) {
	const store = writable<PocketBase>();

	function set(baseUrl?: string | undefined) {
		const pb = new PocketBase(baseUrl);

		store.set(pb);
	}

	set(baseUrl);

	return {
		subscribe: store.subscribe,
		set
	};
}

export const pbStore = createPbStore();
