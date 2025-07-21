<script lang="ts">
	export let label: string;
	export let removable: boolean = false;

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<span class="inline-flex items-center text-xs rounded-full px-2 py-1 bg-green-600 text-white">
	{label}
	{#if removable}
		<button
			type="button"
			class="ml-1 text-white hover:text-gray-200 focus:outline-none text-sm leading-none"
			on:click={() => dispatch('remove')}
		>
			✕
		</button>
	{/if}
</span>
