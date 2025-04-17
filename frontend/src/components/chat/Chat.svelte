<script lang="ts">
	// === Imports ===
	import { onMount } from 'svelte';
	import { supabase } from '../../supabase';
	import Message from './Message.svelte';
	import type { Message as MessageType, RawMessage } from './types';

	// === Props ===
	export let treeId: string = '';
	$: treeId;
	console.log('Chat got Tree ID: ', treeId);
	
	// === State ===
	let sessionId: string = '';
	let messages: MessageType[] = [];
	let newMessage: string = '';
	let chatAvailable: boolean = true;


	// === Lifecycle ===
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

	// === Helpers ===
	const handleNewChatMessages = (response: unknown) => {
		console.log(response);
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
						? msg.payload!.buttons!.map((btn) => ({
								label: btn.name,
								request: btn.request
							}))
						: [];

					return {
						text: msg.payload?.message ?? '',
						label: '',
						type: msg.payload?.type ?? msg.type,
						sender: 'bot',
						source: '',
						clickable: buttons.length > 0,
						buttons
					};
				})
		];

	};

	function sendMessage(text: string) {
		if (text === '') {
			return;
		}
		const newUserMessage: MessageType = {
			text,
			label: '',
			type: 'text',
			sender: 'user',
			source: '',
			clickable: false
		};

		messages = [...messages, newUserMessage];

		supabase.functions
			.invoke('chat', {
				body: {
					sessionId,
					text
				}
			})
			.then(handleNewChatMessages);

		newMessage = '';
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
				<Message {message} {sendMessage} />
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