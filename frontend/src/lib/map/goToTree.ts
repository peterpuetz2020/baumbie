import type L from 'leaflet';

export function goToTree(
	map: L.Map,
	latlng: L.LatLngExpression,
	verticalOffsetFactor = 2.35,
	duration = 0.75
) {
	const bounds = map.getBounds();
	const lat1 = bounds.getNorthEast().lat;
	const lat2 = bounds.getSouthWest().lat;

	let lat: number;
	let lng: number;

	if (Array.isArray(latlng)) {
		lat = latlng[0];
		lng = latlng[1];
	} else {
		lat = latlng.lat;
		lng = latlng.lng;
	}

	const latn = lat - Math.abs(lat1 - lat2) / verticalOffsetFactor;

	map.flyTo({ lat: latn, lng }, map.getZoom(), {
		animate: true,
		duration
	});
}
