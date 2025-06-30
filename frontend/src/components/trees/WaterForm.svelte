<script lang="ts">
	import { goto } from '$app/navigation';
	import { WaterField, DateField, Button, Notice } from '$components/ui';

	let liter: number = 0;
	let password = '';
	let errorMessage: string | null = null;

    errorMessage = "Der Wert muss zwischen 1 und 100 liegen.";

	const handleWater = async (e: SubmitEvent) => {
        //Wassermenge für treeID von userName OR anonymous abspeichern
	};
</script>

<form on:submit={handleWater} class="flex flex-col gap-y-4">
	<div class="flex flex-col gap-y-2">
		<WaterField
			id="wassermenge"
			label="Gegossene Liter:"
            type="number"
			inputClass="w-full"
			placeholder="5"
			bind:value={liter}
            errorMessage={errorMessage}
		/>

    <DateField
        id="giessdatum"
        label="Gießdatum:"
        type="date"
        inputClass="w-full"
        placeholder="YYYY-MM-DD"
        errorMessage="Bitte ein gültiges Datum eingeben."
    />
	</div>


	<div class="flex flex-col gap-y-2">
		<Button variant="primary" type="submit" className="w-full">Speichern</Button>
	</div>
</form>
