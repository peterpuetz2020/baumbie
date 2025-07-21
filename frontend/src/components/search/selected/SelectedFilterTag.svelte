<script lang="ts">
	import { Tag } from '$components/ui';
	export let label: string;

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<Tag {label} removable on:remove={() => dispatch('remove', label)} />
