<script lang="ts">
	import BotMessage from './BotMessage.svelte';
	import UserMessage from './UserMessage.svelte';
	import type { ChatMessage } from '$types/chat';

	export let message: ChatMessage;
	export let onUserReply: (text: string) => void;
</script>

<div class="message flex flex-row w-full">
	{#if message.sender === 'bot'}
		<BotMessage {message} {onUserReply} />
	{:else if message.sender === 'user'}
		<UserMessage {message} />
	{/if}
</div>
