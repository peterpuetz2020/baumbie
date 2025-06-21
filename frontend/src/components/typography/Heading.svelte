<script lang="ts">
	type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

	export let level: HeadingLevel = 1;
	export let className: string = '';

	const tag = `h${level}`;

	const levelClassMap: Record<HeadingLevel, string> = {
		1: 'font-bold text-2xl pb-4',
		2: 'font-bold pb-2',
		3: 'font-bold pb-2',
		4: 'font-bold pb-2',
		5: 'font-bold pb-2',
		6: 'font-bold pb-2'
	};

	$: combinedClass = `${levelClassMap[level]} ${className}`.trim();
</script>

<svelte:element this={tag} class={combinedClass}>
	<slot />
</svelte:element>
