import { supabase } from '../../supabase';
import type { AdoptedTree } from '$types/tree';

export async function loadAdoptedTrees() {
	const { data: userData } = await supabase.auth.getUser();
	const userId = userData?.user?.id;
	if (!userId) return [];

	const { data: adoptions, error: adoptionError } = await supabase
		.from('adoptions')
		.select()
		.eq('user_uuid', userId);

	if (adoptionError) throw adoptionError;

	const trees = await Promise.all(
		adoptions.map(async ({ tree_uuid }) => {
			const { data, error } = await supabase
				.from('trees')
				.select('tree_type_german')
				.eq('uuid', tree_uuid)
				.maybeSingle();

			if (error) {
				console.error(error);
				return null;
			}

			return {
				id: tree_uuid,
				name: data?.tree_type_german || 'Unbekannter Baum'
			};
		})
	);

	return trees.filter((tree): tree is AdoptedTree => tree !== null);

}
