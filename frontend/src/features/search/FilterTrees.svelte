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
	<div class="space-y-2">
		<p class="text-lg text-gray-800 leading-relaxed">
			Hier kannst du gezielt nach bestimmten Baumarten filtern.
		</p>
		<p class="text-lg text-gray-800 leading-relaxed">
			Zur Auswahl stehen die 30 häufigsten Arten in Bielefeld – sie machen gemeinsam rund 80 % aller
			Stadtbäume aus.
		</p>
		<p class="text-lg text-gray-800 leading-relaxed">
			Wähle eine oder mehrere Arten aus – die Karte zeigt anschließend nur diese an.
		</p>
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

	<!-- Debug -->
	<div class="bg-gray-100 rounded-xl p-5 text-sm text-gray-800">
		<p class="font-semibold mb-1">Debug:</p>
		<p>Ausgewählt: {current.length ? current.join(', ') : '– (nichts ausgewählt)'}</p>
	</div>
</div>
