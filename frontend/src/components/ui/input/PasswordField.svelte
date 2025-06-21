<script lang="ts">
	import InputField from './InputField.svelte';

	export let id: string;
	export let label: string;
	export let placeholder: string = '';
	export let inputClass: string = '';
	export let value: string = '';
	export let error: string = '';
</script>

<InputField type="password" {id} {label} {placeholder} {inputClass} bind:value {error} />
