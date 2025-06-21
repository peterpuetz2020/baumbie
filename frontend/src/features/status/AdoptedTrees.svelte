<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '../../supabase';
	import { goto } from '$app/navigation';
	import { Button } from '$components/button';

	type AdoptedTree = {
		id: string;
		name: string;
	};

	let adopted_trees: AdoptedTree[] = [];
	let loading = true;
	let error = null;

	onMount(async () => {
		try {
			const { data: userData } = await supabase.auth.getUser();
			const user_id = userData?.user?.id;
			if (!user_id) return;

			const { data: adoptions, error: adoptionError } = await supabase
				.from('adoptions')
				.select()
				.eq('user_uuid', user_id);

			if (adoptionError) throw adoptionError;

			const trees = await Promise.all(
				adoptions.map(async (entry) => {
					const { data: treeData, error: treeError } = await supabase
						.from('trees')
						.select()
						.eq('uuid', entry.tree_uuid)
						.maybeSingle();

					if (treeError) {
						console.error(treeError);
						return null;
					}

					return {
						id: entry.tree_uuid,
						name: treeData?.tree_type_german || 'Unbekannter Baum'
					};
				})
			);

			adopted_trees = trees.filter(Boolean) as AdoptedTree[];
		} catch (err) {
			console.error(err);
			error = err;
		} finally {
			loading = false;
		}
	});
</script>

{#if loading}
	<p class="text-sm text-gray-500">Bäume werden geladen …</p>
{:else if adopted_trees.length > 0}
	<div class="flex flex-wrap gap-2">
		{#each adopted_trees as tree}
			<Button onClick={() => goto(`/trees/${tree.id}`)}>
				{tree.name}
				<img src="/icons/tree.svg" alt="Baum" />
			</Button>
		{/each}
	</div>
{:else}
	<p class="text-sm text-gray-500">Du hast noch keine Bäume adoptiert.</p>
{/if}
