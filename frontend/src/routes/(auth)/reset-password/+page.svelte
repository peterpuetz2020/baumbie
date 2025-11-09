<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { Modal } from '$components/overlay';
    import { Button } from '$components/ui';
    import { PasswordUpdateForm } from '$components/auth';
    import { supabase } from '$lib/supabase';

    type ViewState = 'checking' | 'ready' | 'error';

    let state: ViewState = 'checking';
    let errorMessage =
        'Der Link zum Zuruecksetzen deines Passworts ist leider ungueltig oder abgelaufen. Bitte fordere einen neuen Link an.';

    onMount(async () => {
        const currentUrl = new URL(window.location.href);
        const hashParams = new URLSearchParams(currentUrl.hash.startsWith('#') ? currentUrl.hash.slice(1) : '');
        const queryParams = currentUrl.searchParams;

        const cleanupUrl = () => {
            const sanitizedParams = new URLSearchParams(queryParams);
            const paramsToStrip = [
                'code',
                'type',
                'token',
                'token_hash',
                'access_token',
                'refresh_token',
                'expires_at',
                'expires_in',
                'provider',
                'redirect_to',
                'error',
                'error_description',
            ];

            for (const param of paramsToStrip) {
                sanitizedParams.delete(param);
            }

            const newQuery = sanitizedParams.toString();
            const newPath = newQuery ? `${currentUrl.pathname}?${newQuery}` : currentUrl.pathname;
            window.history.replaceState({}, '', newPath);
        };

        try {
            const code = queryParams.get('code');
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');

            if (code) {
                const { error } = await supabase.auth.exchangeCodeForSession(code);
                if (error) {
                    throw error;
                }
            } else if (accessToken && refreshToken) {
                const { error } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken,
                });
                if (error) {
                    throw error;
                }
            }

            const { data, error } = await supabase.auth.getSession();
            if (error || !data.session) {
                throw error ?? new Error('Keine gueltige Sitzung fuer Passwort-Reset vorhanden.');
            }

            cleanupUrl();
            state = 'ready';
        } catch (error) {
            console.error('Fehler beim Vorbereiten des Passwort-Resets:', error);
            cleanupUrl();
            state = 'error';
        }
    });

    const handleRequestNewMail = () => {
        goto('/forgot-password');
    };
</script>

{#if state === 'checking'}
    <Modal title="Passwort zuruecksetzen" closeOnBackdrop={false}>
        <p class="text-sm text-baumbie-gray-700">
            Wir pruefen deinen Zuruecksetzungslink ...
        </p>
    </Modal>
{:else if state === 'ready'}
    <Modal title="Passwort zuruecksetzen" closeOnBackdrop={false}>
        <PasswordUpdateForm />
    </Modal>
{:else}
    <Modal title="Link ungueltig" closeOnBackdrop={false}>
        <div class="flex flex-col gap-y-4">
            <p class="text-sm text-baumbie-gray-700">{errorMessage}</p>
            <Button type="button" variant="primary" className="w-full" on:click={handleRequestNewMail}>
                Neue E-Mail anfordern
            </Button>
        </div>
    </Modal>
{/if}
