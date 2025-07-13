import { supabase } from './client';

/**
 * Holt den deutschen Baumtyp eines Baumes anhand seiner UUID.
 */
export async function fetchSpecies(tree_uuid: string): Promise<string | null> {
	const { data, error } = await supabase
		.from('trees')
		.select('tree_type_german')
		.eq('uuid', tree_uuid)
		.single();

	if (error) {
		console.error('Fehler beim Laden des Baumtyps:', error.message);
		return null;
	}

	return data?.tree_type_german ?? null;
}

/**
 * Holt die Baumarten für eine Liste von Tree-UUIDs und gibt eine Map zurück.
 */
export async function loadSpeciesMap(treeIds: string[]): Promise<Map<string, string>> {
	const speciesMap = new Map<string, string>();

	await Promise.all(
		treeIds.map(async (treeId) => {
			if (speciesMap.has(treeId)) return;
			const species = await fetchSpecies(treeId);
			speciesMap.set(treeId, species ?? 'Baum');
		})
	);

	return speciesMap;
}