<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { deleteWatering as deleteWateringFromDB } from '$lib/supabase';
	import Notice from '$components/ui/Notice.svelte';

	export let waterings: { uuid: string; watered_at: string; amount_liters: number }[] = [];

	const dispatch = createEventDispatcher();
	let error: string | null = null;

	async function deleteWatering(index: number) {
		const toDelete = waterings[index];
		if (!toDelete?.uuid) return;

		try {
			await deleteWateringFromDB(toDelete.uuid);
			dispatch('reload');
			dispatch('contentChanged');
		} catch (err) {
			error = 'Fehler beim Löschen.';
			console.error(err);
		}
	}
</script>

{#if error}
	<Notice tone="warning">{error}</Notice>
{/if}

{#if waterings.length === 0}
	<Notice tone="info">Bisher keine Gießvorgänge für diesen Baum.</Notice>
{:else}
	<table class="w-full text-sm text-left text-gray-700 border-t border-gray-200 mt-2">
		<thead>
			<tr>
				<th class="py-2 pr-4">Datum</th>
				<th class="py-2 pr-4">Liter</th>
				<th class="py-2">Aktion</th>
			</tr>
		</thead>
		<tbody>
			{#each waterings as watering, index}
				<tr>
					<td class="py-2 pr-4">{watering.watered_at}</td>
					<td class="py-2 pr-4">{watering.amount_liters}</td>
					<td class="py-2">
						<button
							on:click={() => deleteWatering(index)}
							class="text-red-600 hover:underline text-sm"
							title="Eintrag löschen"
						>
							Löschen
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
