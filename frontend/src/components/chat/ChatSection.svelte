<script lang="ts">
	// --- Imports ---
	import { onMount } from 'svelte';
	import MessageView from './MessageView.svelte';
	import InputArea from './InputArea.svelte';
	import { createChatController } from '$lib/chat/controller';
	import type { ChatMessage } from '$types/chat';

	// --- Props ---
	export let treeId: string = '';
	$: treeId;

	// --- State ---
	let messages: ChatMessage[] = [];
	let newMessage: string = '';
	let chatAvailable: boolean = true;
	let endRef: HTMLDivElement;
	let controller: ReturnType<typeof createChatController>;

	const fallbackMessage: ChatMessage = {
		text: '',
		label: '',
		type: 'text',
		sender: 'bot',
		ai: false
	};

	const handleUpdate = (newMessages: ChatMessage[]) => {
		messages = [...messages, ...newMessages];
	};

	const handleError = (errorMessage: string) => {
		messages = [...messages, { ...fallbackMessage, text: errorMessage }];
		chatAvailable = false;
	};

	onMount(() => {
		if (!treeId) {
			console.error('No treeId provided');
			return;
		}

		controller = createChatController(treeId, handleUpdate, handleError);
		controller.init();
	});

	function handleUserReply(text: string) {
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

		controller.send(text);
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
			<MessageView {message} onUserReply={handleUserReply} />
		{/each}
		<div bind:this={endRef} class="min-h-3"></div>
	</div>
</div>

<InputArea bind:value={newMessage} disabled={!chatAvailable} onSend={handleUserReply} />
