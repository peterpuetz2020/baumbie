<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Heading } from '$components/ui';
	import { selectedTreeFilters, loadTopSpecies } from '$lib/trees';
	import { minimizeDialog, dialogMinimized, maximizeDialog } from '$lib/ui';

	import SelectedFiltersList from './SelectedFiltersList.svelte';
	import SpeciesButtonRow from './SpeciesButtonRow.svelte';
	import SpeciesFilterPanel from './SpeciesFilterPanel.svelte';

	let topSpecies: { label: string; count: number }[] = [];

	onMount(async () => {
		topSpecies = await loadTopSpecies();
	});

	onDestroy(() => {
		maximizeDialog();
	});

	function toggleSpecies(species: string) {
		selectedTreeFilters.toggleSpecies(species, minimizeDialog);
	}

	$: current = $selectedTreeFilters.species ?? [];

	$: if (current.length === 0 && $dialogMinimized) {
		maximizeDialog();
	}
</script>

<div class="w-full max-w-screen-lg mx-auto space-y-6 pt-2">
	{#if $dialogMinimized}
		{#if current.length > 0}
			<SelectedFiltersList species={current} on:remove={(e) => toggleSpecies(e.detail)} />
		{/if}

		<Heading level={2}>Häufigste Baumarten</Heading>
		<SpeciesButtonRow
			speciesList={topSpecies}
			selected={current}
			on:toggle={(e) => toggleSpecies(e.detail)}
		/>
	{:else}
		<SpeciesFilterPanel
			speciesList={topSpecies}
			selected={current}
			on:toggle={(e) => toggleSpecies(e.detail)}
		/>
	{/if}
</div>
