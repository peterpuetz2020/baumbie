import { createClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;
const missingConfigMessage =
	'Supabase-Konfiguration fehlt: Bitte setze VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY.';

function createSupabaseClient(): SupabaseClient {
	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
	const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		if (import.meta.env.DEV) {
			console.error(missingConfigMessage);
		}

		throw new Error(missingConfigMessage);
	}

	return createClient(supabaseUrl, supabaseAnonKey);
}

function getClient(): SupabaseClient {
	if (!cachedClient) {
		cachedClient = createSupabaseClient();
	}

	return cachedClient;
}

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
	get(_target, property, receiver) {
		const instance = getClient();
		const value = Reflect.get(instance, property, receiver);

		return typeof value === 'function' ? value.bind(instance) : value;
	}
});

export function ensureSupabaseClient(): SupabaseClient {
	return getClient();
}