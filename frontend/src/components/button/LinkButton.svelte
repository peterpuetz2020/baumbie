<script lang="ts">
	import BaseButton from './BaseButton.svelte';
	import { goto } from '$app/navigation';

	const handleClick= (e: MouseEvent) => {
		e.preventDefault(); 
		if($$props.href) goto($$props.href);
	};
</script>


<a href={$$props.href}>
<BaseButton
	on:click={handleClick}
	{...$$props}
	{...$$restProps}
	class={` border-2 border-green-500 text-black text-center ${$$props.class}` }
	label={$$props.label}
/>
</a>