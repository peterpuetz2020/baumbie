<script lang="ts">
	import { Notice, PanelSection } from '$components/ui';
	import parseMarkdown from '$lib/utils/parseMarkdown';
	export let description: string | null = null;

	const defaultDescription =
		'Hej, wie mein Name schon verrät komme ich ursprünglich aus dem Norden von Europa.<br><br>Ich bin **sehr variabel** in meinem Äußeren. Entweder wachse ich bis zu **15m** mit einem geraden Stamm, oder aber du findest mich als **mehrstämmigen großen Strauch**.';

	let renderedDescription = '';

	$: description,
		(async () => {
			renderedDescription = await parseMarkdown(description ?? defaultDescription);
		})();
</script>

<PanelSection>
	<Notice tone="info">
		{@html renderedDescription}
	</Notice>
</PanelSection>
