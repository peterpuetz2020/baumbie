<script lang="ts">
	// Svelte lifecycle
	import { onMount, onDestroy } from 'svelte';

	// UI & Actions
	import { Notice } from '$components/ui';
	import { FlyToTreeButton } from '$components/actions';

	// Data loading
	import { loadAdoptedTrees } from '$lib/trees';
	import { getCurrentUser } from '$lib/supabase';

	// Types
	import type { TreeMeta } from '$types/tree';

	// State
	let adoptedTrees: TreeMeta[] = [];
	let loading = true;
	let loggedIn = false;

	let warningMessage: string | null = null;
	let warningTimeout: ReturnType<typeof setTimeout> | null = null;

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

	function showWarning(msg: string) {
		warningMessage = msg;

		if (warningTimeout) {
			clearTimeout(warningTimeout);
		}

		warningTimeout = setTimeout(() => {
			warningMessage = null;
			warningTimeout = null;
		}, 5000);
	}

	onDestroy(() => {
		if (warningTimeout) {
			clearTimeout(warningTimeout);
		}
	});
</script>

{#if loading}
	<p class="text-sm text-gray-500">Bäume werden geladen …</p>
{:else if adoptedTrees.length > 0}
	<div class="flex flex-col gap-2 items-start">
		<div class="flex flex-wrap gap-2">
			{#each adoptedTrees as tree}
				<FlyToTreeButton treeId={tree.id} on:warning={(e) => showWarning(e.detail.message)} />
			{/each}
		</div>

		{#if warningMessage}
			<div class="text-xs text-left leading-snug w-full">
				<Notice tone="warning">
					{warningMessage}
				</Notice>
			</div>
		{/if}
	</div>
{:else}
	<Notice tone="info">
		Du hast noch keine Bäume adoptiert.
		{#if !loggedIn}
			<a href="/login" class="text-green-600 underline">Jetzt einloggen</a> und loslegen!
		{/if}
	</Notice>
{/if}
