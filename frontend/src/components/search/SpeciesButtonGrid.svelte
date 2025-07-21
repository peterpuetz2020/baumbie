<script lang="ts">
	import SpeciesButton from './SpeciesButton.svelte';
	import { createEventDispatcher } from 'svelte';

	export let speciesList: { label: string; count: number }[] = [];
	export let selected: string[] = [];

	const dispatch = createEventDispatcher();
</script>

<div class="flex flex-wrap gap-x-4 gap-y-3">
	{#each speciesList as species}
		<SpeciesButton
			label={species.label}
			count={species.count}
			selected={selected.includes(species.label)}
			on:toggle={(e) => dispatch('toggle', e.detail)}
		/>
	{/each}
</div>
