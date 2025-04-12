<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '../../supabase';
	import BotMessage from './BotMessage.svelte';
	import Message from './Message.svelte';
	import UserMessage from './UserMessage.svelte';

	export let treeId: string = '';

	let sessionId: string = '';

	$: treeId;

	console.log('Chat got Tree ID: ', treeId);

	interface Message {
		text: string;
		label: string;
		type: string;
		sender: string;
		source?: string;
		clickable?: boolean;
	}

	let messages: Array<Message> = [];

	let newMessage: string = '';
	let chatAvailable: boolean = true;

	const handleNewChatMessages = (response: unknown) => {
		console.log(response);
		if (response.error !== null) {
			console.error('Error fetching chat messages:', response.error);
			return;
		}

		const data = response.data;
		sessionId = data.sessionId;
		messages = [
			...messages,
			...data.messages
				.filter((msg) => ['no-reply', 'path'].indexOf(msg.type) === -1)
				.map((msg: unknown) => ({
					text: msg.payload.message,
					label: '',
					type: msg.payload.type,
					sender: 'bot',
					source: '',
					clickable: false
				}))
		];
	};

	onMount(() => {
		if (!treeId) {
			console.error('No treeId provided');
			return;
		}
		supabase.functions
			.invoke('chat', {
				body: {
					treeId
				}
			})
			.then(handleNewChatMessages);
	});

	function sendMessage(text: string) {
		if (text === '') {
			return;
		}
		messages = [
			...messages,
			{
				text,
				label: '',
				type: 'text',
				sender: 'user',
				source: '',
				clickable: false
			}
		];
		newMessage = '';
		supabase.functions
			.invoke('chat', {
				body: {
					sessionId,
					text: newMessage
				}
			})
			.then(handleNewChatMessages);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && newMessage !== '') {
			sendMessage(newMessage);
		}
	}
</script>

<div id="chat-container" class="flex flex-col grow">
	<div class="grow">
		<div class="sticky top-0 min-h-12 h-12 w-100 bg-gradient-to-b from-white z-[9999999]"></div>
		<div class="flex flex-col h-full overflow-y-auto gap-y-1">
			{#each messages as message}
				<Message {message} />
			{/each}
		</div>
	</div>

	<div class="sticky bottom-0 pt-2 bg-white border-t shrink border-t-gray-500">
		<div class="flex flex-row gap-2 mb-2">
			<input
				class="px-3 py-1 bg-green-500 rounded-full grow placeholder:text-neutral-500 placeholder:italic"
				disabled={!chatAvailable}
				bind:value={newMessage}
				placeholder={chatAvailable ? '' : 'Chat beendet.'}
				on:keydown={handleKeydown}
			/>
			<button
				class="shrink"
				disabled={!chatAvailable}
				on:click={(e) => {
					if (newMessage !== '') {
						sendMessage(newMessage);
					}
				}}
			>
				<img src="/sendIcon.svg" class="w-8 h-8" alt="senden" />
			</button>
		</div>
	</div>
</div>

<style>
</style>
