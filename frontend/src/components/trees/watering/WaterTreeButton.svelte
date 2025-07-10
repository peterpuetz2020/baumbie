<script lang="ts">
	import type { TreeData } from '$types/tree';
	import { Button } from '$components/ui';
	import { goto } from '$app/navigation';

	export let tree: TreeData;
</script>

{#if tree}
	<div class="flex flex-col gap-2">
		<Button variant="watering" onClick={() => goto(`/trees/${tree.uuid}/water`)}>
			Gieße diesen Baum
		</Button>
	</div>
{/if}
