import type L from 'leaflet';
import { goto } from '$app/navigation';
import { getTreeMarker } from '../markers/treeMarkerRegistry';
import { focusTree } from './focusTree';
import { clickedIcon } from '../markers/icons';

/**
 * Fokussiert einen Baum anhand seiner ID.
 * Holt Marker aus Registry (falls sichtbar),
 * nutzt vorhandene focusTree(...) Logik.
 * Fallback: nur URL-Wechsel.
 */
export function focusTreeById(map: L.Map, treeId: string) {
	const marker = getTreeMarker(treeId);

	if (marker) {
		const latlng = marker.getLatLng();
		// console.debug('🔍 focusTreeById: Marker gefunden für', treeId);
		focusTree(map, treeId, latlng, marker, clickedIcon);
	} else {
		// console.warn('⚠️ Marker nicht sichtbar für', treeId);
		goto(`/trees/${treeId}`);
	}
}
