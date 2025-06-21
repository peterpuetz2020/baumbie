export function flyToWithOffset(map: L.Map, lat: number, lng: number) {
	const bounds = map.getBounds();
	const latOffset = Math.abs(bounds.getNorth() - bounds.getSouth()) / 2.35;
	const targetLat = lat - latOffset;

	map.flyTo([targetLat, lng], map.getZoom(), {
		animate: true,
		duration: 0.75
	});
}
