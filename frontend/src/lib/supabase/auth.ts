import { supabase } from './client';

export async function deleteCurrentUser(): Promise<{ error?: string }> {
	const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
	if (sessionError || !sessionData.session?.access_token) {
		return { error: 'Nicht eingeloggt oder Session abgelaufen' };
	}

	const accessToken = sessionData.session.access_token;

	const { error: deleteError } = await supabase.auth.admin.deleteUser(accessToken);
	return deleteError ? { error: deleteError.message } : {};
}