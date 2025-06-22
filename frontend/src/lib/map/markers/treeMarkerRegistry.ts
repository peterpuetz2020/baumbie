import type L from 'leaflet';

const registry = new Map<string, L.Marker>();

export function registerTreeMarker(treeId: string, marker: L.Marker) {
	registry.set(treeId, marker);
}

export function getTreeMarker(treeId: string): L.Marker | undefined {
	return registry.get(treeId);
}

export function unregisterTreeMarker(treeId: string) {
	registry.delete(treeId);
}
