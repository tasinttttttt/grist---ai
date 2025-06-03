import { env as privateEnv } from '$env/dynamic/private';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
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

	if (user) {
		event.locals.user = user;
	}

	return resolve(event);
};
