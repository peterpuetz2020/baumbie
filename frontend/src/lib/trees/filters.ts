import { writable } from 'svelte/store';
import type { TreeFilter } from '$types/tree';

function createSelectedTreeFilters() {
	const { subscribe, set, update } = writable<TreeFilter>({});

	return {
		subscribe,
		set,
		update,
		reset: () => set({}),
		toggleSpecies: (species: string) =>
			update((filters) => {
				const current = filters.species ?? [];
				const newList = current.includes(species)
					? current.filter((s) => s !== species)
					: [...current, species];
				return { ...filters, species: newList };
			}),
		hasSpecies: (species: string) => {
			let value: TreeFilter = {};
			const unsub = subscribe((v) => (value = v));
			unsub();
			return value.species?.includes(species) ?? false;
		}
	};
}

export const selectedTreeFilters = createSelectedTreeFilters();
