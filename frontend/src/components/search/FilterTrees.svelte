<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { PanelSection } from '$components/ui';
	import { selectedTreeFilters, loadTopSpecies } from '$lib/trees';
	import { minimizeDialog, dialogMinimized, maximizeDialog } from '$lib/ui';

	import SelectedTagsList from './selected/SelectedTagsList.svelte';
	import FilterOptionRow from './options/FilterOptionRow.svelte';
	import SpeciesFilterPanel from './options/SpeciesFilterPanel.svelte';

	let topSpecies: { label: string; count: number }[] = [];

	// Load species and auto-minimize if filters are already active
	onMount(async () => {
		topSpecies = await loadTopSpecies();

		// If there are already selected filters and we're not minimized: minimize!
		if (($selectedTreeFilters.species ?? []).length > 0 && !$dialogMinimized) {
			minimizeDialog();
		}
	});

	// Always restore dialog when this component unmounts
	onDestroy(() => {
		maximizeDialog();
	});

	// Toggle species in filter store; minimize when at least one is selected
	function toggleSpecies(species: string) {
		selectedTreeFilters.toggleSpecies(species, minimizeDialog);
	}

	// Reactive assignment of selected species
	$: current = $selectedTreeFilters.species ?? [];

	// Automatically maximize the dialog if all filters are cleared
	$: if (current.length === 0 && $dialogMinimized) {
		maximizeDialog();
	}
</script>

<!-- Filter UI wrapper -->
<div class="w-full max-w-screen-lg mx-auto space-y-3 pt-2">
	{#if $dialogMinimized}
		{#if current.length > 0}
			<!-- Display selected filters as removable tags -->
			<SelectedTagsList species={current} on:remove={(e) => toggleSpecies(e.detail)} />
		{/if}
		<!-- Compact view: show scrollable filter row -->
		<PanelSection title="Häufigste Baumarten">
			<FilterOptionRow
				options={topSpecies}
				selected={current}
				on:toggle={(e) => toggleSpecies(e.detail)}
			/>
		</PanelSection>
	{:else}
		<!-- Full view: grid layout with info and more spacing -->
		<SpeciesFilterPanel
			options={topSpecies}
			selected={current}
			on:toggle={(e) => toggleSpecies(e.detail)}
		/>
	{/if}
</div>
