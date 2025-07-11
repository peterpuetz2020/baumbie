<script lang="ts">
	import { Heading } from '$components/ui';
	export let title: string | null = null;
	export let level: 1 | 2 | 3 | 4 | 5 | 6 = 2;
	export let className: string = '';
</script>

<div class={`p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3 ${className}`.trim()}>
	{#if title}
		<Heading {level}>{title}</Heading>
	{/if}
	<slot />
</div>
