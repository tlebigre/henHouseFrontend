import { register, init, getLocaleFromNavigator, locale } from 'svelte-i18n';

register('fr', () => import('./fr.json'));
register('en', () => import('./en.json'));

init({
	fallbackLocale: 'fr',
	initialLocale: 'fr'
});

const navLocale = getLocaleFromNavigator();
if (navLocale === 'en' || navLocale === 'fr') {
	locale.set(navLocale);
}