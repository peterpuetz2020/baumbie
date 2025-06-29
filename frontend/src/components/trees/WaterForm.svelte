<script lang="ts">
	import { goto } from '$app/navigation';
	import { WaterField, Button, Notice } from '$components/ui';

	let liter: number = 0;
	let password = '';
	let errorMessage: string | null = null;

    errorMessage = "Der Wert muss zwischen 0 und 100 liegen.";

	const handleWater = async (e: SubmitEvent) => {
        //Wassermenge für treeID von userName OR anonymous abspeichern
	};
</script>

<form on:submit={handleWater} class="flex flex-col gap-y-4">
	<div class="flex flex-col gap-y-2">
		<WaterField
			id="wassermenge"
			label="Liter:"
            type="number"
			inputClass="w-full"
			placeholder="5"
			bind:value={liter}
            error={errorMessage ? 'Bitte gib eine gültige Zahl ein.' : ''}
		/>

	</div>

	{#if errorMessage}
		<Notice tone="warning">{errorMessage}</Notice>
	{/if}

	<div class="flex flex-col gap-y-2">
		<Button variant="primary" type="submit" className="w-full">Speichern</Button>
	</div>
</form>
