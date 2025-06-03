import { writable } from 'svelte/store';

export const apiKey = writable('');

export function setApiKey(value) {
	apiKey.set(value);
}
