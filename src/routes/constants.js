import { browser } from '$app/environment';

export const host = browser ? window.location.hostname : 'localhost';
