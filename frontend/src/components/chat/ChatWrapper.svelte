<script lang="ts">
	import Chat from './Chat.svelte';

	// Props übernehmen
	export let treeId: string;
</script>

<!-- Chat bekommt treeId weitergereicht -->
<Chat {treeId} />
