// Wandelt ISO-Datum in deutsches Datumsformat um
export function formatDate(isoDate: string) {
	const date = new Date(isoDate);
	return date.toLocaleDateString('de-DE', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	});
}