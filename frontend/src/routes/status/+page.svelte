<script lang="ts">
	import Card from '../../components/card/Card.svelte';
	import Heading from '../../components/typography/Heading.svelte';
	import SearchTrees from '../../features/status/SearchTrees.svelte';
</script>

<Card title={'Mein Bereich'} open={true}>
	<div class="pt-2 pb-6 space-y-2">
		<SearchTrees />
	</div>

	<hr class="border-gray-300" />

	<div class="pt-6 pb-4 space-y-2">
		<Heading level={2}>🚿 Dein Gießfortschritt</Heading>
		<!-- Später Inhalt -->
	</div>

	<hr class="border-gray-300" />

	<div class="pt-6 pb-4 space-y-2">
		<Heading level={2}>🌱 Deine adoptierten Bäume</Heading>
		<!-- Später Inhalt -->
	</div>
</Card>
