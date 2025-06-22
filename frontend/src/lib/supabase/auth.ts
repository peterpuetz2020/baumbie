import { supabase } from "./client";


export async function getCurrentUser(): Promise<{ email?: string } | null> {
	const { data, error } = await supabase.auth.getUser();
	if (error) {
		console.warn('getCurrentUser() failed:', error.message);
		return null;
	}
	return data.user ?? null;
}

export async function registerWithEmailPassword(email: string, password: string): Promise<void> {
	const { error } = await supabase.auth.signUp({ email, password });

	if (error) {
		const knownErrors: Record<string, string> = {
			'User already registered': 'Diese E-Mail-Adresse ist bereits registriert.',
			'Invalid email': 'Die eingegebene E-Mail-Adresse ist ungültig.',
			'Password should be at least 6 characters.': 'Das Passwort ist zu schwach.'
		};
		throw new Error(knownErrors[error.message] ?? error.message);
	}
}

export async function loginWithEmailPassword(email: string, password: string) {
	const { data, error } = await supabase.auth.signInWithPassword({ email, password });
	if (error || !data?.user) {
		throw new Error('Die Anmeldung mit diesen Zugangsdaten ist fehlgeschlagen!');
	}
	return data.user;
}

export async function logout(): Promise<void> {
	await supabase.auth.signOut();
}

export async function deleteCurrentUser(): Promise<{ ok: boolean; error?: string }> {
	const sessionResult = await supabase.auth.getSession();
	const accessToken = sessionResult.data.session?.access_token;

	if (!accessToken) {
		return { ok: false, error: 'Authentifizierungsfehler: Kein Zugriffstoken gefunden.' };
	}

	const DELETE_USER_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user`;

	const res = await fetch(DELETE_USER_URL, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	if (res.status === 200) {
		return { ok: true };
	} else {
		return { ok: false, error: 'Verbindungsfehler: Account konnte nicht gelöscht werden.' };
	}
}
