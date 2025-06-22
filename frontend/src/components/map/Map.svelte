<script lang="ts">
	// 📦 Core Imports
	import { onMount } from 'svelte';
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import { goto } from '$app/navigation';
	import { selectedSpecies } from '$lib/trees/filters';
	import { goToTree } from '$lib/map';

	// 📦 Komponenten & externe Module
	import MapControls from './MapControls.svelte';
	import { MarkerClusterGroup } from '@tronscanteam/leaflet.markercluster/dist/leaflet.markercluster-src';
	import '@tronscanteam/leaflet.markercluster/dist/MarkerCluster.css';
	import './Map.css';

	// 📦 Projektinterne Logik
	import { findMatchingSegments } from '$lib/geo';

	// 🆔 zufällige ID für Karten-Div
	const id = 'map-' + Math.random().toString(36).substring(2, 9);

	// 🌍 Leaflet Map & State
	let map: L.Map;
	let loadedSegmentFiles = new Set<string>();
	let allMarkerGroups: L.MarkerClusterGroup[] = [];
	let lastClickedMarker: unknown = null;
	let lastFilter: string[] = [];

	const greenIcon = L.icon({
		iconUrl: '/map/markers/marker-tree.svg',
		iconSize: [15, 15],
		iconAnchor: [10, 10],
		popupAnchor: [0, -10]
	});

	const MAX_CLUSTER_ZOOM = 20;
	const loadDelayMs = 50;
	const verticalOffsetFactor = 2.35;

	$: if (map && JSON.stringify($selectedSpecies) !== JSON.stringify(lastFilter)) {
		lastFilter = [...$selectedSpecies];
		console.log('🔄 Filter geändert:', $selectedSpecies);

		// 🧹 Alte Marker-Gruppen entfernen
		allMarkerGroups.forEach((group) => group.remove());
		allMarkerGroups = [];
		loadedSegmentFiles.clear();

		// 📍 Karte mit neuem Filter aktualisieren
		onMove({ target: map });
	}

	const onMove = (e: any) => {
		setTimeout(async () => {
			const bounds = e.target.getBounds();
			const ne = bounds.getNorthEast();
			const sw = bounds.getSouthWest();

			const segmentFiles = await findMatchingSegments(sw.lng, ne.lng, sw.lat, ne.lat);

			for (const file of segmentFiles.filter((f) => !loadedSegmentFiles.has(f))) {
				const res = await fetch(`/segments/${file}`);
				const segment = await res.json();
				loadedSegmentFiles.add(file);

				const filteredFeatures =
					$selectedSpecies.length === 0
						? segment.features
						: segment.features.filter((feature: any) =>
								$selectedSpecies.includes(feature.properties.tree_type_german)
							);

				if (filteredFeatures.length === 0) continue;

				const markers = new MarkerClusterGroup({
					spiderfyOnMaxZoom: false,
					showCoverageOnHover: false,
					zoomToBoundsOnClick: true,
					disableClusteringAtZoom: MAX_CLUSTER_ZOOM,
					iconCreateFunction: (cluster: any) => {
						const count = cluster.getChildCount();
						const size = count > 1000 ? 100 : count > 500 ? 50 : count > 100 ? 10 : 20;
						return L.divIcon({
							html: '',
							className: 'marker-cluster',
							iconSize: L.point(size, size)
						});
					}
				}).addTo(map);

				allMarkerGroups.push(markers);

				L.geoJSON(
					{ ...segment, features: filteredFeatures },
					{
						pointToLayer: (feature, latlng) => {
							return L.marker(latlng, { icon: greenIcon }).on('click', (e) => {
								if (lastClickedMarker && (lastClickedMarker as any)._icon) {
									(lastClickedMarker as any)._icon.src = '/map/markers/marker-tree.svg';
								}
								e.target._icon.src = '/map/markers/marker-tree-clicked.svg';

								const treeId = e.sourceTarget.feature.properties.uuid;
								goto(`/trees/${treeId}`);

								if (e.target._icon) {
									lastClickedMarker = e.target;
								}

								goToTree(map, e.latlng);
							});
						}
					}
				).addTo(markers);
			}
		}, loadDelayMs);
	};

	onMount(() => {
		const tileURL =
			'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/light_all/{z}/{x}/{y}.png';

		const layer = L.tileLayer(tileURL, {
			attribution:
				'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
			subdomains: 'abcd',
			maxZoom: 20,
			minZoom: 0
		});

		map = L.map(id, {
			center: [52.0192873, 8.5301909],
			zoom: 16,
			zoomControl: false
		})
			.addLayer(layer)
			.on('moveend', onMove);

		onMove({ target: map });

		document.getElementById(id)?.addEventListener('click', (e: any) => {
			if (e.target && !e.target.className.includes('leaflet-marker-icon')) {
				goto('/');
			}
		});
	});
</script>

<!-- 🗺️ Karte -->
<div {id} class="fixed top-0 left-0 min-w-full min-h-full" />

<!-- 🧭 Custom Controls -->
<MapControls {map} />
