export async function loadTopSpecies(limit = 30): Promise<{ label: string; count: number }[]> {
	const res = await fetch('/data/species-count.json');
	const data: Record<string, number> = await res.json();

	return Object.entries(data)
		.slice(0, limit)
		.map(([label, count]) => ({ label, count }));
}
