<script lang="ts">
	import DefaultButton from '../../components/button/DefaultButton.svelte';
	import PrimaryButton from '../../components/button/PrimaryButton.svelte';
	import { selectedSpecies } from '$lib/map/treeFilter';
	import { loadTopSpecies } from '$lib/map/topSpecies';
	import { onMount } from 'svelte';

	let topSpecies: { label: string; count: number }[] = [];

	onMount(async () => {
		topSpecies = await loadTopSpecies();
	});

	$: current = $selectedSpecies;
</script>

<div class="w-full max-w-screen-lg mx-auto space-y-10 pt-2">
	<!-- Beschreibung -->
	<div class="space-y-2 text-lg text-gray-800 leading-relaxed">
		<p>Hier kannst du gezielt nach bestimmten Baumarten filtern.</p>
		<p>
			Zur Auswahl stehen die <strong>30 häufigsten</strong> Arten in Bielefeld, die gemeinsam rund
			<strong>85 % aller Stadtbäume</strong> ausmachen.
		</p>
		<p>Wähle eine oder mehrere Arten aus – die Karte zeigt anschließend nur diese an.</p>
	</div>

	<!-- Graue Box -->
	<div class="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-6 space-y-4 w-full">
		<!-- ✅ "Alle anzeigen"-Button oben -->
		<div>
			<PrimaryButton label="Alle Baumarten anzeigen" on:click={() => selectedSpecies.reset()} />
		</div>

		<!-- Baumarten-Buttons -->
		<div class="flex flex-wrap gap-x-4 gap-y-3">
			{#each topSpecies as species}
				<DefaultButton
					label={`${species.label} (${species.count})`}
					on:click={() => selectedSpecies.toggle(species.label)}
					class={current.includes(species.label)
						? 'bg-green-800 text-white border-green-800'
						: 'border border-gray-400'}
				/>
			{/each}
		</div>
	</div>
</div>
