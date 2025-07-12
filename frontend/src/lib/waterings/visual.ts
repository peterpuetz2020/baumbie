// Emoji-Darstellung der Wassermenge (visuelle Gießkraft)
export function waterEmoji(amount: number): string {
	if (amount >= 40) return '💧💧💧';
	if (amount >= 20) return '💧💧';
	if (amount >= 5) return '💧';
	return '🌱';
}