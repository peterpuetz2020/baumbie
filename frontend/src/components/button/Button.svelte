<script lang="ts">
	type ButtonVariant = 'default' | 'primary' | 'secondary';

	export let variant: ButtonVariant = 'default';
	export let className: string = '';
	let onClick?: (e: MouseEvent) => void;

	const variantClasses: Record<ButtonVariant, string> = {
		default: 'border-black text-black hover:bg-green-800 hover:text-white',
		primary: 'border-green-600 bg-green-600 text-white hover:bg-green-800',
		secondary: 'border-green-500 text-black hover:bg-green-100'
	};
</script>

<button
	type="button"
	class={`border-2 rounded-full px-4 py-2 flex items-center justify-center transition duration-150 ease-in-out ${variantClasses[variant]} ${className}`}
	on:click={onClick}
>
	<slot />
</button>
