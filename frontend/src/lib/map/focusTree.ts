import type L from 'leaflet';
import { flyToTree } from './flyToTree';
import { highlightMarker } from './highlightMarker';
import { goto } from '$app/navigation';

/**
 * Fokussiert einen Baum durch Kamera, Marker und URL.
 * @param map Die Leaflet-Karte
 * @param treeId Die Baum-ID für die URL
 * @param latlng Die Position des Baums
 * @param marker Optional: Der zugehörige Marker (wird hervorgehoben)
 * @param clickedIcon Optional: Icon für Hervorhebung
 * @param zoom Optional: Zoom-Level (Standard: 19, siehe `flyToTree`)
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
