<script lang="ts">
	export let species: string[] = [];

	import SelectedFilterTag from './SelectedFilterTag.svelte';
</script>

{#if species.length > 0}
	<div class="px-2 -mt-3 flex flex-wrap gap-2">
		{#each species as label}
			<SelectedFilterTag {label} on:remove />
		{/each}
	</div>
{/if}
