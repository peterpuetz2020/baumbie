<script lang="ts">
	import FilterOptionButton from './FilterOptionButton.svelte';
	import { createEventDispatcher } from 'svelte';

	export let options: { label: string; count: number }[] = [];
	export let selected: string[] = [];

	const dispatch = createEventDispatcher();
</script>

<div class="flex flex-wrap gap-x-4 gap-y-3">
	{#each options as item}
		<FilterOptionButton
			label={item.label}
			count={item.count}
			selected={selected.includes(item.label)}
			on:toggle={(e) => dispatch('toggle', e.detail)}
		/>
	{/each}
</div>
