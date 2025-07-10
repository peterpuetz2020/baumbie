<script lang="ts">
	export let tone: 'info' | 'warning' | 'success' = 'info'; // Ton bestimmt Farbe
</script>

<p
	class={`text-sm whitespace-normal ${
		tone === 'info' ? 'text-gray-700' : tone === 'warning' ? 'text-yellow-600' : 'text-green-600'
	}`}
>
	<slot />
</p>
