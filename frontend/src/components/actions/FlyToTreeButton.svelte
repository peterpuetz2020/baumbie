<script lang="ts">
	import { Button } from '$components/ui';
	import type { ButtonVariant } from '$components/ui';
	import { get } from 'svelte/store';
	import { mapStore, focusTreeById } from '$lib/map';

	export let treeId: string;
	export let label: string;
	export let variant: ButtonVariant = 'secondary';
</script>

<Button
	{variant}
	onClick={() => {
		const map = get(mapStore);
		if (map) focusTreeById(map, treeId);
	}}
	className="gap-1 text-sm"
>
	{label}
	<img src="/icons/tree.svg" alt="Baum" class="w-4 h-4" />
	<span>→</span>
</Button>
