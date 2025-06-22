<script lang="ts">
	export let message: string;
	export let tone: 'info' | 'warning' = 'info'; // Ton bestimmt Farbe
</script>

<p class={`text-sm whitespace-pre-line ${tone === 'info' ? 'text-gray-500' : 'text-yellow-600'}`}>
	{message}
</p>
