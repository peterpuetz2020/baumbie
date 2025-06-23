import { supabase } from "./client";


export async function registerWithEmailPassword(email: string, password: string) {
	const { data, error } = await supabase.auth.signUp({ email, password });

	if (error) {
		// Bekannter Fehler: Passwort zu kurz
		if (error.message.toLowerCase().includes('password should be at least')) {
			throw new Error('Passwort muss mindestens 6 Zeichen lang sein.');
		}

		throw error; // Unbekannter Fehler
	}

	if (!data.user?.id) {
		throw new Error('Registrierung fehlgeschlagen. Bitte versuche es erneut.');
	}

	if (data.user.identities?.length === 0) {
		throw new Error('Diese E-Mail-Adresse ist bereits registriert.');
	}

	return {
		user: data.user,
		emailConfirmationRequired: !data.session,
	};

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


export async function getCurrentUser() {
	const sessionResult = await supabase.auth.getSession();
	if (sessionResult.error || !sessionResult.data.session) {
		return null;
	}

	const userResult = await supabase.auth.getUser();
	if (userResult.error || !userResult.data.user) {
		return null;
	}

	return userResult.data.user;
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
