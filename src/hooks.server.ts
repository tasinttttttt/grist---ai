import { env as privateEnv } from '$env/dynamic/private';
import type { Handle } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(privateEnv.PRIVATE_BACKEND_URL);

	// DELETE COOKIE
	// console.log(event.cookies.set('user', '', { path: '/' }));
	// console.log(event.request.headers.delete('cookie'));
	// event.cookies.delete('user', { path: '/', secure: false });
	// return resolve(event);

	let userId = event.cookies.get('user');
	let user = null;

	const auth = {
		email: privateEnv.PRIVATE_API_USER,
		password: privateEnv.PRIVATE_API_PASS
	};

	// Auth
	await event.locals.pb.collection('_superusers').authWithPassword(auth.email, auth.password);

	if (userId) {
		// Fetch the user from PocketBase
		user = await event.locals.pb
			.collection('anonymous_users')
			.getOne(userId)
			.catch((err) => {});
	}

	if (user) {
		event.locals.user = user;

		// Add header for update operations
		event.locals.pb.beforeSend = (url, options) => {
			options.headers = {
				...options.headers,
				'x-userid': user
			};
			return { url, options };
		};
	}

	return resolve(event);
};
