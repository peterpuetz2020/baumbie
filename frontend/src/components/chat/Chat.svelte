<script lang="ts">
	import { onMount } from 'svelte';
	import Message from './Message.svelte';
	import type { Message as MessageType, RawMessage } from '$types/chat';
	import { startChat, sendMessage } from '$lib/chat/api';

	export let treeId: string = '';
	$: treeId;

	let sessionId: string = '';
	let messages: MessageType[] = [];
	let newMessage: string = '';
	let chatAvailable: boolean = true;

	let endRef: HTMLDivElement;

	onMount(() => {
		if (!treeId) {
			console.error('No treeId provided');
			return;
		}
		startChat(treeId, handleNewChatMessages);
	});

	const handleNewChatMessages = (response: unknown) => {
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

		if (error !== null) {
			console.error('Error fetching chat messages:', error);
			return;
		}

		sessionId = data.sessionId;
		messages = [
			...messages,
			...data.messages
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
				})
		];
	};

	function handleSendMessage(text: string) {
		if (text === '') return;

		const newUserMessage: MessageType = {
			text,
			label: '',
			type: 'text',
			sender: 'user'
		};

		messages = [...messages, newUserMessage];

		sendMessage(text, sessionId, handleNewChatMessages);
		newMessage = '';
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && newMessage !== '') {
			handleSendMessage(newMessage);
		}
	}

	$: {
		if (endRef && messages.length > 0) {
			queueMicrotask(() => {
				endRef.scrollIntoView({ behavior: 'smooth' });
			});
		}
	}
</script>

<!-- UI bleibt 1:1 wie gehabt -->
<div id="chat-container" class="flex flex-col h-full min-h-0">
	<div class="flex flex-col grow overflow-y-auto gap-y-1 min-h-0">
		{#each messages as message}
			<Message {message} sendMessage={handleSendMessage} />
		{/each}
		<div bind:this={endRef} class="min-h-3"></div>
	</div>

	<div class="sticky bottom-0 bg-white p-3 border-t z-[10] border-t-gray-500">
		<div class="flex flex-row gap-2">
			<input
				type="text"
				bind:value={newMessage}
				class="px-3 py-1 bg-green-500 rounded-full grow placeholder:text-neutral-500 placeholder:italic"
				placeholder={chatAvailable ? '' : 'Chat beendet.'}
				on:keyup={handleKeydown}
				disabled={!chatAvailable}
			/>
			<button
				class="shrink"
				on:click={() => newMessage && handleSendMessage(newMessage)}
				disabled={!chatAvailable}
			>
				<img src="/chat/send.svg" class="w-8 h-8" alt="senden" />
			</button>
		</div>
	</div>
</div>
