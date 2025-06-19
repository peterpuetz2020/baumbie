<script lang="ts">
	import { onMount } from 'svelte';
	import EmailField from '../../components/input/EmailField.svelte';
	import PasswordField from '../../components/input/PasswordField.svelte';
	import { supabase } from '../../supabase';
	import { goto } from '$app/navigation';
	import { Button } from '$components/button';

	let email: string = '';
	let password: string = '';
	let errorCode: string | undefined = undefined;
	$: email, password, errorCode;

	let loading: boolean = false;

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, session) => {
			if (event === 'INITIAL_SESSION') {
				// handle initial session
			} else if (event === 'SIGNED_IN') {
				// handle sign in event
			} else if (event === 'SIGNED_OUT') {
				// handle sign out event
			} else if (event === 'PASSWORD_RECOVERY') {
				// handle password recovery event
			} else if (event === 'TOKEN_REFRESHED') {
				// handle token refreshed event
			} else if (event === 'USER_UPDATED') {
				// handle user updated event
			}
		});

		// call unsubscribe to remove the callback
		data.subscription.unsubscribe();
	});

	const handleLogin = async (e: any) => {
		e.preventDefault();

		loading = true;
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		if (!data?.user) {
			errorCode = 'Die Anmeldung mit diesen Zugangsdaten ist fehlgeschlagen!';
			return;
		}
		goto('/account');
	};
</script>

<form class="flex flex-col gap-y-4">
	<div class="flex flex-col gap-y-2">
		<EmailField
			id="email"
			label="E-Mail:"
			inputClass="w-full"
			placeholder="jdoe@example.com"
			error={errorCode}
			bind:value={email}
		/>
		<PasswordField
			id="password"
			label="Passwort:"
			inputClass="w-full"
			placeholder="Passwort"
			error={errorCode}
			bind:value={password}
		/>
	</div>
	<div class="flex flex-col gap-y-2">
		<Button variant="primary" type="submit" on:click={handleLogin} className="w-full"
			>Anmelden</Button
		>
		<Button variant="secondary" onClick={() => goto('/register')} className="w-full"
			>Registrieren</Button
		>
	</div>
</form>
