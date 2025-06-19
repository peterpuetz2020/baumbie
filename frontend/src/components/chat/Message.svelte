<script lang="ts">
	import BotMessage from './BotMessage.svelte';
	import UserMessage from './UserMessage.svelte';
	import type { Message as MessageType } from '../../types/chat';

	export let message: MessageType;
	export let sendMessage: ({ text, label }: { text: string; label: string }) => void;
</script>

<div class="flex flex-row w-full message">
	{#if message.sender === 'bot'}
		<BotMessage {message} {sendMessage} />
	{:else if message.sender === 'user'}
		<UserMessage {message} />
	{/if}
</div>
