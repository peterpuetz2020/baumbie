<script lang="ts">
	import type { Message } from './types';

	export let message: Message;
	export let sendMessage: (text: string) => void;

	let selectedLabel: string | null = null;

	function handleClick(label: string) {
		if (selectedLabel !== null || !message.clickable) return;
		selectedLabel = label;
		sendMessage(label);
	}
</script>

<div class="flex gap-1.5 flex-row w-full bot-message">
	<div class="pt-2">
		<img src="/tree.svg" alt="Bot" class="min-w-8 min-h-8" />
	</div>
	<div class="w-full flex flex-row">
		{#if message.text}
			<div class="shrink box-border p-3 text-black rounded-xl bg-message-bot max-w-[80%] md:max-w-[70%]">
				{message.text}
				{#if message.ai}
					<span class="inline-block float-right mt-2 text-xs text-gray-400">KI-generiert</span>
					<div class="clear-both"></div>
				{/if}
			</div>
		{:else}
			<div class="flex flex-col gap-2 mt-1">
				{#each message.buttons ?? [] as button}
					<button
						class="box-border px-3 py-5 text-black rounded-xl text-left transition-all duration-200"
						class:bg-green-500={selectedLabel === button.label}
						class:bg-gray-300={selectedLabel !== button.label}
						class:opacity-50={selectedLabel !== null && selectedLabel !== button.label}
						class:hover:bg-green-400={selectedLabel === null}
						disabled={selectedLabel !== null}
						on:click={() => handleClick(button.label)}
					>
						{button.label}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>
