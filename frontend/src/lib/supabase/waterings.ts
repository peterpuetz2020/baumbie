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
	{ watered_at: string; amount_liters: number }[]
> {
	const { data, error } = await supabase
		.from('waterings')
		.select('watered_at, amount_liters')
		.eq('tree_uuid', tree_uuid)
		.order('watered_at', { ascending: false });

	if (error) {
		throw new Error(`Fehler beim Abrufen der Gießungen: ${error.message}`);
	}

	return data ?? [];
}
