<script lang="ts">
	import { Modal } from '$components/overlay';
	import { WaterForm } from '$components/trees';
	import Notice from '$components/ui/Notice.svelte';
</script>

<Modal title="Gießen">
	<Notice tone="info">
		Danke, dass Du diesen Baum gießt!
		Hier findest du <a href="https://www.bund-naturschutz.de/oekologisch-leben/naturgarten/stadtbaeume-giessen" target="_blank">Tipps</a> zum Gießen von Stadtbäumen.
	</Notice>

	<Notice tone="info">
		Bitte gib hier die Menge an Wasser in Litern an, die du dem Baum in etwa gegegeben hast.
	</Notice>
	<WaterForm />

</Modal>
