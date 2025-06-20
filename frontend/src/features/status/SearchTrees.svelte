<script lang="ts">
	import Heading from '../../components/typography/Heading.svelte';
	import { getCurrentPosition } from '$lib/geo/location';
	import { getDistanceInMeters } from '$lib/geo/distance';
	import findMatchingSegments from '../../businessLogic/findSegments';
	import { goto } from '$app/navigation';

	let locationInfo = 'Noch kein Standort bestimmt.';
	let debugLog: string[] = [];
	let treesNearby: {
		id: string;
		name: string;
		distance: number;
		crown?: number;
	}[] = [];

	async function findTreesNearby() {
		locationInfo = '📍 Standort wird bestimmt...';
		debugLog = [];
		treesNearby = []; // leeren, falls vorher schon befüllt

		try {
			const coords = await getCurrentPosition();
			locationInfo = `📍 Standort: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
			debugLog.push('✅ Standort erfolgreich abgerufen.');

			// 🌍 Bounding Box (150 m Radius in Grad)
			const radiusInDegrees = 0.0015;
			const minX = coords.longitude - radiusInDegrees;
			const maxX = coords.longitude + radiusInDegrees;
			const minY = coords.latitude - radiusInDegrees;
			const maxY = coords.latitude + radiusInDegrees;

			debugLog.push(
				`🔎 Bounding Box: [${minX.toFixed(4)}, ${maxX.toFixed(4)}], [${minY.toFixed(4)}, ${maxY.toFixed(4)}]`
			);

			// 📦 passende Segmentdateien finden
			const segmentFiles = await findMatchingSegments(minX, maxX, minY, maxY);
			debugLog.push(`📂 ${segmentFiles.length} Segmentdateien gefunden:`);
			debugLog = [...debugLog, ...segmentFiles.map((f) => `→ ${f}`)];

			let candidates: { id: string; name: string; distance: number }[] = [];

			for (const file of segmentFiles) {
				const res = await fetch(`/segments/${file}`);
				const geojson = await res.json();

				for (const feature of geojson.features) {
					const [lon, lat] = feature.geometry.coordinates;

					// Filter: nur Bäume innerhalb der Bounding Box
					if (lon >= minX && lon <= maxX && lat >= minY && lat <= maxY) {
						const uuid = feature.properties.uuid;
						const name = feature.properties.tree_type_german ?? 'Unbekannter Baum';
						const crown = feature.properties.crown_diameter;
						const distance = Math.round(
							getDistanceInMeters(coords.latitude, coords.longitude, lat, lon)
						);
						candidates.push({ id: uuid, name, distance, crown });
					}
				}
			}

			treesNearby = candidates.sort((a, b) => a.distance - b.distance).slice(0, 5);
			debugLog = [
				...debugLog,
				`📊 Insgesamt ${candidates.length} Bäume in deiner Umgebung gefunden.`,
				`🌲 ${treesNearby.length} Bäume geladen:`,
				...treesNearby.map((tree) => `→ ${tree.name} (${tree.id})`)
			];
			treesNearby.forEach((tree) => debugLog.push(`→ ${tree.name} (${tree.id})`));

			// (Noch keine weiteren Aktionen – nächster Schritt!)
		} catch (error) {
			locationInfo = '❌ Standort konnte nicht ermittelt werden.';
			debugLog.push(`Fehler: ${error.message}`);
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
					<!-- Emoji-Spalte -->
					<th class="text-left p-2 border">Baumart</th>
					<th class="text-left p-2 border">Entfernung (m)</th>
					<th class="text-left p-2 border">Krone (m)</th>
				</tr>
			</thead>
			<tbody>
				{#each treesNearby as tree}
					<tr class="hover:bg-gray-50">
						<td class="p-2 border text-center">
							<button
								class="text-xl hover:scale-125 transition-transform"
								on:click={() => goto(`/trees/${tree.id}`)}
								aria-label="Baumdetails anzeigen"
							>
								🌳
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

	{#if debugLog.length}
		<div class="text-xs text-gray-500 mt-3 border-t pt-2">
			<strong>Debug:</strong>
			<ul class="list-disc ml-4 mt-1">
				{#each debugLog as log}
					<li>{log}</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
