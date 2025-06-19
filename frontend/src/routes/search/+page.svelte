<script lang="ts">
	import Card from '$components/card/Card.svelte';
	import Heading from '$components/typography/Heading.svelte';
	import { Button, LinkButton } from '$components/button';
</script>

<Card title={'search'} open={true}>
	<Heading level={1}>Bäume filtern</Heading>
	<div>Standort filtern</div>
	<div>Nach Alter filtern</div>
	<div>Nach Wasserbedarf filtern</div>
	<div>
		Button Testing
		<Heading level={2}>Deine adoptierten Bäume</Heading>
		<LinkButton href="/login">Link</LinkButton>
		<Button>
			label <img src={'/icons/tree.svg'} alt={'Baum'} />
		</Button>
		<Button variant="primary">primary</Button>
		<Button variant="secondary">secondary</Button>
	</div>
</Card>
