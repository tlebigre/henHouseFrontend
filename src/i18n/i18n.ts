import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

register('fr', () => import('./fr.json'));
register('en', () => import('./en.json'));

init({
	fallbackLocale: 'fr',
	initialLocale: getLocaleFromNavigator() ?? 'fr'
});
