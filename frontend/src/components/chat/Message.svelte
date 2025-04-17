<script lang="ts">
	import BotMessage from './BotMessage.svelte';
	import UserMessage from './UserMessage.svelte';
	import type { Message as MessageType } from './types';

	export let message: MessageType;
	export let sendMessage: (text: string) => void;
</script>

<div
	class={`message flex flex-row w-full ${message.sender === 'bot' ? 'justify-start' : 'justify-end'} mb-2`}
>
	{#if message.sender === 'bot'}
		<BotMessage {message} {sendMessage}/>
	{:else if message.sender === 'user'}
		<UserMessage {message} />
	{/if}
</div>
