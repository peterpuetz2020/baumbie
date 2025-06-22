import { supabase } from "./client";


export async function getCurrentUser(): Promise<{ email?: string } | null> {
	const { data, error } = await supabase.auth.getUser();
	if (error) {
		console.warn('getCurrentUser() failed:', error.message);
		return null;
	}
	return data.user ?? null;
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
