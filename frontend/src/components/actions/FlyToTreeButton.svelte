<script lang="ts">
	import { get } from 'svelte/store';
	import { mapStore, focusTreeById } from '$lib/map';
	import { selectedTreeFilters } from '$lib/trees';
	import { Button } from '$components/ui';
	import { createEventDispatcher } from 'svelte';

	export let treeId: string;
	export let treeSpecies: string | null = null;

	const dispatch = createEventDispatcher();

	function handleClick() {
		const map = get(mapStore);
		if (!map) return;

		const speciesFilter = get(selectedTreeFilters).species ?? [];

		// Falls die Baumart gefiltert ist → Warnung an übergeordnete Komponente senden
		if (treeSpecies && speciesFilter.length > 0 && !speciesFilter.includes(treeSpecies)) {
			dispatch('warning', {
				message: `${treeSpecies} ist durch deinen Filter ausgeblendet und kann daher gerade nicht angesteuert werden.`
			});
			return;
		}

		// Fokus auf Baum setzen
		focusTreeById(map, treeId);
	}
</script>

<div class="flex items-center gap-1">
	<Button onClick={handleClick} className="gap-1 text-sm" variant="secondary">
		{treeSpecies}
		<img src="/icons/tree.svg" alt="Baum" class="w-4 h-4" />
		<span>→</span>
	</Button>
</div>
