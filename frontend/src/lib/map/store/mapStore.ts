import { writable } from 'svelte/store';
import type L from 'leaflet';

export const mapStore = writable<L.Map | null>(null);