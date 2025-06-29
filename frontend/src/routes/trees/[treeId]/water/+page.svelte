<script lang="ts">
	import { Modal } from '$components/overlay';
	import { WaterForm } from '$components/trees';
	import Notice from '$components/ui/Notice.svelte';
</script>

<Modal title="Gießen">
	<Notice tone="info">
		Bitte gib die Menge an Wasser in Litern an, die du dem Baum gegegeben hast.
		Gießen will gelernt sein. Der NaBu hat dazu hilfreiche <a href="https://www.bund-naturschutz.de/oekologisch-leben/naturgarten/stadtbaeume-giessen" target="_blank">Hinweise</a>.
	</Notice>
	<WaterForm />

</Modal>
