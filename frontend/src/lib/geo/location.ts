export function getCurrentPosition(): Promise<GeolocationCoordinates> {
	return new Promise((resolve, reject) => {
		if (!navigator.geolocation) {
			return reject(new Error('Geolocation wird nicht unterstützt.'));
		}

		navigator.geolocation.getCurrentPosition(
			(position) => resolve(position.coords),
			(error) => reject(error)
		);
	});
}