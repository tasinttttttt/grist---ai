import {
	createSession,
	generateSessionToken,
	setSessionTokenCookie
} from '$lib/server/auth/index.js';

import { fail, redirect } from '@sveltejs/kit';

export function load({ locals }) {
	if (locals.session) {
		return redirect(307, '/');
	}
}
export const actions = {
	default: async ({ request, params, cookies }) => {
		const formData = await request.formData();
		const apikey = await formData.get('apikey');

		if (!apikey) {
			return fail(400, { success: false, message: 'Invalid api key' } as const);
		} else {
			// cookies.set('apikey', apikey.toString(), {
			// 	httpOnly: true,
			// 	sameSite: 'strict',
			// 	// expires: expiresAt,
			// 	// secure: !dev
			// 	maxAge: 60 * 60 * 24 * 30, // on est des fous
			// 	path: '/'
			// });
		}
		return redirect(303, '/');
	}
};
