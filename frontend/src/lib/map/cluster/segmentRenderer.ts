import type { TreeFeature } from '$types/tree';
import L from 'leaflet';
import type { MarkerClusterGroup } from '@tronscanteam/leaflet.markercluster/dist/leaflet.markercluster-src';
import { createClusterGroup } from './clusterGroup';
import { greenIcon, clickedIcon, focusTree, registerTreeMarker } from '$lib/map';

export async function renderSegmentFile(
	file: string,
	map: L.Map,
	selectedSpecies: string[],
	loadedSegmentFiles: Set<string>,
	markerGroupRegistry: Map<MarkerClusterGroup, string[]>,
	allMarkerGroups: MarkerClusterGroup[]
) {
	const res = await fetch(`/segments/${file}`);
	const segment = await res.json();
	loadedSegmentFiles.add(file);

	const filteredFeatures: TreeFeature[] =
		selectedSpecies.length === 0
			? segment.features
			: segment.features.filter((f: TreeFeature) =>
					selectedSpecies.includes(f.properties.tree_type_german)
			  );

	if (filteredFeatures.length === 0) return;

	const markers = createClusterGroup().addTo(map);
	allMarkerGroups.push(markers);

	const groupTreeIds: string[] = [];
	markerGroupRegistry.set(markers, groupTreeIds);

	L.geoJSON(
		{ ...segment, features: filteredFeatures },
		{
			pointToLayer: (feature: TreeFeature, latlng) => {
				const marker = L.marker(latlng, { icon: greenIcon });
				const treeId = feature.properties.uuid;

				marker.on('click', () => {
					focusTree(map, treeId, latlng, marker, clickedIcon);
				});

				registerTreeMarker(treeId, marker);
				groupTreeIds.push(treeId);

				return marker;
			}
		}
	).addTo(markers);
}
