import type L from 'leaflet';

let lastClickedMarker: L.Marker | null = null;
let defaultIcon: L.Icon | null = null;

export function highlightMarker(marker: L.Marker, newIcon: L.Icon) {
	if (!defaultIcon) {
		// Backup beim ersten Mal
		defaultIcon = marker.options.icon as L.Icon;
	}

	if (lastClickedMarker) {
		lastClickedMarker.setIcon(defaultIcon);
	}

	marker.setIcon(newIcon);
	lastClickedMarker = marker;
}

export function resetHighlight() {
	if (lastClickedMarker && defaultIcon) {
		lastClickedMarker.setIcon(defaultIcon);
		lastClickedMarker = null;
	}
}
