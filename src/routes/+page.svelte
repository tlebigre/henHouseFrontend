<script lang="ts">
	import '../i18n';
	import './styles.css';
	import 'carbon-components-svelte/css/white.css';

	import { _ } from 'svelte-i18n';
	import { onMount, type SvelteComponent } from 'svelte';

	import {
		NumberInput,
		Toggle,
		TimePicker,
		DatePicker,
		DatePickerInput,
		Slider,
		ProgressBar,
		Button
	} from 'carbon-components-svelte';

	import { Settings, SettingsAdjust, Time, ArrowUp, ArrowDown, Save, Edit } from 'carbon-icons-svelte';
	import { NotificationDisplay as NotificationDisplayRaw, notifier } from '@beyonk/svelte-notifications';

	import Header from './Header.svelte';
	import type { HenHouse } from '../types/HenHouse.type.js';
	import { host } from './constants.js';

	// Cast the raw import to a type TypeScript understands
	const NotificationDisplay = NotificationDisplayRaw as never as typeof SvelteComponent;

	/* ===========================
	 * API
	 * =========================== */
	const API_BASE = `http://${host}:8085`;

	const api = {
		async getHenHouse(): Promise<HenHouse> {
			const response = await fetch(`${API_BASE}/henHouse/henHouse`);
			if (!response.ok) throw new Error();
			return response.json();
		},

		async getState() {
			const response = await fetch(`${API_BASE}/henHouse/state`);
			if (!response.ok) throw new Error();
			return response.json();
		},

		async getDateTime() {
			const response = await fetch(`${API_BASE}/henHouse/dateTime`);
			if (!response.ok) throw new Error();
			return response.json();
		},

		async saveHenHouse(body: HenHouse) {
			const response = await fetch(`${API_BASE}/henHouse/henHouse`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});
			if (!response.ok) throw new Error();
		},

		async post(url: string) {
			const response = await fetch(`${API_BASE}${url}`, { method: 'POST' });
			if (!response.ok) throw new Error();
		}
	};

	/* ===========================
	 * STATE
	 * =========================== */
	let henHouse: HenHouse | null = null;
	let originalHenHouse: HenHouse | null = null;

	let isEditState = false;
	let isEditDate = false;
	let isEditTime = false;

	let bindDate = '';

	$: isEditing = isEditState || isEditDate || isEditTime;
	$: hasChanges =
		henHouse && originalHenHouse
			? JSON.stringify(henHouse) !== JSON.stringify(originalHenHouse)
			: false;

	/* ===========================
	 * LIFECYCLE
	 * =========================== */
	onMount(() => {
		loadInitialData();
		const interval = setInterval(fetchLiveData, 2000);
		return () => clearInterval(interval);
	});

	async function loadInitialData() {
		try {
			henHouse = await api.getHenHouse();
			originalHenHouse = structuredClone(henHouse);
		} catch {
			notifier.danger($_('networkError'), 2000);
		}
	}

	async function fetchLiveData() {
		if (!henHouse || isEditing) return;

		try {
			const [state, dateTime] = await Promise.all([
				api.getState(),
				api.getDateTime()
			]);

			henHouse = {
				...henHouse,
				state: state.state,
				time: dateTime.time
			};

			bindDate = dateTime.date;
		} catch { /* empty */ }
	}

	/* ===========================
	 * ACTIONS
	 * =========================== */
	async function doSave() {
		if (!henHouse) return;

		try {
			const payload = { ...henHouse, date: bindDate };
			await api.saveHenHouse(payload);

			notifier.success($_('saveSuccess'), 2000);
			originalHenHouse = structuredClone(payload);

			isEditDate = false;
			isEditTime = false;
			isEditState = false;
		} catch {
			notifier.danger($_('saveError'), 2000);
		}
	}

	const doOpen = () =>
		postAction('/opening/open', 'opening');

	const doClose = () =>
		postAction('/opening/close', 'closure');

	async function postAction(url: string, successKey: string) {
		try {
			await api.post(url);
			notifier.success($_(successKey), 2000);
		} catch {
			notifier.danger($_('saveError'), 2000);
		}
	}
</script>

<NotificationDisplay />

<svelte:head>
	<title>{$_('henHouse')}</title>
	<meta name="description" content="Henhouse" />
</svelte:head>

<Header pageName={$_('henHouseTitle')} />

<h1>{$_('henHouse')}</h1>

{#if henHouse}
	<section class="card">
		<h2><Settings/>{$_('limitsAndState')}</h2>
		<div class="form-grid">
			<div class="label">{$_('bottomLimit')}</div>
			<NumberInput bind:value={henHouse.bottomLimit} />
		</div>

		<div class="form-grid">
			<div class="label">{$_('topLimit')}</div>
			<NumberInput bind:value={henHouse.topLimit} />
		</div>

		<div class="form-grid">
			<div class="label">{$_('state')}</div>
			<div class="field-with-action">
				<Button
					kind="tertiary"
					size="small"
					class={isEditState ? 'edit-active' : undefined}
					icon={Edit}
					iconDescription={$_('edit')}
					on:click={() => (isEditState = !isEditState)}
				/>
				<NumberInput
					bind:value={henHouse.state}
					disabled={!isEditState}
				/>
			</div>
		</div>
	</section>
	<section class="card">
		<h2><SettingsAdjust/>{$_('options')}</h2>
		<div class="form-grid">
			<div class="label">{$_('stopEngine')}</div>
			<Toggle bind:toggled={henHouse.stopEngine} labelA={$_('no')} labelB={$_('yes')} />
		</div>

		<div class="form-grid">
			<div class="label">{$_('stopLimits')}</div>
			<Toggle bind:toggled={henHouse.stopLimits} labelA={$_('no')} labelB={$_('yes')} />
		</div>

		<div class="form-grid">
			<div class="label">{$_('getUpMorning')}</div>
			<Toggle bind:toggled={henHouse.getUpMorning} labelA={$_('no')} labelB={$_('yes')} />
		</div>

		<div class="form-grid">
			<div class="label">{$_('speed')}</div>
			<Slider min={0} max={5} bind:value={henHouse.speed} />
		</div>
	</section>

	<section class="card">
		<h2><Time/> {$_('dateTime')}</h2>
		<div class="form-grid">
			<div class="label">{$_('date')}</div>
			<div class="field-with-action">
				<Button
					kind="tertiary"
					size="small"
					class={isEditDate ? 'edit-active' : undefined}
					icon={Edit}
					iconDescription={$_('edit')}
					on:click={() => (isEditDate = !isEditDate)}
				/>
				<DatePicker
					datePickerType="single"
					bind:value={bindDate}
					dateFormat="d/m/Y"
				>
					<DatePickerInput disabled={!isEditDate} />
				</DatePicker>
			</div>
		</div>

		<div class="form-grid">
			<div class="label">{$_('time')}</div>
			<div class="field-with-action">
				<Button
					kind="tertiary"
					size="small"
					class={isEditTime ? 'edit-active' : undefined}
					icon={Edit}
					iconDescription={$_('edit')}
					on:click={() => (isEditTime = !isEditTime)}
				/>
				<TimePicker bind:value={henHouse.time} disabled={!isEditTime} />
			</div>
		</div>

		<div class="form-grid">
			<div class="label">{$_('hourOpening')}</div>
			<TimePicker bind:value={henHouse.hourOpening} />
		</div>

		<div class="form-grid">
			<div class="label">{$_('hourOpeningMax')}</div>
			<TimePicker bind:value={henHouse.hourOpeningMax} />
		</div>
	</section>

	<div class="buttonsFlex">
		<Button icon={Save} disabled={!hasChanges} on:click={doSave}>
			{$_('save')}
		</Button>
		<Button icon={ArrowUp} on:click={doOpen}>{$_('open')}</Button>
		<Button icon={ArrowDown} on:click={doClose}>{$_('close')}</Button>
	</div>
{:else}
	<ProgressBar helperText={$_('loading')} />
{/if}

<style>
    :global(.edit-active) {
        background-color: #198038;
    }

    .buttonsFlex {
        display: flex;
        justify-content: center;
        gap: 10px;
    }

    .card {
        background: white;
        border-radius: 8px;
        padding: 1.25rem 3rem;
        box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        margin-bottom: 1.5rem;
    }

    .card h2 {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #161616;
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 0.75rem 1rem;
        align-items: center;
    }

    .field-with-action {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
</style>
