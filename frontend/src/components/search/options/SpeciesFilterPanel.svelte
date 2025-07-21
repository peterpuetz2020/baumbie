<script lang="ts">
	import { Heading, PanelSection, Notice } from '$components/ui';
	import FilterOptionGrid from './FilterOptionGrid.svelte';
	import FilterOptionRow from './FilterOptionRow.svelte';
	import { isMobile } from '$lib/utils/media';

	export let options: { label: string; count: number }[] = [];
	export let selected: string[] = [];
</script>

<PanelSection className="space-y-6 px-2 sm:px-6">
	<Heading level={2}>Häufigste Baumarten</Heading>

	<Notice tone="info">
		Hier kannst du gezielt nach bestimmten Baumarten filtern. Zur Auswahl stehen die
		<strong>30 häufigsten</strong> Arten in Bielefeld, die gemeinsam rund
		<strong>85% aller Stadtbäume</strong> ausmachen. Wähle eine oder mehrere Arten aus – die Karte zeigt
		anschließend nur diese an.
	</Notice>

	{#if $isMobile}
		<FilterOptionRow {options} {selected} on:toggle />
	{:else}
		<FilterOptionGrid {options} {selected} on:toggle />
	{/if}
</PanelSection>
