import { deleteWatering as deleteWateringFromDB } from '$lib/supabase';

// Wandelt ISO-Datum in deutsches Datumsformat um
export function formatDate(isoDate: string) {
	const date = new Date(isoDate);
	return date.toLocaleDateString('de-DE', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	});
}

// Emoji-Darstellung der Wassermenge (visuelle Gießkraft)
export function waterEmoji(amount: number) {
	if (amount >= 40) return '💧💧💧';
	if (amount >= 20) return '💧💧';
	if (amount >= 5) return '💧';
	return '🌱';
}