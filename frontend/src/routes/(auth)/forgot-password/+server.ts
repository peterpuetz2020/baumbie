import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';

const supabaseUrl = env.VITE_SUPABASE_URL ?? env.SUPABASE_URL ?? '';
const supabaseServiceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY ?? '';

const supabaseAdminClient =
    supabaseUrl && supabaseServiceRoleKey
        ? createClient(supabaseUrl, supabaseServiceRoleKey, {
              auth: {
                  autoRefreshToken: false,
                  persistSession: false,
              },
          })
        : null;

export const POST: RequestHandler = async ({ request }) => {
    if (!supabaseAdminClient) {
        console.error('Supabase Service Role Key oder URL fehlen für Passwort-Reset.');
        return json(
            {
                ok: false,
                error: 'Zurücksetzen des Passworts nicht möglich. Bitte versuche es erneut.',
            },
            { status: 500 }
        );
    }

    let payload: unknown;

    try {
        payload = await request.json();
    } catch (error) {
        console.error('Ungültige JSON-Nutzlast für Passwort-Reset-Anfrage:', error);
        return json({ ok: false, error: 'Ungültige Anfrage.' }, { status: 400 });
    }

    const email = typeof (payload as { email?: unknown }).email === 'string'
        ? (payload as { email: string }).email.trim().toLowerCase()
        : '';

    if (!email) {
        return json({ ok: false, error: 'Bitte gib deine E-Mail-Adresse ein.' }, { status: 400 });
    }

    const { data: userList, error: userLookupError } = await supabaseAdminClient.auth.admin.listUsers({
        email,
        perPage: 1,
    });

    if (userLookupError || !userList?.users?.length) {
        return json(
            { ok: false, error: 'E-Mail-Adresse ist nicht bei baumbie registriert!' },
            { status: 404 }
        );
    }

    const redirectTo = env.PASSWORD_RESET_REDIRECT_URL ?? env.VITE_PASSWORD_RESET_REDIRECT_URL;

    const { error: resetError } = await supabaseAdminClient.auth.resetPasswordForEmail(
        email,
        redirectTo ? { redirectTo } : undefined
    );

    if (resetError) {
        console.error('Fehler beim Senden der Passwort-Reset-Mail:', resetError);
        return json(
            {
                ok: false,
                error: 'Zurücksetzen des Passworts nicht möglich. Bitte versuche es erneut.',
            },
            { status: 500 }
        );
    }

    return json({ ok: true });
};