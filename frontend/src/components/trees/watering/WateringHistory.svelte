<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { deleteWatering as deleteWateringFromDB } from '$lib/supabase';
	import { Button, Notice } from '$components/ui';

	// Eingehende Gießungen: uuid, Datum, Menge in Litern
	export let waterings: {
		uuid: string;
		watered_at: string;
		amount_liters: number;
		user_uuid: string | null;
		created_at: string;
	}[] = [];
	export let currentUserId: string | null = null;

	const dispatch = createEventDispatcher();

	let error: string | null = null;
	let swipedIndex: number | null = null; // Index der zuletzt geswipten Zeile (für mobile)

	// Löscht eine Gießung aus der DB und löst Events zur Aktualisierung aus
	async function deleteWatering(index: number) {
		const toDelete = waterings[index];
		if (!toDelete?.uuid) return;

		try {
			await deleteWateringFromDB(toDelete.uuid);
			dispatch('reload');
		} catch (err) {
			error = 'Fehler beim Löschen.';
			console.error(err);
		}
	}

	// Wandelt ISO-Datum in deutsches Datumsformat um
	function formatDate(isoDate: string) {
		const date = new Date(isoDate);
		return date.toLocaleDateString('de-DE', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	}

	// Emoji-Darstellung der Wassermenge (visuelle Gießkraft)
	function waterEmoji(amount: number) {
		if (amount >= 40) return '💧💧💧';
		if (amount >= 20) return '💧💧';
		if (amount >= 5) return '💧';
		return '🌱';
	}

	// Touch-Handling für Swipe-to-Delete auf Mobilgeräten
	function handleTouchStart(event: TouchEvent) {
		const touch = event.touches[0];
		(event.target as HTMLElement).dataset.startX = String(touch.clientX);
	}

	function handleSwipe(index: number, event: TouchEvent) {
		if (!currentUserId) return;

		const touch = event.changedTouches[0];
		const endX = touch.clientX;
		const startX = (event.target as HTMLElement).dataset.startX;
		if (!startX) return;

		const distance = parseInt(startX) - endX;
		const watering = waterings[index];

		if (watering.user_uuid !== currentUserId) return;
		if (distance > 80) {
			swipedIndex = index;
			setTimeout(() => deleteWatering(index), 250);
		}
	}
</script>

{#if error}
	<Notice tone="warning">{error}</Notice>
{/if}

{#if waterings.length === 0}
	<Notice tone="info">Bisher wurden noch keine Gießungen für diesen Baum eingetragen.</Notice>
{:else}
	<table class="w-full text-sm text-left border-separate border-spacing-y-1 mt-3">
		<thead class="text-gray-500 text-xs tracking-wider">
			<tr>
				<th class="px-3 py-2">Datum</th>
				<th class="px-3 py-2">Liter</th>
				<th class="px-3 py-2">Gießkraft</th>
				<th class="px-3 py-2">Durch</th>
				<th class="px-3 py-2 hidden md:table-cell">Aktion</th>
			</tr>
		</thead>
		<tbody>
			{#each waterings as watering, index}
				<tr
					class={`bg-white shadow-sm rounded-md transition duration-300 ease-in-out transform ${
						swipedIndex === index ? 'opacity-0 translate-x-[-100%]' : 'hover:bg-gray-50'
					}`}
					on:touchstart={handleTouchStart}
					on:touchend={(e) => handleSwipe(index, e)}
				>
					<td class="px-3 py-2">{formatDate(watering.watered_at)}</td>
					<td class="px-3 py-2">{watering.amount_liters}</td>
					<td class="px-3 py-2">{waterEmoji(watering.amount_liters)}</td>

					<!-- Durch -->
					<td class="px-3 py-2">
						<em>{currentUserId && watering.user_uuid === currentUserId ? 'Du' : 'anonym'}</em>
					</td>

					<!-- Entfernen (nur für eigene Gießungen sichtbar, ab md) -->
					<td class="px-3 py-2 hidden md:table-cell">
						{#if currentUserId && watering.user_uuid === currentUserId}
							<Button
								variant="danger"
								className="text-sm h-7 px-3 py-1"
								onClick={() => deleteWatering(index)}
							>
								Entfernen
							</Button>
						{:else if currentUserId}
							<Notice tone="warning">Nicht deine Gießung</Notice>
						{:else}
							<Notice tone="warning">Nicht eingeloggt</Notice>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
