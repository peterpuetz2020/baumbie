import { supabase } from '$lib/supabase';

export const startChat = async (
	treeId: string,
	cb: (response: unknown) => void
) => {
	const response = await supabase.functions.invoke('chat', {
		body: { treeId }
	});
	cb(response);
};

export const sendMessage = async (
	text: string,
	sessionId: string,
	cb: (response: unknown) => void
) => {
	const response = await supabase.functions.invoke('chat', {
		body: { sessionId, text }
	});
	cb(response);
};
