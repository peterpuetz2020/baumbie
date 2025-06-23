import { getDistanceInMeters } from '$lib/geo';
import type { TreeNearby } from '$types/tree';

export async function extractTreeCandidates(
	files: string[],
	minX: number,
	maxX: number,
	minY: number,
	maxY: number,
	centerLat: number,
	centerLng: number
): Promise<TreeNearby[]> {
	const candidates: TreeNearby[] = [];


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
				const tree: TreeNearby = {
					id: uuid,
					name,
					distance,
					lat,
					lng: lon,
					crown,
					tree_type_german: feature.properties.tree_type_german ?? 'Unbekannt'
				};

				candidates.push(tree);
			}
		}
	}

	return candidates;
}
