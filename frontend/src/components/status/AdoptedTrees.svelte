<script lang="ts">
	// 🔁 Svelte
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	// 🗺️ Map
	import { mapStore, focusTreeById } from '$lib/map';

	// 🌱 Tree-Logik
	import { loadAdoptedTrees } from '$lib/trees';
	import type { TreeMeta } from '$types/tree';

	// 🧱 UI
	import { Button, Heading } from '$components/ui';

	let adoptedTrees: TreeMeta[] = [];
	let loading = true;

	onMount(async () => {
		try {
			adoptedTrees = await loadAdoptedTrees();
		} catch (err) {
			console.error(err);
		} finally {
			loading = false;
		}
	});

	function handleClick(tree: TreeMeta) {
		const map = get(mapStore);
		if (map) {
			focusTreeById(map, tree.id);
		}
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
		<p class="text-sm text-gray-500">Du hast noch keine Bäume adoptiert.</p>
	{/if}
</div>
