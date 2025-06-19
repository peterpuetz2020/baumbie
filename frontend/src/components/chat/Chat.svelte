<script lang="ts">
	// === Imports ===
	import { onMount } from 'svelte';
	import Message from './Message.svelte';
	import type { Message as MessageType, RawMessage } from '../../types/chat';

	// === Props ===
	export let treeId: string = '';
	export let newMessage: string = '';
	$: treeId, newMessage;
	console.log('Chat got Tree ID: ', treeId);

	export let onSendMessage: ({ text, label }: { text: string; label: string }) => void = () => {};

	// === State ===
	export let messages: MessageType[] = [];
	export let chatAvailable: boolean = true;

	let endRef: HTMLDivElement;

	// === Helpers ===
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && newMessage !== '') {
			onSendMessage({ text: newMessage, label: '' });
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

<!-- Chat innerhalb der Card -->
<div id="chat-container" class="flex flex-col h-full min-h-0">
	<!--
	TODO für später: transparenten Verlauf umsetzen
	<div class="sticky top-0 min-h-12 h-12 w-100 bg-gradient-to-b from-red-800 z-[9999999]"></div>
	-->
	<!-- Nachrichtenbereich -->

	<div class="flex flex-col min-h-0 overflow-y-auto grow gap-y-1">
		{#each messages as message}
			<Message {message} sendMessage={onSendMessage} />
		{/each}
		<div bind:this={endRef} class="min-h-3"></div>
	</div>

	<!-- Eingabe -->
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
				on:click={() => newMessage && onSendMessage(newMessage)}
				disabled={!chatAvailable}
			>
				<img src="/chat/send.svg" class="w-8 h-8" alt="senden" />
			</button>
		</div>
	</div>
</div>
