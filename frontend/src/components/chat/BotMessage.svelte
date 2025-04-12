<script lang="ts">
	interface Message {
		text: string;
		label: string;
		type: string;
		sender: string;
		source?: string;
		clickable?: boolean;
		ai?: boolean;
	}

	export let message: Message;
</script>

<div class="flex gap-1.5 flex-row w-full bot-message">
	<div class="pt-2">
		<img src="/tree.svg" alt="Bot" class="min-w-8 min-h-8" />
	</div>
	<div>
		<div class="box-border p-3 text-black rounded-xl bg-message-bot">
			{message.text}
			{#if message.ai}
				<span class="inline-block float-right mt-2 text-xs text-gray-400">KI-generiert</span>
				<div class="clear-both"></div>
			{/if}
		</div>
	</div>
</div>
