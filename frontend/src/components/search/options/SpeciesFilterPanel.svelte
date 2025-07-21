<script lang="ts">
	import { PanelSection, Notice } from '$components/ui';
	import FilterOptionGrid from './FilterOptionGrid.svelte';
	import FilterOptionRow from './FilterOptionRow.svelte';
	import { isMobile } from '$lib/utils/media';

	export let options: { label: string; count: number }[] = [];
	export let selected: string[] = [];
</script>

<PanelSection title="Häufigste Baumarten">
	<Notice tone="info">
		Wähle eine oder mehrere Arten aus – die Karte zeigt anschließend nur diese an. <br /> Zur
		Auswahl stehen die
		<strong>30 häufigsten</strong> Arten in Bielefeld (🌿
		<strong>85% aller Stadtbäume</strong>).
	</Notice>

	{#if $isMobile}
		<FilterOptionRow {options} {selected} on:toggle />
	{:else}
		<FilterOptionGrid {options} {selected} on:toggle />
	{/if}
</PanelSection>
