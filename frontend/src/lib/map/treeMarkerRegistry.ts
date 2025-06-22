import type L from 'leaflet';

const registry = new Map<string, L.Marker>();

export function registerTreeMarker(treeId: string, marker: L.Marker) {
	registry.set(treeId, marker);
}

export function getTreeMarker(treeId: string): L.Marker | undefined {
	return registry.get(treeId);
}

export function clearTreeMarkers() {
	registry.clear();
}

export function __debug_getRegistry() {
	return registry;
}