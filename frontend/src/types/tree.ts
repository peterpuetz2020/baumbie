export interface TreeData {
	uuid: string;
	provider_id: string;
	source_id: string;
	location: number;
	location_addition: string;
	current_number: number;
	chopped: boolean;
	trunk_diameter: number;
	trunk_circumference: number;
	crown_diameter: number;
	height: number;
	tree_group: number;
	district_number: number;
	district_name: string;
	object_number: number;
	object_name: string;
	tree_type_botanic: string;
	tree_type_german: string;
	tree_type_short: string;
	care_number: string;
	care_type: string;
	trunk_radius: number;
	crown_radius: number;
	geocoordinates: string;
}

export type TreeFeature = {
	type: 'Feature';
	properties: {
		uuid: string;
		tree_type_german: string;
		[key: string]: unknown; 
	};
	geometry: {
		type: 'Point';
		coordinates: [number, number];
	};
};

export type TreeMeta = {
	id: string;
	name: string;
	tree_type_german: string;
};

/** 
 * Lightweight tree info used for display of trees near user's location.
 * Includes only spatial and display-relevant data.
 */
export type TreeNearby = {
	id: string;
	name: string;
	distance: number;
	lat: number;
	lng: number;
	tree_type_german: string;
	crown?: number;
}

export type TreeFilter = {
	species?: string[];       // Baumarten
	minCrown?: number;        // Mindest-Kronendurchmesser
	maxCrown?: number;        // Maximaler Kronendurchmesser
	minHeight?: number;
	maxHeight?: number;
};

