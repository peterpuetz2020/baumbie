<script lang="ts">
	import { onMount } from 'svelte';
	import type { TreeData } from '$types/tree';
	import { Button, Notice } from '$components/ui';
	import { getCurrentUser, isTreeAdopted, toggleTreeAdoption } from '$lib/supabase';
	import { goto } from '$app/navigation';

	export let tree: TreeData;

	let authorized = false;
	$: label = 'Gieße diesen Baum';

	onMount(async () => {
		const user = await getCurrentUser();
		if (!user) return;

		authorized = true;
	});
</script>

{#if tree}
	<div class="flex flex-col gap-2">
		<Button variant={'primary'} onClick={() => goto(`/trees/${tree.uuid}/water`)}>
			{label}
		</Button>
	</div>
{/if}
