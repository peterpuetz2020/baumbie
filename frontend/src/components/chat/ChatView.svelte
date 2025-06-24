<script lang="ts">
	import { onMount } from 'svelte';
	import Message from './Message.svelte';
	import type { Message as MessageType } from '$types/chat';
	import { createChatController } from '$lib/chat';

	export let treeId: string = '';
	$: treeId;

	let messages: MessageType[] = [];
	let newMessage: string = '';
	let chatAvailable: boolean = true;

	let endRef: HTMLDivElement;
	let controller: ReturnType<typeof createChatController>;

	onMount(() => {
		if (!treeId) {
			console.error('No treeId provided');
			return;
		}

		controller = createChatController(treeId, (newMessages) => {
			messages = [...messages, ...newMessages];
		});

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

		controller.send(text);
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
