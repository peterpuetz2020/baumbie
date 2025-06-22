import type L from 'leaflet';
import { flyToTree } from './flyToTree';
import { highlightMarker } from './highlightMarker';
import { goto } from '$app/navigation';

/**
 * Fokusiert einen Baum durch Kamera, Marker und URL.
 */
export function focusTree(
	map: L.Map,
	treeId: string,
	latlng: L.LatLngExpression,
	marker?: L.Marker,
	clickedIcon?: L.Icon
) {
	if (marker && clickedIcon) {
		highlightMarker(marker, clickedIcon);
	}

	flyToTree(map, latlng);
	goto(`/trees/${treeId}`);
}
