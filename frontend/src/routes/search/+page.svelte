<script lang="ts">
	import { DialogPanel } from '$components/overlay';

	import FilterTrees from '$components/search/FilterTrees.svelte';
</script>

<DialogPanel title={'Nach Baumarten filtern'} open={true}>
	<div class="pt-2 pb-6 space-y-4">
		<FilterTrees />
	</div>
</DialogPanel>
