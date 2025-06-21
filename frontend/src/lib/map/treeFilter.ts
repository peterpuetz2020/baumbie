import { writable } from 'svelte/store';

function createSelectedSpecies() {
	const { subscribe, set, update } = writable<string[]>([]); // leeres Array = alle sichtbar

	return {
		subscribe,
		set,
		reset: () => set([]),
		toggle: (species: string) =>
			update((list) =>
				list.includes(species)
					? list.filter((s) => s !== species)
					: [...list, species]
			),
		has: (species: string) =>
			// zum Lesen in der Komponente
			{
				let value: string[] = [];
				const unsub = subscribe((v) => (value = v));
				unsub();
				return value.includes(species);
			}
	};
}

export const selectedSpecies = createSelectedSpecies();
