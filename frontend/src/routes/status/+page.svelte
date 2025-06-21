<script lang="ts">
	import Card from '../../components/card/Card.svelte';
	import SearchTrees from '../../features/status/SearchTrees.svelte';
	import AdoptedTrees from '../../features/status/AdoptedTrees.svelte';
</script>

<Card title={'Mein Bereich'} open={true}>
	<div class="pt-6 pb-6 space-y-2">
		<SearchTrees />
	</div>

	<div class="pb-6 space-y-2">
		<AdoptedTrees />
	</div>

	<!-- Später Inhalt: Dein Gießfortschritt -->
</Card>
