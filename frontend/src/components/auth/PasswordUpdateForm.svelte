<script lang="ts">
    import { goto } from '$app/navigation';
    import { onDestroy } from 'svelte';
    import { logout, updatePassword } from '$lib/supabase';
    import { PasswordField, Button, Notice } from '$components/ui';

    const MIN_PASSWORD_LENGTH = 6;

    let password = '';
    let passwordConfirmation = '';
    let errorMessage: string | null = null;
    let successMessage: string | null = null;
    let isSubmitting = false;
    let redirectTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleSubmit = async (event: SubmitEvent) => {
        event.preventDefault();

        if (!password) {
            errorMessage = 'Bitte gib ein neues Passwort ein.';
            successMessage = null;
            return;
        }

        if (password !== passwordConfirmation) {
            errorMessage = 'Die beiden Passwoerter stimmen nicht ueberein!';
            successMessage = null;
            return;
        }

        if (password.length < MIN_PASSWORD_LENGTH) {
            errorMessage = `Passwort muss mindestens ${MIN_PASSWORD_LENGTH} Zeichen lang sein.`;
            successMessage = null;
            return;
        }

        errorMessage = null;
        successMessage = null;
        isSubmitting = true;

        try {
            const result = await updatePassword(password);

            if (!result.ok) {
                errorMessage = result.error ?? 'Das Passwort konnte nicht aktualisiert werden.';
                return;
            }

            successMessage =
                'Dein Passwort wurde erfolgreich geaendert. Du wirst gleich zum Login weitergeleitet.';

            await logout();

            redirectTimeout = setTimeout(() => {
                goto('/login');
            }, 2000);
        } catch (error) {
            console.error('Fehler beim Aktualisieren des Passworts:', error);
            errorMessage = 'Das Passwort konnte nicht aktualisiert werden. Bitte versuche es erneut.';
        } finally {
            isSubmitting = false;
        }
    };

    $: if (successMessage) {
        password = '';
        passwordConfirmation = '';
    }

    // Cleanup redirect timeout if the user leaves the page early
    onDestroy(() => {
        if (redirectTimeout) {
            clearTimeout(redirectTimeout);
        }
    });
</script>

<form class="flex flex-col gap-y-4" on:submit={handleSubmit}>
    <PasswordField
        id="new-password"
        label="Neues Passwort:"
        inputClass="w-full"
        placeholder="********"
        bind:value={password}
    />

    <PasswordField
        id="confirm-password"
        label="Neues Passwort (Wiederholung):"
        inputClass="w-full"
        placeholder="********"
        bind:value={passwordConfirmation}
    />

    {#if errorMessage}
        <Notice tone="warning">{errorMessage}</Notice>
    {/if}
    {#if successMessage}
        <Notice tone="success">{successMessage}</Notice>
    {/if}

    <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Wird gespeichert ...' : 'Passwort zuruecksetzen'}
    </Button>
</form>
