import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	envDir: '..',
	resolve: {
		alias: {
			$api: path.resolve(__dirname, 'src/api'),
			$components: path.resolve(__dirname, 'src/components'),
			$features: path.resolve(__dirname, 'src/features'),
			$types: path.resolve(__dirname, 'src/types')
		}
	}
});
