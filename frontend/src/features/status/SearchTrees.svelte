<script lang="ts">
	import Heading from '../../components/typography/Heading.svelte';
	import { getCurrentPosition, getBoundingBox, extractTreeCandidates } from '$lib/geo';
	import { goToTree } from '$lib/map/goToTree';
	import findMatchingSegments from '../../businessLogic/findSegments';

	let locationInfo = 'Noch kein Standort bestimmt.';
	let treesNearby: {
		id: string;
		name: string;
		distance: number;
		lat: number;
		lng: number;
		crown?: number;
	}[] = [];

	async function findTreesNearby() {
		locationInfo = '📍 Standort wird bestimmt...';
		treesNearby = [];

		try {
			const coords = await getCurrentPosition();
			locationInfo = `📍 Standort: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;

			// We use a radius of 0.0015 degrees (~150 m) as a compromise:
			// This ensures enough trees are included for comparison,
			// while limiting the number of distance calculations for performance.
			const radiusDeg = 0.0015;
			const { minX, maxX, minY, maxY } = getBoundingBox(
				coords.latitude,
				coords.longitude,
				radiusDeg
			);

			const segmentFiles = await findMatchingSegments(minX, maxX, minY, maxY);

			const candidates = await extractTreeCandidates(
				segmentFiles,
				minX,
				maxX,
				minY,
				maxY,
				coords.latitude,
				coords.longitude
			);

			treesNearby = candidates.sort((a, b) => a.distance - b.distance).slice(0, 5);
		} catch (error) {
			locationInfo = '❌ Standort konnte nicht ermittelt werden.';
		}
	}
</script>

<div class="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
	<Heading level={2}>🌳 Bäume in deiner Nähe</Heading>

	<button
		on:click={findTreesNearby}
		class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
	>
		Bäume in der Nähe finden
	</button>

	<p class="text-sm text-gray-700">{locationInfo}</p>

	{#if treesNearby.length}
		<table class="w-full border border-collapse border-gray-300 mt-4">
			<thead class="bg-gray-100">
				<tr>
					<th class="p-2 border w-[2.5rem] text-center"></th>
					<th class="text-left p-2 border">Baumart</th>
					<th class="text-left p-2 border">Entfernung (m)</th>
					<th class="text-left p-2 border">Krone (m)</th>
				</tr>
			</thead>
			<tbody>
				{#each treesNearby as tree}
					<tr class="hover:bg-green-50 transition-colors">
						<td class="p-2 border text-center">
							<button
								class="text-xl hover:scale-125 transition-transform"
								on:click={() => goToTree(tree)}
								aria-label="Baumdetails anzeigen"
							>
								<img src="/icons/tree.svg" alt="Baum anzeigen" class="w-5 h-5 inline-block" />
							</button>
						</td>
						<td class="p-2 border">{tree.name}</td>
						<td class="p-2 border">{tree.distance}</td>
						<td class="p-2 border">{tree.crown?.toFixed(1) ?? '–'}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
