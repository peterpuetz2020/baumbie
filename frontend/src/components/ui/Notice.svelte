<script lang="ts">
	export let message: string;
	export let tone: 'info' | 'warning' | 'success' = 'info'; // Ton bestimmt Farbe
</script>

<p
	class={`text-sm whitespace-pre-line ${
		tone === 'info' ? 'text-gray-500' : tone === 'warning' ? 'text-yellow-600' : 'text-green-600'
	}`}
>
	{message}
</p>
