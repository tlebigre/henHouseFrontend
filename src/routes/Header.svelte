<script lang="ts">
	import './styles.css';
	import { _, locale, locales } from 'svelte-i18n';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { ComboBox } from 'carbon-components-svelte';
	import henLogo from '$lib/images/hen.svg';
	import cameraLogo from '$lib/images/camera.svg';
	import { language } from '../store.js';

	export let pageName: string;

	const items = $locales.map((l: string, i: number) => {
		return { id: i, text: l };
	});
	let langId: number = items.find((item) => item.text === $language)?.id ?? 0;
	const formatSelected = (id: number) => items.find((item) => item.id === id)?.text ?? '';

	$: $locale = formatSelected(langId);
	$: language.set(formatSelected(langId));
</script>

<header>
	<ComboBox bind:selectedId={langId} {items} let:item width="20px!important">
		<div>
			<strong>{item.text}</strong>
			<img width="16px" height="16px" src="{item.text}.png" alt="Lang" />
		</div>
	</ComboBox>

	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li aria-current={page.url.pathname === '/' ? 'page' : undefined}>
				<a href={resolve('/')}>{$_('henHouseTitle')}</a>
			</li>
			<li aria-current={page.url.pathname === '/camera' ? 'page' : undefined}>
				<a href={resolve('/camera')}>{$_('camera')}</a>
			</li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner">
		<img
			src={pageName === $_('henHouseTitle') ? henLogo : cameraLogo}
			alt={pageName === $_('henHouseTitle') ? $_('henHouseTitle') : $_('camera')}
		/>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	.corner {
		width: 4em;
		height: 4em;
	}

	.corner img {
		width: 3em;
		height: 3em;
		object-fit: contain;
	}

	svg {
		width: 2.65em;
		height: 4em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 4em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}
</style>
