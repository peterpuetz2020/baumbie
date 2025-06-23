<script lang="ts">
	// 🔁 Svelte
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	// 🗺️ Map
	import { mapStore, focusTreeById } from '$lib/map';

	// 🌱 Tree-Logik
	import { loadAdoptedTrees, selectedSpecies } from '$lib/trees';
	import type { TreeMeta } from '$types/tree';

	// 🧱 UI
	import { Button, Heading, Notice } from '$components/ui';

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

		const species = tree.tree_type_german;
		if (get(selectedSpecies).length > 0 && !get(selectedSpecies).includes(species)) {
			warningMessage = `Bäume der Art "${tree.name}" sind aktuell durch deinen Filter ausgeblendet.\n\nBitte ändere deinen Filter, wenn du deine adoptierten Baum wieder auf der Karte sehen willst.`;
			return;
		}

		focusTreeById(map, tree.id);
	}
</script>

<div class="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
	<Heading level={2}>Meine adoptierten Bäume</Heading>

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
</div>
