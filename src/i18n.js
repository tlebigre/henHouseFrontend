import { addMessages, init, getLocaleFromNavigator } from 'svelte-i18n';

import en from './i18n/en.json' with { type: 'json' };
import fr from './i18n/fr.json' with { type: 'json' };

addMessages('en', en);
addMessages('fr', fr);

init({
  fallbackLocale: 'fr',
  initialLocale: getLocaleFromNavigator(),
});