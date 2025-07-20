import { writable } from 'svelte/store';

export const dialogMinimized = writable(false);

export const minimizeDialog = () => dialogMinimized.set(true);
export const maximizeDialog = () => dialogMinimized.set(false);
export const toggleDialog = () => dialogMinimized.update(m => !m);
