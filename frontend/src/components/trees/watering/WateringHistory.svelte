<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { deleteWatering as deleteWateringFromDB } from '$lib/supabase';
	import { Button, Notice } from '$components/ui';
	import { get } from 'svelte/store';
	import { focusTreeById, mapStore } from '$lib/map';

	// Eingehende Gießungen: uuid, Datum, Menge in Litern
	export let waterings: {
		uuid: string;
		watered_at: string;
		amount_liters: number;
		user_uuid: string | null;
		created_at: string;
		tree?: {
			uuid: string;
			tree_type_german?: string;
		};
	}[] = [];
	export let currentUserId: string | null = null;

	export let mode: 'tree' | 'user' = 'tree';

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

	function handleTreeClick(treeId: string) {
		const map = get(mapStore);
		if (map) {
			focusTreeById(map, treeId);
		}
	}
</script>

{#if error}
	<Notice tone="warning">{error}</Notice>
{/if}

{#if waterings.length === 0}
	<Notice tone="info">Bisher wurden noch keine Gießungen für diesen Baum eingetragen.</Notice>
{:else}
	<!-- 🔁 Desktop/Tabletdarstellung -->
	<table class="w-full text-sm text-left border-separate border-spacing-y-1 mt-3 hidden md:table">
		<thead class="text-gray-500 text-xs tracking-wider">
			<tr>
				<th class="px-3 py-2">Datum</th>
				<th class="px-3 py-2">Liter</th>
				<th class="px-3 py-2">Gießkraft</th>
				{#if mode === 'tree'}
					<th class="px-3 py-2">Durch</th>
				{:else}
					<th class="px-3 py-2">Baum</th>
				{/if}
				<th class="px-3 py-2">Aktion</th>
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
					<td class="px-3 py-2">
						{#if mode === 'tree'}
							<em>{currentUserId && watering.user_uuid === currentUserId ? 'Du' : 'anonym'}</em>
						{:else if watering.tree?.uuid}
							<Button
								variant="secondary"
								onClick={() => watering.tree && handleTreeClick(watering.tree.uuid)}
								className="gap-1 text-sm"
							>
								{watering.tree.tree_type_german ?? 'Baum'}
								<img src="/icons/tree.svg" alt="Baum" class="w-4 h-4" />
								<span>→</span>
							</Button>
						{:else}
							<em>Unbekannter Baum</em>
						{/if}
					</td>
					<td class="px-3 py-2">
						{#if currentUserId && watering.user_uuid === currentUserId}
							<Button
								variant="danger"
								className="text-sm h-7 px-3 py-1"
								onClick={() => deleteWatering(index)}
							>
								Entfernen
							</Button>
						{:else}
							<em>-</em>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<!-- 📱 Mobile Cards -->
	<div class="md:hidden mt-3 space-y-3">
		{#each waterings as watering, index}
			<div
				class="bg-white rounded-lg shadow-sm p-4 text-sm"
				on:touchstart={handleTouchStart}
				on:touchend={(e) => handleSwipe(index, e)}
			>
				{#if mode === 'user' && watering.tree?.uuid}
					<div class="flex justify-center mb-4">
						<Button
							variant="secondary"
							onClick={() => watering.tree && handleTreeClick(watering.tree.uuid)}
							className="gap-1 text-sm"
						>
							{watering.tree.tree_type_german ?? 'Baum'} →
						</Button>
					</div>
				{/if}

				<div class="flex justify-between text-gray-500 mb-2">
					<span class="font-semibold">Datum</span>
					<span class="text-black">{formatDate(watering.watered_at)}</span>
				</div>
				<div class="flex justify-between text-gray-500 mb-2">
					<span class="font-semibold">Liter</span>
					<span class="text-black">{watering.amount_liters}</span>
				</div>
				<div class="flex justify-between text-gray-500 mb-2">
					<span class="font-semibold">Gießkraft</span>
					<span class="text-black">{waterEmoji(watering.amount_liters)}</span>
				</div>

				{#if mode === 'tree'}
					<div class="flex justify-between text-gray-500">
						<span class="font-semibold">Durch</span>
						<span class="text-black">
							<em>{currentUserId && watering.user_uuid === currentUserId ? 'Du' : 'anonym'}</em>
						</span>
					</div>
				{/if}
			</div>
		{/each}
	</div>
{/if}
