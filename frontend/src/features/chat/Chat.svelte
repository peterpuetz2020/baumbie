<script lang="ts">
	import Chat from '$components/chat/Chat.svelte';
	import { onMount } from 'svelte';
	import { startChat, sendMessage } from '$api/chat';

	export let treeId: string = '';
	$: treeId;

	let sessionId: string = '';
	let messages: any[] = [];
	let newMessage: string = '';
	let chatAvailable: boolean = true;

	onMount(() => {
		if (!treeId) {
			console.error('No treeId provided');
			return;
		}
		startChat(treeId, onHandleNewMessages);
	});

	const onHandleNewMessages = (response: unknown) => {
		if (
			typeof response !== 'object' ||
			response === null ||
			!('data' in response) ||
			!('error' in response)
		) {
			messages = [
				...messages,
				{
					text: 'Leider ist ein Fehler bei der Interaktion aufgetreten. Bitte versuche es später noch einmal oder melde dich gerne mit Feedback per Mail unter bielefeld@codefor.de.',
					label: '',
					type: 'text',
					sender: 'bot',
					buttons: null,
					ai: false
				}
			];
			chatAvailable = false;
			return;
		}

		const { data, error } = response as { data: any; error: any };

		if (error !== null) {
			messages = [
				...messages,
				{
					text: 'Leider ist ein Fehler bei der Interaktion aufgetreten. Bitte versuche es später noch einmal oder melde dich gerne mit Feedback per Mail unter bielefeld@codefor.de.',
					label: '',
					type: 'text',
					sender: 'bot',
					buttons: null,
					ai: false
				}
			];
			chatAvailable = false;
			return;
		}

		sessionId = data.sessionId;
		messages = [
			...messages,
			...data.messages
				.filter((msg) => !['no-reply', 'path'].includes(msg.type))
				.map((msg) => {
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
				})
		];
	};

	const onSendMessage = ({ text, label }: { text: string; label: string }) => {
		if (text === '') {
			return;
		}
		const newUserMessage = {
			text,
			label: label ?? '',
			type: 'text',
			sender: 'user'
		};

		messages = [...messages, newUserMessage];
		newMessage = '';

		sendMessage(label ?? text, sessionId, onHandleNewMessages);
	};
</script>

<div id="chat-wrapper">
	<Chat {onSendMessage} {messages} {newMessage} {chatAvailable} />
</div>
