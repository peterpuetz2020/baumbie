<script lang="ts">
	// 🔁 Svelte
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	// 🗺️ Map
	import { mapStore, focusTreeById } from '$lib/map';

	// 🌱 Tree-Logik
	import { loadAdoptedTrees, selectedTreeFilters } from '$lib/trees';
	import type { TreeMeta } from '$types/tree';

	// 🧱 UI
	import { Button, Notice } from '$components/ui';

	import { getCurrentUser } from '$lib/supabase';

	let adoptedTrees: TreeMeta[] = [];
	let loading = true;
	let infoMessage = 'Du hast noch keine Bäume adoptiert.';
	let warningMessage = '';
	let loggedIn = false;

	onMount(async () => {
		try {
			const user = await getCurrentUser();
			loggedIn = !!user;

			adoptedTrees = await loadAdoptedTrees();
		} catch (err) {
			console.error(err);
		} finally {
			loading = false;
		}
	});

	function handleClick(tree: TreeMeta) {
		const map = get(mapStore);
		if (!map) return;

		const filter = get(selectedTreeFilters);
		const speciesFilter = filter.species ?? [];

		if (speciesFilter.length > 0 && !speciesFilter.includes(tree.tree_type_german)) {
			warningMessage = `Bäume der Art "${tree.name}" sind aktuell durch deinen Filter ausgeblendet.\n\nBitte ändere deinen Filter, wenn du deine adoptierten Bäume wieder auf der Karte sehen willst.`;
			return;
		}

		focusTreeById(map, tree.id);
	}
</script>

{#if loading}
	<p class="text-sm text-gray-500">Bäume werden geladen …</p>
{:else if adoptedTrees.length > 0}
	<div class="flex flex-wrap gap-2">
		{#each adoptedTrees as tree}
			<Button onClick={() => handleClick(tree)}>
				{tree.name}
				<img src="/icons/tree.svg" alt="Baum" class="inline-block w-4 h-4 ml-1" />
			</Button>
		{/each}
	</div>
{:else}
	<Notice tone="info">
		Du hast noch keine Bäume adoptiert.
		{#if !loggedIn}
			<a href="/login" class="text-green-600 underline">Jetzt einloggen</a> und loslegen!
		{/if}
	</Notice>
{/if}
{#if infoMessage}
	<Notice tone="warning">{warningMessage}</Notice>
{/if}
