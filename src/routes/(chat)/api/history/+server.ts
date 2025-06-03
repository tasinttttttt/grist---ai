import { getChats } from '$lib/server/db/queries.js';

export async function GET({ locals }) {
	const chats = await getChats();
	return Response.json(chats);
}
