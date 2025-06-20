<script lang="ts">
	import DefaultButton from '../../components/button/DefaultButton.svelte';
	import PrimaryButton from '../../components/button/PrimaryButton.svelte'; // falls du sowas hast

	const treeSpecies = [
		'Ahorn',
		'Birke',
		'Buche',
		'Eiche',
		'Esche',
		'Fichte',
		'Kiefer',
		'Linde',
		'Platane',
		'Robinie',
		'Ulme',
		'Weide',
		'Kastanie',
		'Pappel',
		'Zeder',
		'Zypresse',
		'Erle',
		'Douglasie',
		'Tanne',
		'Ginkgo'
	];

	let selected = '';
</script>

<div class="w-full max-w-screen-lg mx-auto space-y-10 pt-2">
	<!-- Beschreibung -->
	<div class="space-y-2">
		<p class="text-lg text-gray-800 leading-relaxed">
			Hier kannst du gezielt nach bestimmten Baumarten filtern.
		</p>
		<p class="text-lg text-gray-800 leading-relaxed">
			Wähle eine Art aus – später wird die Karte entsprechend angepasst.
		</p>
	</div>

	<!-- Graue Box -->
	<div
		class="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-6 space-y-4 w-full max-w-xl self-start"
	>
		<!-- ✅ "Alle anzeigen"-Button oben -->
		<div>
			<PrimaryButton label="Alle Baumarten anzeigen" on:click={() => (selected = '')} />
		</div>

		<!-- Baumarten-Buttons -->
		<div class="flex flex-wrap gap-x-4 gap-y-3">
			{#each treeSpecies as species}
				<DefaultButton label={species} on:click={() => (selected = species)} />
			{/each}
		</div>
	</div>

	<!-- Debug -->
	<div class="bg-gray-100 rounded-xl p-5 text-sm text-gray-800">
		<p class="font-semibold mb-1">Debug:</p>
		<p>Ausgewählt: {selected || '– (nichts ausgewählt)'}</p>
	</div>
</div>
