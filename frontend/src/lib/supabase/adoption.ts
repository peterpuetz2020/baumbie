import { supabase } from './client';

/**
 * Prüft, ob der aktuelle Benutzer diesen Baum adoptiert hat.
 */
export async function isTreeAdopted(treeUuid: string, userUuid: string): Promise<boolean> {
	const { data, error } = await supabase
		.from('adoptions')
		.select('*')
		.eq('tree_uuid', treeUuid)
		.eq('user_uuid', userUuid);

	if (error) {
		console.warn('Fehler bei isTreeAdopted():', error.message);
		return false;
	}

	return Array.isArray(data) && data.length > 0;
}

/**
 * Schaltet die Adoption dieses Baums um (adoptiert ⇄ entfernt).
 */
export async function toggleTreeAdoption(treeUuid: string, userUuid: string): Promise<'adopted' | 'removed'> {
	const alreadyAdopted = await isTreeAdopted(treeUuid, userUuid);

	if (alreadyAdopted) {
		const { error } = await supabase
			.from('adoptions')
			.delete()
			.eq('tree_uuid', treeUuid)
			.eq('user_uuid', userUuid);
		if (error) throw new Error(error.message);
		return 'removed';
	} else {
		const { error } = await supabase
			.from('adoptions')
			.insert({ tree_uuid: treeUuid, user_uuid: userUuid });
		if (error) throw new Error(error.message);
		return 'adopted';
	}
}
