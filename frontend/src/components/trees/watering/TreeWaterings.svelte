<script lang="ts">
	import { onMount } from 'svelte';
	import { getWateringsForTree, getCurrentUser } from '$lib/supabase';
	import WateringHistory from './WateringHistory.svelte';
	import Notice from '$components/ui/Notice.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { WateringWithTree } from '$types/watering';

	const dispatch = createEventDispatcher();

	export let treeId: string;

	let currentUserId: string | null = null;

	let loading = true;
	let error: string | null = null;
	let waterings: WateringWithTree[] = [];

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

	onMount(async () => {
		const user = await getCurrentUser();
		currentUserId = user?.id ?? null;
		await loadWaterings();
	});
</script>

{#if error}
	<Notice tone="warning">{error}</Notice>
{:else if loading}
	<Notice tone="info">Wird geladen...</Notice>
{:else}
	<WateringHistory {waterings} {currentUserId} on:reload={loadWaterings} />
{/if}
