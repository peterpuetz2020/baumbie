<script lang="ts">
	import SpeciesButton from './SpeciesButton.svelte';
	import { createEventDispatcher } from 'svelte';

	export let speciesList: { label: string; count: number }[] = [];
	export let selected: string[] = [];

	const dispatch = createEventDispatcher();
</script>

<div class="overflow-x-auto -mx-2 px-2">
	<div class="flex gap-2 pb-1" style="width: max-content; min-width: 100%;">
		{#each speciesList as species}
			<SpeciesButton
				label={species.label}
				count={species.count}
				selected={selected.includes(species.label)}
				on:toggle={(e) => dispatch('toggle', e.detail)}
			/>
		{/each}
	</div>
</div>
