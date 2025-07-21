<script lang="ts">
	export let species: string[] = [];

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

{#if species.length > 0}
	<div class="px-2 pt-1 pb-1 flex flex-wrap gap-2">
		{#each species as label}
			<button
				type="button"
				class="px-2 py-1 rounded-full bg-gray-200 text-xs text-gray-700 cursor-pointer hover:bg-gray-300 transition"
				on:click={() => dispatch('remove', label)}
			>
				{label} ✕
			</button>
		{/each}
	</div>
{/if}
