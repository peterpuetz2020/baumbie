import type L from 'leaflet';

/**
 * Fokussiert einen Baum auf der Karte mit vertikalem Offset und Zoom 20.
 * @param map Die Leaflet-Karte
 * @param latlng Die Zielposition (z.B. Marker.getLatLng())
 * @param verticalOffsetFactor Wie stark die Kamera vertikal versetzt wird (Default: 2.35)
 * @param duration Animationsdauer (in Sekunden)
 */
export function flyToTree(
	map: L.Map,
	latlng: L.LatLngExpression,
	verticalOffsetFactor = 2.25,
	duration = 0.75
) {
	const zoom = 20;

	let lat: number;
	let lng: number;
	if (Array.isArray(latlng)) {
		lat = latlng[0];
		lng = latlng[1];
	} else {
		lat = latlng.lat;
		lng = latlng.lng;
	}

	// Offset auf Basis des Ziel-Zoomlevels berechnen
	const containerSize = map.getSize();
	const projected = map.project([lat, lng], zoom);
	projected.y += containerSize.y / verticalOffsetFactor;
	const offsetLatLng = map.unproject(projected, zoom);

	map.flyTo(offsetLatLng, zoom, {
		animate: true,
		duration
	});
}
