<script lang="ts">
	import FilterOptionButton from './FilterOptionButton.svelte';
	import { createEventDispatcher } from 'svelte';

	export let options: { label: string; count: number }[] = [];
	export let selected: string[] = [];

	const dispatch = createEventDispatcher();
</script>

<div class="overflow-x-auto -mx-2 px-2">
	<div class="flex gap-2 pb-1" style="width: max-content; min-width: 100%;">
		{#each options as item}
			<FilterOptionButton
				label={item.label}
				count={item.count}
				selected={selected.includes(item.label)}
				on:toggle={(e) => dispatch('toggle', e.detail)}
			/>
		{/each}
	</div>
</div>
