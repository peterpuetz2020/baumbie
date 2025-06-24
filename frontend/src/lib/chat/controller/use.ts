import type { ChatMessage } from '$types/chat';
import { createChatController } from './create';

// --- UI Helper Hook ---
export function useChatController(
	treeId: string,
	onUpdate: (msgs: ChatMessage[]) => void,
	onError?: (errMsg: string) => void
) {

	let controller: ReturnType<typeof createChatController>;

	const init = () => {
		controller = createChatController(treeId, onUpdate, onError);
		controller.init();
	};

	const sendMessage = (text: string) => {
		if (!text.trim()) return;
		controller.send(text);
	};

	return { init, sendMessage };
}