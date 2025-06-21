export function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
	const R = 6371e3; // Erdradius in Metern
	const toRad = (deg: number) => (deg * Math.PI) / 180;

	const latRad1 = toRad(lat1);
	const latRad2 = toRad(lat2);
	const deltaLat = toRad(lat2 - lat1);
	const deltaLon = toRad(lon2 - lon1);

	const a =
		Math.sin(deltaLat / 2) ** 2 +
		Math.cos(latRad1) * Math.cos(latRad2) *
		Math.sin(deltaLon / 2) ** 2;

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}
