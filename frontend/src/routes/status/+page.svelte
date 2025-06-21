<script lang="ts">
	import { DialogPanel } from '$components/overlay';
	import { AdoptedTrees, NearbyTrees } from '$components/status';
</script>

<DialogPanel title={'Mein Bereich'} open={true}>
	<div class="pt-6 pb-6 space-y-2">
		<NearbyTrees />
	</div>

	<div class="pb-6 space-y-2">
		<AdoptedTrees />
	</div>

	<!-- Später Inhalt: Dein Gießfortschritt -->
</DialogPanel>
