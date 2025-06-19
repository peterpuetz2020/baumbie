import { supabase } from '../supabase';

const startChat = (treeId: string, cb: (response: unknown) => void) => {
	supabase.functions
		.invoke('chat', {
			body: {
				treeId
			}
		})
		.then((res) => {
			console.log('Chat started:', res);
			cb(res);
		});
};

const sendMessage = (text: string, sessionId: string, cb: (response: unknown) => void) => {
	supabase.functions
		.invoke('chat', {
			body: {
				sessionId,
				text
			}
		})
		.then(cb);
};

export { startChat, sendMessage };
