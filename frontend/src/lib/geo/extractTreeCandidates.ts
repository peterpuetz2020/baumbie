import { getDistanceInMeters } from '$lib/geo/distance';

export async function extractTreeCandidates(
	files: string[],
	minX: number,
	maxX: number,
	minY: number,
	maxY: number,
	centerLat: number,
	centerLng: number
) {
	const candidates: {
		id: string;
		name: string;
		distance: number;
		lat: number;
		lng: number;
		crown?: number;
	}[] = [];

	for (const file of files) {
		const res = await fetch(`/segments/${file}`);
		const geojson = await res.json();

		for (const feature of geojson.features) {
			const [lon, lat] = feature.geometry.coordinates;

			if (lon >= minX && lon <= maxX && lat >= minY && lat <= maxY) {
				const uuid = feature.properties.uuid;
				const name = feature.properties.tree_type_german ?? 'Unbekannter Baum';
				const crown = feature.properties.crown_diameter;
				const distance = Math.round(getDistanceInMeters(centerLat, centerLng, lat, lon));
				candidates.push({ id: uuid, name, distance, lat, lng: lon, crown });
			}
		}
	}

	return candidates;
}
