<script lang="ts">
	import { onMount } from 'svelte';
	import { getWateringsForTree } from '$lib/supabase';
	import WateringHistory from './WateringHistory.svelte';
	import Notice from '$components/ui/Notice.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let treeId: string;

	let loading = true;
	let error: string | null = null;
	let waterings: { uuid: string; watered_at: string; amount_liters: number }[] = [];

	async function loadWaterings() {
		try {
			loading = true;
			error = null;
			const result = await getWateringsForTree(treeId);
			waterings = result;
		} catch (err) {
			error = 'Fehler beim Laden der Gießungen.';
			console.error(err);
		} finally {
			loading = false;
			dispatch('contentChanged');
		}
	}

	onMount(loadWaterings);
</script>

{#if error}
	<Notice tone="warning">{error}</Notice>
{:else if loading}
	<Notice tone="info">Wird geladen...</Notice>
{:else}
	<WateringHistory
		{waterings}
		on:reload={loadWaterings}
		on:contentChanged={() => dispatch('contentChanged')}
	/>
{/if}
