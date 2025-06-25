import { startChat, sendMessage } from './api';
import type { ChatMessage, RawMessage, ChatApiResponse } from '$types/chat';

export function createChatController(
	treeId: string,
	onUpdate: (msgs: ChatMessage[], sessionId: string) => void,
	onError?: (errorMessage: string) => void
) {
	let sessionId = '';

	function handleNewChatMessages(response: unknown) {
	if (
		typeof response !== 'object' ||
		response === null ||
		!('data' in response) ||
		!('error' in response)
	) {
		console.error('Invalid response structure:', response);
		onError?.(
			'Leider ist ein Fehler aufgetreten. Bitte versuche es später erneut oder gib uns Feedback.'
		);
		return;
	}

	const { data, error } = response as ChatApiResponse;

	if (error) {
		console.error('Chat API error:', error);
		onError?.(
			'Leider ist ein Fehler aufgetreten. Bitte versuche es später erneut oder gib uns Feedback.'
		);
		return;
	}

	sessionId = data.sessionId;

	const messages: ChatMessage[] = data.messages
		.filter((msg: RawMessage) => !['no-reply', 'path'].includes(msg.type))
		.map((msg: RawMessage): ChatMessage => {
			const buttons = Array.isArray(msg.payload?.buttons)
				? msg.payload.buttons.map((btn: { name: string; request: unknown }) => ({
						label: btn.name,
						request: btn.request
					}))
				: [];

			return {
				text: msg.payload?.message ?? '',
				label: '',
				type: msg.payload?.type ?? msg.type,
				sender: 'bot',
				buttons,
				ai: msg.payload?.ai === true
			};
		});

	onUpdate(messages, sessionId);
}


	function init() {
		startChat(treeId, handleNewChatMessages);
	}

	function send(text: string) {
		if (!text.trim()) return;
		sendMessage(text, sessionId, handleNewChatMessages);
	}

	return { init, send };
}

