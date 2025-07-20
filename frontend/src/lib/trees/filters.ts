import { writable } from 'svelte/store';
import type { TreeFilter } from '$types/tree';

// Factory function for the selectedTreeFilters store
function createSelectedTreeFilters() {
	const { subscribe, set, update } = writable<TreeFilter>({});

	return {
		subscribe,
		set,
		update,

		// Clear all filters
		reset: () => set({}),

		// Toggle a species in the filter; run callback if species remain selected
		toggleSpecies: (species: string, onSpeciesSelected?: () => void) =>
			update((filters) => {
				const current: string[] = filters.species ?? [];
				const newList = current.includes(species)
					? current.filter((s) => s !== species)
					: [...current, species];

				if (newList.length > 0 && onSpeciesSelected) {
					onSpeciesSelected();
				}

				return { ...filters, species: newList };
			})
	};
}

export const selectedTreeFilters = createSelectedTreeFilters();