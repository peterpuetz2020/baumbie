import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import { mapStore } from '$lib/map/mapInstance';
import { flyToWithOffset } from '$lib/map/flyToWithOffset';

export function goToTree(tree: { id: string; lat: number; lng: number }) {
	const map = get(mapStore);
	if (map) {
		flyToWithOffset(map, tree.lat, tree.lng);
	}
	goto(`/trees/${tree.id}`);
}
