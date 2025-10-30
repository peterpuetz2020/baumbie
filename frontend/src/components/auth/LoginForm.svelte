<script lang="ts">
	import { goto } from '$app/navigation';
	import { loginWithEmailPassword } from '$lib/supabase';
	import { EmailField, PasswordField, Button, Notice } from '$components/ui';

	let email = '';
	let password = '';
	let errorMessage: string | null = null;

	const handleLogin = async (e: SubmitEvent) => {
		e.preventDefault();

		try {
			await loginWithEmailPassword(email, password);
			goto('/account');
		} catch (err) {
			if (err instanceof Error) {
				errorMessage = err.message;
			} else {
				errorMessage = 'Unbekannter Fehler beim Login.';
			}
			setTimeout(() => (errorMessage = null), 5000);
		}
	};
</script>

<form on:submit={handleLogin} class="flex flex-col gap-y-4">
    <div class="flex flex-col gap-y-2">
        <EmailField
        	id="email"
            label="E-Mail:"
            inputClass="w-full"
            placeholder="lebensbaum@baumbie.de"
            bind:value={email}
        />
    	<div class="flex flex-col gap-y-1">
        	<PasswordField
            	id="password"
            	label="Passwort:"
            	inputClass="w-full"
            	placeholder="Passwort"
            	bind:value={password}
        	/>
        	<p class="text-sm text-gray-600">
            	Passwort vergessen?
            	<a
                	href="/forgot-password"
                	class="underline text-green-600"
                	on:click|preventDefault={() => goto('/forgot-password')}
            	>
                	Hier zurücksetzen!
            	</a>
        	</p>
    	</div>
	</div>

	{#if errorMessage}
		<Notice tone="warning">{errorMessage}</Notice>
	{/if}

	<div class="flex flex-col gap-y-2">
		<Button variant="primary" type="submit" className="w-full">Anmelden</Button>
		<Button variant="secondary" type="button" onClick={() => goto('/register')} className="w-full">
			Registrieren
		</Button>
	</div>
</form>
