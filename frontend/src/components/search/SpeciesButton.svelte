<script lang="ts">
	import { Button } from '$components/ui';
	import { createEventDispatcher } from 'svelte';

	export let label: string;
	export let count: number;
	export let selected: boolean = false;

	const dispatch = createEventDispatcher();
</script>

<Button
	onClick={() => dispatch('toggle', label)}
	variant={selected ? 'primary' : 'default'}
	className="flex-shrink-0 whitespace-nowrap"
>
	<strong>{label}</strong>&nbsp;({count})
</Button>
