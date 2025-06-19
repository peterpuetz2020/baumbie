<script lang="ts">
	import BaseButton from './Button.svelte';
	import { goto } from '$app/navigation';

	export let className: string = '';
	export let href: string = '';

	const onClick = (e: MouseEvent) => {
		e.preventDefault();
		if (href) goto(href);
	};
</script>

<BaseButton {onClick} className={`border-2 border-green-500 text-black text-center ${className}`}>
	<slot />
</BaseButton>
