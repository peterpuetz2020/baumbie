<script lang="ts">
	import UserMessage from '$components/chat/UserMessage.svelte';
	import { DialogPanel } from '$components/overlay';
	import { AdoptedTrees, NearbyTrees, UserWaterings } from '$components/status';
	import { PanelSection } from '$components/ui';
</script>

<DialogPanel title={'Mein Bereich'} open={true}>
	<div class="pt-6 pb-6 space-y-6">
		<PanelSection title="Bäume in meiner Nähe">
			<NearbyTrees />
		</PanelSection>

		<PanelSection title="Meine adoptierten Bäume">
			<AdoptedTrees />
		</PanelSection>

		<PanelSection title="Meine Gießfortschritte">
			<UserWaterings />
		</PanelSection>
	</div>

	<!-- Später Inhalt: Dein Gießfortschritt -->
</DialogPanel>
