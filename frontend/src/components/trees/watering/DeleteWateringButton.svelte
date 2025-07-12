<script lang="ts">
	import { Button, Notice } from '$components/ui';
	import { deleteWatering as deleteWateringFromDB } from '$lib/supabase';
	import type { WateringWithTree } from '$types/watering';
	import { createEventDispatcher } from 'svelte';

	export let watering: WateringWithTree;

	const dispatch = createEventDispatcher();
	let error: string | null = null;

	async function handleDelete() {
		error = null;
		try {
			await deleteWateringFromDB(watering.uuid);
			dispatch('reload');
		} catch (err) {
			console.error('Fehler beim Löschen der Gießung:', err);
			error = 'Fehler beim Löschen der Gießung.';
		}
	}
</script>

{#if error}
	<Notice tone="warning">{error}</Notice>
{/if}

<Button variant="danger" className="text-sm h-7 px-3 py-1" onClick={handleDelete}>Entfernen</Button>
