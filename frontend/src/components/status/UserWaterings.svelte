<script lang="ts">
	import { onMount } from 'svelte';
	import { getCurrentUser, getWateringsForUser } from '$lib/supabase';
	import { WateringHistory } from '$components/waterings';
	import { Notice } from '$components/ui';

	import type { Watering } from '$types/watering';

	let currentUserId: string | null = null;
	let loggedIn = false;

	let loading = true;
	let error: string | null = null;

	let waterings: Watering[] = [];

	async function loadWaterings() {
		try {
			loading = true;
			error = null;

			if (!loggedIn) return;

			waterings = await getWateringsForUser(currentUserId!);
		} catch (err) {
			error = 'Fehler beim Laden deiner Gießungen.';
			console.error(err);
		} finally {
			loading = false;
		}
	}

	onMount(async () => {
		const user = await getCurrentUser();
		currentUserId = user?.id ?? null;
		loggedIn = !!user;

		if (loggedIn) {
			await loadWaterings();
		} else {
			loading = false;
		}
	});
</script>

{#if error}
	<Notice tone="warning">{error}</Notice>
{:else if loading}
	<Notice tone="info">Wird geladen...</Notice>
{:else if waterings.length > 0}
	<WateringHistory {waterings} {currentUserId} mode="user" on:reload={loadWaterings} />
{:else}
	<Notice tone="info">
		Bisher hast du noch keine Gießungen eingetragen.
		{#if !loggedIn}
			<a href="/login" class="text-green-600 underline">Jetzt einloggen</a> und loslegen!
		{/if}
	</Notice>
{/if}
