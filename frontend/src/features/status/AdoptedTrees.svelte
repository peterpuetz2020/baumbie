<script lang="ts">
	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';
	import { loadAdoptedTrees } from '$lib/trees/loadAdoptedTrees';

	import { Button } from '$components/ui';
	import Heading from '$components/typography/Heading.svelte';

	import type { AdoptedTree } from '../../types/Tree';

	let adoptedTrees: AdoptedTree[] = [];
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
</script>

<div class="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
	<Heading level={2}>Meine adoptierten Bäume</Heading>

	{#if loading}
		<p class="text-sm text-gray-500">Bäume werden geladen …</p>
	{:else if adoptedTrees.length > 0}
		<div class="flex flex-wrap gap-2">
			{#each adoptedTrees as tree}
				<Button onClick={() => goto(`/trees/${tree.id}`)}>
					{tree.name}
					<img src="/icons/tree.svg" alt="Baum" class="inline-block w-4 h-4 ml-1" />
				</Button>
			{/each}
		</div>
	{:else}
		<p class="text-sm text-gray-500">Du hast noch keine Bäume adoptiert.</p>
	{/if}
</div>
