import { supabase } from './client';

export type WateringInput = {
	tree_uuid: string;
	amount_liters: number;
	watered_at: string; // Format: "YYYY-MM-DD"
	user_uuid?: string | null;
};

/**
 * Fügt einen neuen Gießvorgang in die Tabelle `waterings` ein.
 */
export async function createWatering(input: WateringInput): Promise<void> {
	const { error } = await supabase.from('waterings').insert({
		tree_uuid: input.tree_uuid,
		amount_liters: input.amount_liters,
		watered_at: input.watered_at,
		user_uuid: input.user_uuid ?? null
	});

	if (error) {
		throw new Error(`Supabase insert failed: ${error.message}`);
	}
}

export async function getWateringsForTree(tree_uuid: string): Promise<
	{
		uuid: string;
		watered_at: string;
		amount_liters: number;
		user_uuid: string | null;
		created_at: string;
	}[]
> {
	const { data, error } = await supabase
		.from('waterings')
		.select('uuid, watered_at, amount_liters, user_uuid, created_at')
		.eq('tree_uuid', tree_uuid)
		.order('created_at', { ascending: false });

	if (error) {
		throw new Error(`Fehler beim Abrufen der Gießungen: ${error.message}`);
	}

	return data ?? [];
}

export async function deleteWatering(uuid: string): Promise<void> {
	const { error } = await supabase.from('waterings').delete().eq('uuid', uuid);

	if (error) {
		throw new Error(`Fehler beim Löschen: ${error.message}`);
	}
}
