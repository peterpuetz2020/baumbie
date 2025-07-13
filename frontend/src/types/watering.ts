export type Watering = {
	uuid: string;
	tree_uuid: string;
	user_uuid: string | null;
	amount_liters: number;
	watered_at: string;
	created_at: string;
};

export type WateringInput = {
	tree_uuid: string;
	amount_liters: number;
	watered_at: string;
	user_uuid?: string | null;
};