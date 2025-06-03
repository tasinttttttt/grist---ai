import { genSaltSync, hashSync } from 'bcrypt-ts';
// import { and, asc, desc, eq, gt, gte, inArray } from 'drizzle-orm';
// import { drizzle } from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';
// import { POSTGRES_URL } from '$env/static/private';
import { ResultAsync, fromPromise, ok, safeTry } from 'neverthrow';
import {
	user,
	chat,
	type User,
	document,
	type Suggestion,
	suggestion,
	type Message,
	message,
	vote,
	type Session,
	session,
	type AuthUser,
	type Chat,
	type Vote
} from './schema';
import type { DbError } from '$lib/errors/db';
import { DbInternalError } from '$lib/errors/db';
import ms from 'ms';
import { unwrapSingleQueryResult } from './utils';
import { env } from '$env/dynamic/public';
import PocketBase from 'pocketbase';

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle

// biome-ignore lint: Forbidden non-null assertion.
// const client = postgres(POSTGRES_URL);
// const db = drizzle(client);
const pb = new PocketBase(env.PUBLIC_API_URL);

export function getApiKey(): ResultAsync<unknown, DbError> {
	return safeTry(async function* () {
		const apiTokenResult = yield* fromPromise(
			pb.collection('meta').getFirstListItem(`apiKey != ''`),
			(e) => new DbInternalError({ cause: e })
		);
		return apiTokenResult?.apiKey;
	});
}

export async function saveApiKey(apiKey: string) {
	const records = await pb.collection('meta').getFullList();
	records?.map(({ id }) => {
		pb.collection('meta').delete(id);
	});

	const result = await pb.collection('meta').create({
		apiKey
	});

	return result;
	return safeTry(async function* () {
		const records = await pb.collection('meta').getFullList();
		records?.map(({ id }) => {
			pb.collection('meta').delete(id);
		});

		const result = yield* fromPromise(
			pb.collection('meta').create({
				apiKey
			}),
			(e) => new DbInternalError({ cause: e })
		);

		return result;
	});
}

export function saveChat({
	id,
	title
}: {
	id: string;
	title: string;
}): ResultAsync<unknown, DbError> {
	return safeTry(async function* () {
		const insertResult = yield* fromPromise(
			pb.collection('chat').create({
				id,
				createdAt: new Date(),
				title
			}),
			(e) => new DbInternalError({ cause: e })
		);

		return insertResult;
		// return unwrapSingleQueryResult(insertResult, id, 'Chat');
	});
}

export async function getChats() {
	const result = await pb.collection('chat').getFullList();

	return result;
}

export function deleteChatById({ id }: { id: string }): ResultAsync<undefined, DbError> {
	return safeTry(async function* () {
		const actions = [
			() => db.delete(vote).where(eq(vote.chatId, id)),
			() => db.delete(message).where(eq(message.chatId, id)),
			() => db.delete(chat).where(eq(chat.id, id))
		];

		for (const action of actions) {
			yield* fromPromise(action(), (e) => new DbInternalError({ cause: e }));
		}

		return ok(undefined);
	});
}

export async function getChatById({ id }: { id: string }) {
	const result = await pb.collection('chat').getFirstListItem(`id = ${id}`);

	return result;
	return safeTry(async function* () {
		const chatResult = yield* fromPromise(
			db.select().from(chat).where(eq(chat.id, id)),
			(e) => new DbInternalError({ cause: e })
		);

		return unwrapSingleQueryResult(chatResult, id, 'Chat');
	});
}

export async function saveMessages({ messages }: { messages: Array<Message> }) {
	messages.forEach(async (message) => {
		await pb.collection('message').create({
			...message
		});
	});
	return ok(200);
	// return safeTry(async function* () {
	// 	const insertResult = yield* fromPromise(
	// 		db.insert(message).values(messages).returning(),
	// 		(e) => new DbInternalError({ cause: e })
	// 	);

	// 	return ok(insertResult);
	// });
}

export async function getMessagesByChatId({ id }: { id: string }) {
	const result = await pb.collection('message').getFullList({
		filter: `chatId == ${id}`,
		sort: 'created'
	});
	return ok(result);
	// return safeTry(async function* () {
	// 	const messages = yield* fromPromise(
	// 		db.select().from(message).where(eq(message.chatId, id)).orderBy(asc(message.createdAt)),
	// 		(e) => new DbInternalError({ cause: e })
	// 	);

	// 	return ok(messages);
	// });
}

// export function getMessagesByChatId({ id }: { id: string }): ResultAsync<Message[], DbError> {
// 	return safeTry(async function* () {
// 		const messages = yield* fromPromise(
// 			db.select().from(message).where(eq(message.chatId, id)).orderBy(asc(message.createdAt)),
// 			(e) => new DbInternalError({ cause: e })
// 		);

// 		return ok(messages);
// 	});
// }

export function voteMessage({
	chatId,
	messageId,
	type
}: {
	chatId: string;
	messageId: string;
	type: 'up' | 'down';
}): ResultAsync<undefined, DbError> {
	return safeTry(async function* () {
		yield* fromPromise(
			db
				.insert(vote)
				.values({
					chatId,
					messageId,
					isUpvoted: type === 'up'
				})
				.onConflictDoUpdate({
					target: [vote.messageId, vote.chatId],
					set: { isUpvoted: type === 'up' }
				}),
			(e) => new DbInternalError({ cause: e })
		);
		return ok(undefined);
	});
}

export function getVotesByChatId({ id }: { id: string }): ResultAsync<Vote[], DbError> {
	return fromPromise(
		db.select().from(vote).where(eq(vote.chatId, id)),
		(e) => new DbInternalError({ cause: e })
	);
}

export async function saveDocument({
	id,
	title,
	kind,
	content,
	userId
}: {
	id: string;
	title: string;
	kind: never;
	content: string;
	userId: string;
}) {
	try {
		return await db.insert(document).values({
			id,
			title,
			kind,
			content,
			userId,
			createdAt: new Date()
		});
	} catch (error) {
		console.error('Failed to save document in database');
		throw error;
	}
}

export async function getDocumentsById({ id }: { id: string }) {
	try {
		const documents = await db
			.select()
			.from(document)
			.where(eq(document.id, id))
			.orderBy(asc(document.createdAt));

		return documents;
	} catch (error) {
		console.error('Failed to get document by id from database');
		throw error;
	}
}

export async function getDocumentById({ id }: { id: string }) {
	try {
		const [selectedDocument] = await db
			.select()
			.from(document)
			.where(eq(document.id, id))
			.orderBy(desc(document.createdAt));

		return selectedDocument;
	} catch (error) {
		console.error('Failed to get document by id from database');
		throw error;
	}
}

export async function deleteDocumentsByIdAfterTimestamp({
	id,
	timestamp
}: {
	id: string;
	timestamp: Date;
}) {
	try {
		await db
			.delete(suggestion)
			.where(and(eq(suggestion.documentId, id), gt(suggestion.documentCreatedAt, timestamp)));

		return await db
			.delete(document)
			.where(and(eq(document.id, id), gt(document.createdAt, timestamp)));
	} catch (error) {
		console.error('Failed to delete documents by id after timestamp from database');
		throw error;
	}
}

export function saveSuggestions({
	suggestions
}: {
	suggestions: Array<Suggestion>;
}): ResultAsync<Suggestion[], DbError> {
	return fromPromise(
		db.insert(suggestion).values(suggestions).returning(),
		(e) => new DbInternalError({ cause: e })
	);
}

export function getSuggestionsByDocumentId({
	documentId
}: {
	documentId: string;
}): ResultAsync<Suggestion[], DbError> {
	return fromPromise(
		db.select().from(suggestion).where(eq(suggestion.documentId, documentId)),
		(e) => new DbInternalError({ cause: e })
	);
}

export function getMessageById({ id }: { id: string }): ResultAsync<Message, DbError> {
	return safeTry(async function* () {
		const messageResult = yield* fromPromise(
			db.select().from(message).where(eq(message.id, id)),
			(e) => new DbInternalError({ cause: e })
		);

		return unwrapSingleQueryResult(messageResult, id, 'Message');
	});
}

export function deleteMessagesByChatIdAfterTimestamp({
	chatId,
	timestamp
}: {
	chatId: string;
	timestamp: Date;
}): ResultAsync<undefined, DbError> {
	return safeTry(async function* () {
		const messagesToDelete = yield* fromPromise(
			db
				.select({ id: message.id })
				.from(message)
				.where(and(eq(message.chatId, chatId), gte(message.createdAt, timestamp))),
			(e) => new DbInternalError({ cause: e })
		);
		const messageIds = messagesToDelete.map((message) => message.id);
		if (messageIds.length > 0) {
			const votes = fromPromise(
				db.delete(vote).where(and(eq(vote.chatId, chatId), inArray(vote.messageId, messageIds))),
				(e) => new DbInternalError({ cause: e })
			);
			const messages = fromPromise(
				db.delete(message).where(and(eq(message.chatId, chatId), inArray(message.id, messageIds))),
				(e) => new DbInternalError({ cause: e })
			);
			yield* votes;
			yield* messages;
		}
		return ok(undefined);
	});
}

export function deleteTrailingMessages({ id }: { id: string }): ResultAsync<undefined, DbError> {
	return safeTry(async function* () {
		const message = yield* getMessageById({ id });
		yield* deleteMessagesByChatIdAfterTimestamp({
			chatId: message.chatId,
			timestamp: message.createdAt
		});
		return ok(undefined);
	});
}

export function updateChatVisiblityById({
	chatId,
	visibility
}: {
	chatId: string;
	visibility: 'private' | 'public';
}): ResultAsync<undefined, DbError> {
	return safeTry(async function* () {
		yield* fromPromise(
			db.update(chat).set({ visibility }).where(eq(chat.id, chatId)),
			(e) => new DbInternalError({ cause: e })
		);
		return ok(undefined);
	});
}
