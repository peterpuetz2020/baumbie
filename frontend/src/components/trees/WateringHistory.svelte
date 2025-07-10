<script lang="ts">
	import { onMount } from 'svelte';
	import { getWateringsForTree } from '$lib/supabase';
	import Notice from '$components/ui/Notice.svelte';

	export let treeId: string;

	let waterings: { watered_at: string; amount_liters: number }[] = [];
	let error: string | null = null;
	let loading = true;

	onMount(async () => {
		try {
			const result = await getWateringsForTree(treeId);
			waterings = result;
		} catch (err) {
			error = 'Fehler beim Laden der Gießungen.';
			console.error(err);
		} finally {
			loading = false;
		}
	});

	async function deleteWatering(index: number) {
		// Später implementieren (wenn ID vorhanden)
		waterings.splice(index, 1);
	}
</script>

{#if loading}
	<Notice tone="info">Lade Gießdaten …</Notice>
{:else if error}
	<Notice tone="warning">{error}</Notice>
{:else if waterings.length === 0}
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
							title="Eintrag löschen (noch ohne Funktion)"
						>
							Löschen
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
