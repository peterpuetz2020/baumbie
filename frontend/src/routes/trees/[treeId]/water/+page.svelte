<script lang="ts">
	import { Modal } from '$components/overlay';
	import { AddWateringForm } from '$components/trees';
	import WateringSuccess from '$components/trees//watering/WateringSuccess.svelte';
	import Notice from '$components/ui/Notice.svelte';

	let modalOpen = true;
	let showSuccess = false;
</script>

{#if modalOpen}
	<Modal title="Danke fürs Gießen! 🚿" on:close={() => (modalOpen = false)}>
		{#if showSuccess}
			<WateringSuccess on:done={() => (modalOpen = false)} />
		{:else}
			<div class="flex flex-col gap-6">
				<Notice tone="info">
					Stadtbäume haben ihre Eigenheiten – bevor du gießt, kannst du dir
					<a
						href="https://www.bund-naturschutz.de/oekologisch-leben/naturgarten/stadtbaeume-giessen"
						target="_blank"
						class="underline underline-offset-2 decoration-green-600 text-green-700 hover:text-green-800"
					>
						ein paar praktische Tipps
					</a>
					durchlesen.
				</Notice>

				<Notice tone="info">Trage dann ein, wie viele Liter du ungefähr gegossen hast.</Notice>

				<AddWateringForm on:success={() => (showSuccess = true)} />
			</div>
		{/if}
	</Modal>
{/if}
