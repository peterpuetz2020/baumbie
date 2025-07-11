<script lang="ts">
	import { onMount } from 'svelte';

	interface EmojiParticle {
		id: number;
		emoji: string;
		left: number;
		delay: number;
		duration: number;
		scale: number;
		direction: 'left' | 'right';
	}

	const PARTICLE_EMOJIS = ['💦', '🌱', '🍃'];

	let showBigDrop = false;
	let showParticles = false;
	let showTree = false;
	let showText = false;
	let emojiRain: EmojiParticle[] = [];

	onMount(() => {
		// PHASE 1: Tropfen fällt
		showBigDrop = true;

		setTimeout(() => {
			showBigDrop = false;

			// PHASE 2: Sickereffekt
			startEmojiRain();
			showParticles = true;

			// Nach Sickern → PHASE 3
			setTimeout(() => {
				showParticles = false;
				showTree = true;
				showText = true;
			}, 5500);
		}, 1000);
	});

	function startEmojiRain() {
		emojiRain = Array.from({ length: 30 }, (_, i) => ({
			id: i,
			emoji: PARTICLE_EMOJIS[Math.floor(Math.random() * PARTICLE_EMOJIS.length)],
			left: Math.random() * 100,
			delay: Math.random() * 1.5,
			duration: 4 + Math.random() * 1.5,
			scale: 0.6 + Math.random() * 0.5,
			direction: Math.random() < 0.5 ? 'left' : 'right'
		}));
	}
</script>

<div class="container">
	{#if showBigDrop}
		<div class="drop">💧</div>
	{/if}

	{#if showParticles}
		{#each emojiRain as drop (drop.id)}
			<div
				class="emoji-particle {drop.direction}"
				style="
					left: {drop.left}%;
					animation-delay: {drop.delay}s;
					animation-duration: {drop.duration}s;
					transform: scale({drop.scale});
				"
			>
				{drop.emoji}
			</div>
		{/each}
	{/if}

	{#if showTree}
		<div class="tree">🌳</div>
	{/if}

	{#if showText}
		<div class="success-text">Gießung erfolgreich abgespeichert</div>
	{/if}
</div>

<style>
	.container {
		position: relative;
		height: 240px;
		text-align: center;
		overflow: hidden;
	}

	/* 💧 Phase 1: Großer Tropfen */
	.drop {
		font-size: 2.5rem;
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		animation: dropThrough 1s ease-in forwards;
		z-index: 5;
	}

	@keyframes dropThrough {
		0% {
			transform: translate(-50%, -80px);
			opacity: 0;
		}
		30% {
			opacity: 1;
		}
		100% {
			transform: translate(-50%, 200px);
			opacity: 0;
		}
	}

	/* 🌱 Phase 2: Sickereffekt (sanft & länger) */
	.emoji-particle {
		position: absolute;
		top: 40%;
		font-size: 1.2rem;
		opacity: 0;
		animation-timing-function: ease-in-out;
		animation-fill-mode: forwards;
		pointer-events: none;
		z-index: 3;
	}

	.emoji-particle.left {
		animation-name: fallAndFadeLeft;
	}

	.emoji-particle.right {
		animation-name: fallAndFadeRight;
	}

	@keyframes fallAndFadeLeft {
		0% {
			transform: translateY(0) translateX(0) rotate(0deg);
			opacity: 0;
		}
		10% {
			opacity: 0.3;
		}
		30% {
			opacity: 0.8;
		}
		60% {
			opacity: 1;
		}
		90% {
			opacity: 0.7;
		}
		100% {
			transform: translateY(200px) translateX(-20px) rotate(-15deg);
			opacity: 0;
		}
	}

	@keyframes fallAndFadeRight {
		0% {
			transform: translateY(0) translateX(0) rotate(0deg);
			opacity: 0;
		}
		10% {
			opacity: 0.3;
		}
		30% {
			opacity: 0.8;
		}
		60% {
			opacity: 1;
		}
		90% {
			opacity: 0.7;
		}
		100% {
			transform: translateY(200px) translateX(20px) rotate(15deg);
			opacity: 0;
		}
	}

	/* 🌳 Phase 3: Pulsierender Baum */
	.tree {
		font-size: 3rem;
		margin-top: 40px;
		animation: pulse 1.4s ease-in-out infinite;
		z-index: 4;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1.2);
			opacity: 0.8;
		}
	}

	/* 📄 Phase 3: Erfolgstext */
	.success-text {
		margin-top: 1rem;
		font-size: 1.1rem;
		opacity: 0;
		animation: fadeIn 0.6s ease-in forwards;
		animation-delay: 0.2s;
		z-index: 4;
	}

	@keyframes fadeIn {
		to {
			opacity: 1;
		}
	}
</style>
