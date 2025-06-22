import L from 'leaflet';

export const greenIcon = L.icon({
	iconUrl: '/map/markers/marker-tree.svg',
	iconSize: [15, 15],
	iconAnchor: [10, 10],
	popupAnchor: [0, -10]
});

export const clickedIcon = L.icon({
	iconUrl: '/map/markers/marker-tree-clicked.svg',
	iconSize: [15, 15],
	iconAnchor: [10, 10],
	popupAnchor: [0, -10]
});