<script lang="ts">
    import { Notice } from '$components/ui';
    import type { HTMLInputTypeAttribute } from 'svelte/elements';

    export let id: string | undefined = undefined;
    export let label: string | undefined = undefined;
    export let value: string = new Date().toISOString().slice(0, 10); // Default: aktuelles Datum im Format YYYY-MM-DD
    export let placeholder: string = '';
    export let errorMessage: string | null = null;
    export let error: boolean = false;

    export let type: HTMLInputTypeAttribute = 'date';
    export let inputClass: string | undefined = undefined;

    $: error = !value; // Fehler, wenn kein Datum gesetzt ist
</script>

{#if id && label}
    <label class="block" for={id}>
        <div class="block mb-1">{label}</div>
        <input
            {id}
            {...{ type }}
            class={`${inputClass} rounded-lg border ${error ? 'border-red-500' : 'border-gray-500'} p-2`}
            {placeholder}
            bind:value
        />
        {#if error && errorMessage}
            <Notice tone="warning">
                {errorMessage}
            </Notice>
        {/if}
    </label>
{:else}
    <input
        {id}
        {...{ type }}
        class={`${inputClass} rounded-lg border ${error ? 'border-red-500' : 'border-gray-500'} p-2`}
        {placeholder}
        bind:value
    />
    {#if error && errorMessage}
        <p class="text-sm text-red-500">{errorMessage}</p>
    {/if}
{/if}
