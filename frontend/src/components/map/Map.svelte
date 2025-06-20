<script lang="ts">
	// 📦 Core Imports
	import { onMount } from 'svelte';
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import { goto } from '$app/navigation';
	import { selectedSpecies } from '$lib/map/treeFilter';

	// 📦 Komponenten & externe Module
	import MapControls from './MapControls.svelte';
	import { MarkerClusterGroup } from '@tronscanteam/leaflet.markercluster/dist/leaflet.markercluster-src';
	import '@tronscanteam/leaflet.markercluster/dist/MarkerCluster.css';
	import './Map.css';

	// 📦 Projektinterne Logik
	import findMatchingSegments from '../../businessLogic/findSegments';

	// 🗺️ Initialisierung
	const id = 'map-' + Math.random().toString(36).substring(2, 9);
	let map: L.Map;
	let visibleSegments = new Set();
	let allMarkerGroups: L.MarkerClusterGroup[] = [];

	let last_clicked: unknown = null;

	const greenIcon = L.icon({
		iconUrl: '/map/markers/marker-tree.svg',
		iconSize: [15, 15],
		iconAnchor: [10, 10],
		popupAnchor: [0, -10]
	});

	let lastFilter: string[] = [];

	$: if (map && JSON.stringify($selectedSpecies) !== JSON.stringify(lastFilter)) {
		lastFilter = [...$selectedSpecies];
		console.log('🔄 Filter geändert:', $selectedSpecies);

		// 🧹 Alte Marker-Gruppen entfernen
		allMarkerGroups.forEach((group) => group.remove());
		allMarkerGroups = [];

		// 👉 Segmente neu zulassen
		visibleSegments.clear();

		// 🔄 Neuladen der Segmente
		onMove({ target: map });
	}

	const onMove = (e: any) => {
		setTimeout(() => {
			const bounds = e.target.getBounds();
			const maxY = bounds._northEast.lat;
			const maxX = bounds._northEast.lng;
			const minY = bounds._southWest.lat;
			const minX = bounds._southWest.lng;

			findMatchingSegments(minX, maxX, minY, maxY).then((segmentFiles) => {
				segmentFiles
					.filter((file) => !visibleSegments.has(file))
					.forEach((file) => {
						fetch(`/segments/${file}`)
							.then((res) => res.json())
							.then((segment) => {
								visibleSegments.add(file);

								const markers = new MarkerClusterGroup({
									spiderfyOnMaxZoom: false,
									showCoverageOnHover: false,
									zoomToBoundsOnClick: true,
									disableClusteringAtZoom: 20,
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

								const filteredFeatures =
									$selectedSpecies.length === 0
										? segment.features
										: segment.features.filter((feature) => {
												const art = feature.properties.tree_type_german;
												return $selectedSpecies.includes(art);
											});

								if (filteredFeatures.length === 0) return;

								L.geoJSON(
									{ ...segment, features: filteredFeatures },
									{
										pointToLayer: (feature, latlng) => {
											return L.marker(latlng, { icon: greenIcon }).on('click', (e) => {
												if (last_clicked && (last_clicked as any)._icon) {
													(last_clicked as any)._icon.src = '/map/markers/marker-tree.svg';
												}
												e.target._icon.src = '/map/markers/marker-tree-clicked.svg';
												const treeId = e.sourceTarget.feature.properties.uuid;
												goto(`/trees/${treeId}`);
												if (e.target._icon) {
													last_clicked = e.target;
												}

												const lat1 = map.getBounds()._northEast.lat;
												const lat2 = map.getBounds()._southWest.lat;
												const latb = e.latlng.lat;
												const latn = latb - Math.abs(lat1 - lat2) / 2.35;
												map.flyTo({ lat: latn, lng: e.latlng.lng }, map.getZoom(), {
													animate: true,
													duration: 0.75
												});
											});
										}
									}
								).addTo(markers);
							});
					});
			});
		}, 50);
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
