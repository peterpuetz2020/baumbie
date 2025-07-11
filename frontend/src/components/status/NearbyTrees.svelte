<script lang="ts">
	// Svelte & Stores
	import { get } from 'svelte/store';

	// UI-Komponenten
	import { Button, Notice } from '$components/ui';

	// Kartenlogik
	import { focusTreeById, mapStore } from '$lib/map';

	// Bäume
	import type { TreeNearby } from '$types/tree';
	import { findNearbyTrees, selectedTreeFilters } from '$lib/trees';

	let treesNearby: TreeNearby[] = [];

	let errorMessage: string | null = null;

	$: isFiltered = ($selectedTreeFilters.species?.length ?? 0) > 0;
	$: selectedSpecies = $selectedTreeFilters.species ?? [];

	async function findTreesNearby() {
		treesNearby = [];
		errorMessage = null;
		let filter = get(selectedTreeFilters);

		try {
			treesNearby = await findNearbyTrees(filter.species ?? []);

			if (treesNearby.length === 0) {
				errorMessage = 'Keine Bäume in deiner Nähe gefunden.';
			}
		} catch (error) {
			errorMessage = 'Dein Standort konnte nicht ermittelt werden.';
		}
	}

	function handleClick(tree: TreeNearby) {
		const map = get(mapStore);
		if (map) {
			focusTreeById(map, tree.id);
		}
	}
</script>

<Button variant="primary" onClick={findTreesNearby}>Jetzt Bäume finden</Button>

{#if errorMessage}
	<Notice tone="warning">{errorMessage}</Notice>
{/if}

{#if isFiltered}
	<Notice tone="info">
		Hinweis: Es werden nur Bäume der ausgewählten Arten berücksichtigt.<br />
		<small>
			Ausgewählt: {selectedSpecies.join(', ')}
		</small>
	</Notice>
{/if}

{#if treesNearby.length}
	<ul class="mt-4 divide-y divide-gray-200 text-sm">
		{#each treesNearby as tree}
			<li class="flex items-center justify-between py-2">
				<div class="flex items-center gap-2">
					<span>{tree.name}</span>
					<img src="/icons/tree.svg" alt="Baum" class="w-4 h-4" />
				</div>

				<Button onClick={() => handleClick(tree)}>
					{tree.distance.toFixed(1)} m →
				</Button>
			</li>
		{/each}
	</ul>
{/if}
