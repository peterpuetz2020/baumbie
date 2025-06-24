<script lang="ts">
	// --- Imports ---
	import { onMount } from 'svelte';
	import MessageView from './MessageView.svelte';
	import InputArea from './InputArea.svelte';
	import { useChatController } from '$lib/chat';
	import type { ChatMessage } from '$types/chat';

	// --- Props ---
	export let treeId: string = '';
	$: treeId;

	// --- State ---
	let messages: ChatMessage[] = [];
	let newMessage: string = '';
	let chatAvailable: boolean = true;
	let endRef: HTMLDivElement;
	let controller: { init: () => void; sendMessage: (text: string) => void };

	const fallbackMessage: ChatMessage = {
		text: '',
		label: '',
		type: 'text',
		sender: 'bot',
		ai: false
	};

	onMount(() => {
		if (!treeId) {
			console.error('No treeId provided');
			return;
		}

		controller = useChatController(
			treeId,
			(newMessages) => {
				messages = [...messages, ...newMessages];
			},
			(errorMessage) => {
				messages = [...messages, { ...fallbackMessage, text: errorMessage }];
				chatAvailable = false;
			}
		);

		controller.init();
	});

	function handleSendMessage(text: string) {
		if (text.trim() === '') return;

		messages = [
			...messages,
			{
				text,
				label: '',
				type: 'text',
				sender: 'user'
			}
		];

		controller.sendMessage(text);
		newMessage = '';
	}

	$: {
		if (endRef && messages.length > 0) {
			queueMicrotask(() => {
				endRef.scrollIntoView({ behavior: 'smooth' });
			});
		}
	}
</script>

<div id="chat-container" class="flex flex-col h-full min-h-0">
	<div class="flex flex-col grow overflow-y-auto gap-y-1 min-h-0">
		{#each messages as message}
			<MessageView {message} sendMessage={handleSendMessage} />
		{/each}
		<div bind:this={endRef} class="min-h-3"></div>
	</div>
</div>

<InputArea bind:value={newMessage} disabled={!chatAvailable} onSend={handleSendMessage} />
