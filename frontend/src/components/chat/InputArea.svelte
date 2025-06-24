<script lang="ts">
	export let value: string;
	export let disabled: boolean = false;
	export let onSend: (text: string) => void;

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && value.trim() !== '') {
			onSend(value);
		}
	}

	function handleClick() {
		if (value.trim() !== '') {
			onSend(value);
		}
	}
</script>

<div class="sticky bottom-0 bg-white p-3 border-t z-[10] border-t-gray-500">
	<div class="flex flex-row gap-2">
		<input
			type="text"
			bind:value
			class="px-3 py-1 bg-green-500 rounded-full grow placeholder:text-neutral-500 placeholder:italic"
			placeholder={disabled ? 'Chat beendet.' : ''}
			on:keydown={handleKeydown}
			{disabled}
		/>
		<button class="shrink" on:click={handleClick} {disabled}>
			<img src="/chat/send.svg" class="w-8 h-8" alt="senden" />
		</button>
	</div>
</div>
