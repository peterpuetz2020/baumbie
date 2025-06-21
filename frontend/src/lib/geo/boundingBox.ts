export function getBoundingBox(lat: number, lng: number, radiusDeg: number) {
	return {
		minX: lng - radiusDeg,
		maxX: lng + radiusDeg,
		minY: lat - radiusDeg,
		maxY: lat + radiusDeg
	};
}
