<script lang="ts">
    import { goto } from '$app/navigation';
    import { requestPasswordReset } from '$lib/supabase';
    import { EmailField, Button, Notice } from '$components/ui';

    let email = '';
    let errorMessage: string | null = null;
    let successMessage: string | null = null;
    let isSubmitting = false;

    const handleSubmit = async (event: SubmitEvent) => {
        event.preventDefault();

        if (!email) {
            errorMessage = 'Bitte gib deine E-Mail-Adresse ein.';
            successMessage = null;
            return;
        }

        errorMessage = null;
        successMessage = null;
        isSubmitting = true;

        try {
            const result = await requestPasswordReset(email);

            if (result.ok) {
                successMessage =
                    'Wir haben dir soeben eine E-Mail mit dem Betreff "Baumbie Passwort zurücksetzen" geschickt. Dort findest du einen Link, um ein neues Passwort festzulegen.';
                email = '';
            } else {
                errorMessage = result.error ?? 'Die Passwort-Wiederherstellung ist leider fehlgeschlagen.';
            }
        } catch (err) {
            errorMessage = 'Etwas ist schiefgelaufen. Bitte versuche es später erneut.';
        } finally {
            isSubmitting = false;
        }
    };
</script>

<form class="flex flex-col gap-y-4" on:submit={handleSubmit}>
    <EmailField
        id="reset-email"
        label="E-Mail-Adresse:"
        inputClass="w-full"
        placeholder="lebensbaum@baumbie.de"
        bind:value={email}
    />

    {#if errorMessage}
        <Notice tone="warning">{errorMessage}</Notice>
    {/if}
    {#if successMessage}
        <Notice tone="success">{successMessage}</Notice>
    {/if}

    <div class="flex flex-col gap-y-2">
        <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Bitte warten …' : 'Mail anfordern'}
        </Button>
        <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => goto('/login')}
        >
            Zurück zum Login
        </Button>
    </div>
</form>