<script lang="ts">
	import Card from '$components/card/Card.svelte';
	import FilterTrees from '../../features/search/FilterTrees.svelte';
</script>

<Card title={'Nach Baumarten filtern'} open={true}>
	<div class="pt-2 pb-6 space-y-4">
		<FilterTrees />
	</div>
</Card>
