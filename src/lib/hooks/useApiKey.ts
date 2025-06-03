import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const apiKey = writable('');

export function setApiKey(value) {
	apiKey.set(value);
	if (browser) {
		sessionStorage.setItem('apikey', value);
	}
}

export function getApiKey() {
	if (browser) {
		return sessionStorage.getItem('apikey') || '';
	}
	return '';
}
