<script lang="ts">
	import { Heading, PanelSection, Notice } from '$components/ui';
	import SpeciesButtonGrid from './SpeciesButtonGrid.svelte';
	import SpeciesButtonRow from './SpeciesButtonRow.svelte';
	import { isMobile } from '$lib/utils/media';

	export let speciesList: { label: string; count: number }[] = [];
	export let selected: string[] = [];

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function forwardToggle(e: CustomEvent<string>) {
		dispatch('toggle', e.detail);
	}
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
		<SpeciesButtonRow {speciesList} {selected} on:toggle={forwardToggle} />
	{:else}
		<SpeciesButtonGrid {speciesList} {selected} on:toggle={forwardToggle} />
	{/if}
</PanelSection>
