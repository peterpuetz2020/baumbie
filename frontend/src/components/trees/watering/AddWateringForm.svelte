<script lang="ts">
	import { WaterField, DateField, Button, Notice } from '$components/ui';
	import { createWatering } from '$lib/supabase';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	let liter: number = 0;
	let wateredAt: string = '';
	let errorMessage: string | null = null;
	let noticeMessage: string | null = null;

	const dispatch = createEventDispatcher();

	const handleWater = async (e: SubmitEvent) => {
		e.preventDefault();
		errorMessage = null;
		noticeMessage = null;

		// Hole treeId aus URL
		const treeId = get(page).params.treeId;

		// Primitive Validierung
		if (!treeId || liter < 1 || liter > 100 || !wateredAt) {
			errorMessage = 'Bitte gib zwischen 1 und 100 Liter sowie ein gültiges Datum an.';
			return;
		}

		try {
			await createWatering({
				tree_uuid: treeId,
				amount_liters: liter,
				watered_at: wateredAt
			});

			dispatch('success');
		} catch (err) {
			errorMessage = 'Fehler beim Speichern des Gieß-Eintrags.';
			console.error(err);
		}
	};

	onMount(() => {
		const today = new Date().toISOString().slice(0, 10); // "2025-07-11"
		wateredAt = today;
	});
</script>

<form on:submit={handleWater} class="flex flex-col gap-y-4">
	<div class="flex flex-col gap-y-2">
		{#if errorMessage}
			<Notice tone="warning">{errorMessage}</Notice>
		{/if}
		{#if noticeMessage}
			<Notice tone="success">{noticeMessage}</Notice>
		{/if}

		<WaterField
			id="wassermenge"
			label="Gegossene Liter:"
			type="number"
			inputClass="w-full"
			placeholder="5"
			bind:value={liter}
			errorMessage={null}
		/>

		<DateField
			id="giessdatum"
			label="Gießdatum:"
			type="date"
			inputClass="w-full"
			placeholder="YYYY-MM-DD"
			bind:value={wateredAt}
			errorMessage={null}
		/>
	</div>

	<div class="flex flex-col gap-y-2">
		<Button variant="watering" type="submit" className="w-full">Gießung eintragen</Button>
	</div>
</form>
