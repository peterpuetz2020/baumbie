import { startChat, sendMessage } from './api';
import type { Message as MessageType, RawMessage } from '$types/chat';

export function createChatController(treeId: string, onUpdate: (msgs: MessageType[], sessionId: string) => void) {
	let sessionId = '';

	function handleNewChatMessages(response: unknown) {
		if (
			typeof response !== 'object' ||
			response === null ||
			!('data' in response) ||
			!('error' in response)
		) {
			console.error('Invalid response structure:', response);
			return;
		}

		const { data, error } = response as { data: any; error: any };
		if (error) {
			console.error('Chat API error:', error);
			return;
		}

		sessionId = data.sessionId;

		const messages: MessageType[] = data.messages
			.filter((msg: RawMessage) => !['no-reply', 'path'].includes(msg.type))
			.map((msg: RawMessage): MessageType => {
				const buttons = Array.isArray(msg.payload?.buttons)
					? msg.payload!.buttons!.map((btn: { name: string; request: any }) => ({
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
