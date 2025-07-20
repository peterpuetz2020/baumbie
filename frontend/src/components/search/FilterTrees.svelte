<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Button, Notice } from '$components/ui';
	import { selectedTreeFilters, loadTopSpecies } from '$lib/trees';
	import { minimizeDialog, dialogMinimized, maximizeDialog } from '$lib/ui';

	let topSpecies: { label: string; count: number }[] = [];

	// Load the top 30 species when the component is mounted
	onMount(async () => {
		topSpecies = await loadTopSpecies();
	});

	// Always restore full panel view when this component is destroyed
	onDestroy(() => {
		maximizeDialog();
	});

	// Toggle a species and minimize the panel if any species remain selected
	function toggleSpecies(species: string) {
		selectedTreeFilters.toggleSpecies(species, minimizeDialog);
	}

	// Reactive reference to currently selected species
	$: current = $selectedTreeFilters.species ?? [];

	// Automatically maximize the panel if all filters are cleared
	$: if (current.length === 0 && $dialogMinimized) {
		maximizeDialog();
	}
</script>

<div class="w-full max-w-screen-lg mx-auto space-y-10 pt-2">
	<!-- Beschreibung - nur im maximierten Zustand anzeigen -->
	{#if !$dialogMinimized}
		<div class="space-y-2 text-lg text-gray-800 leading-relaxed">
			<Notice tone="info">
				Hier kannst du gezielt nach bestimmten Baumarten filtern. Zur Auswahl stehen die <strong
					>30 häufigsten</strong
				>
				Arten in Bielefeld, die gemeinsam rund
				<strong>85 % aller Stadtbäume</strong> ausmachen. Wähle eine oder mehrere Arten aus – die Karte
				zeigt anschließend nur diese an.
			</Notice>
		</div>
	{/if}

	<!-- Graue Box -->
	<div class="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-6 space-y-6 w-full">
		<!-- Baumarten-Buttons -->
		<div class="flex flex-wrap gap-x-4 gap-y-3">
			{#each topSpecies as species}
				<Button
					onClick={() => toggleSpecies(species.label)}
					variant={current.includes(species.label) ? 'primary' : 'default'}
				>
					<strong>{species.label}</strong>&nbsp;({species.count})
				</Button>
			{/each}
		</div>

		<!-- 🔁 Alle anzeigen unten -->
		<div>
			<Button
				variant={current.length === 0 ? 'primary' : 'default'}
				onClick={() => selectedTreeFilters.set({ species: [] })}
				className="w-full justify-center"
			>
				<strong>Alle Baumarten anzeigen</strong>
			</Button>
		</div>
	</div>
</div>
