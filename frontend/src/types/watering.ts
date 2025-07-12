export type BaseWatering = {
	uuid: string;
	watered_at: string;
	amount_liters: number;
	user_uuid: string | null;
	created_at: string;
};

export type WateringWithTree = BaseWatering & {
	tree?: {
		uuid: string;
		tree_type_german?: string;
	};
};
