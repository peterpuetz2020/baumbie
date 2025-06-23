import { getBoundingBox, getCurrentPosition, findMatchingSegments } from '$lib/geo';
import { extractTreeCandidates } from '$lib/trees';
import type { TreeNearby } from '$types/tree';

/**
 * Find up to 5 trees closest to the user's current location.
 *
 * The function searches in a series of increasing radius steps until matching trees are found.
 * Only trees matching the optional species filter will be considered.
 *
 * @param speciesFilter - Array of allowed tree species (German names). If empty, all species are considered.
 * @returns A promise resolving to an array of up to 5 nearby trees sorted by distance.
 */
export async function findNearbyTrees(speciesFilter: string[] = []): Promise<TreeNearby[]> {
	const coords = await getCurrentPosition();

	// Search radii in degrees (~lat/lng). Will try each until at least one match is found.
	const radiusSteps = [0.0015, 0.005, 0.01];

	for (const radiusDeg of radiusSteps) {
		// Define bounding box for current radius
		const { minX, maxX, minY, maxY } = getBoundingBox(
			coords.latitude,
			coords.longitude,
			radiusDeg
		);

		// Find segment files intersecting bounding box
		const segmentFiles = await findMatchingSegments(minX, maxX, minY, maxY);

		// Extract all candidate trees within the bounding box
		const allCandidates = await extractTreeCandidates(
			segmentFiles,
			minX,
			maxX,
			minY,
			maxY,
			coords.latitude,
			coords.longitude
		);

		// Apply species filter if provided
		const filtered = speciesFilter.length === 0
			? allCandidates
			: allCandidates.filter(tree =>
				speciesFilter.includes(tree.tree_type_german ?? '')
			);

		// Return top 5 trees by distance if any match found
		if (filtered.length > 0) {
			return filtered
				.sort((a, b) => a.distance - b.distance)
				.slice(0, 5);
		}
	}

	// No trees found within any search radius
	return [];
}
