<script lang="ts">
	import '../i18n';
	import './styles.css';
	import 'carbon-components-svelte/css/white.css';
	import { _ } from 'svelte-i18n';
	import { host } from './constants';
	import { onMount } from 'svelte';
	import { NotificationDisplay, notifier } from '@beyonk/svelte-notifications';
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
	import ArrowUp from 'carbon-icons-svelte/lib/ArrowUp.svelte';
	import ArrowDown from 'carbon-icons-svelte/lib/ArrowDown.svelte';
	import Save from 'carbon-icons-svelte/lib/Save.svelte';
	import Edit from 'carbon-icons-svelte/lib/Edit.svelte';
	import Header from './Header.svelte';
	import type { HenHouse } from '../types/HenHouse.type';

	let henHouse: HenHouse;
	let isEditState = false;
	let isEditDate = false;
	let isEditTime = false;
	let bindDate = "";

	onMount(async () => {
		await fetch('http://' + host + ':8080/henHouse/henHouse')
			.then((r) => r.json())
			.then((data) => henHouse = data);
	});

	onMount(async () => {
		async function fetchState() {
			if (!isEditState)
				await fetch('http://' + host + ':8080/henHouse/state')
					.then((r) => r.json())
					.then((data) => {
						henHouse.state = data.state;
					});

			await fetch('http://' + host + ':8080/henHouse/dateTime')
				.then((r) => r.json())
				.then((data) => {
					if (!isEditDate) bindDate = data.date;
					if (!isEditTime) henHouse.time = data.time;
				});
		}

		const interval = setInterval(fetchState, 2000);
		return () => clearInterval(interval);
	});

	async function doSave() {
		henHouse.date = bindDate;
		const response = await fetch('http://' + host + ':8080/henHouse/henHouse', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(henHouse)
		});

		if (response.ok) {
			notifier.success($_('saveSucess'), 2000);
			isEditDate = false;
			isEditTime = false;
			isEditState = false;
		} else notifier.danger($_('saveError'), 2000);
	}

	async function doOpen() {
		await fetch('http://' + host + ':8080/henHouse/open');
	}

	async function doClose() {
		await fetch('http://' + host + ':8080/henHouse/close');
	}
</script>

<NotificationDisplay />

<svelte:head>
	<title>{$_('henHouse')}</title>
	<meta name="description" content="Henhouse" />
</svelte:head>

<Header pageName={$_('henHouseTitle')} />

<h1>{$_('henHouse')}</h1>

<div>
	{#if henHouse}
		<div class="henHouseFlex">
			<div class="henHouseFlexLeft henHouseGrid">
				<div class="label">{$_('bottomLimit')}</div>
				<NumberInput bind:value={henHouse.bottomLimit} style="min-width: 13rem;" />
				<div class="label">{$_('topLimit')}</div>
				<NumberInput bind:value={henHouse.topLimit} style="min-width: 13rem;" />
				<div class="henHouseInline">
					<div class="label">{$_('state')}</div>
					<Button
						iconDescription={$_('edit')}
						on:click={() => (isEditState = !isEditState)}
						icon={Edit}
						style="padding: 0px; min-height: 1px;  {isEditState
							? 'background-color: #198038;'
							: ''}"
					/>
				</div>
				<NumberInput
					on:click={() => (isEditState = true)}
					bind:value={henHouse.state}
					style="min-width: 13rem;"
				/>
				<div class="label">{$_('stopEngine')}</div>
				<Toggle labelA={$_('no')} labelB={$_('yes')} bind:toggled={henHouse.stopEngine} />
				<div class="label">{$_('stopLimits')}</div>
				<Toggle labelA={$_('no')} labelB={$_('yes')} bind:toggled={henHouse.stopLimits} />
				<div class="label">{$_('getUpMorning')}</div>
				<Toggle labelA={$_('no')} labelB={$_('yes')} bind:toggled={henHouse.getUpMorning} />
			</div>
			<div class="henHouseFlexRight henHouseGrid">
				<div class="label">{$_('speed')}</div>
				<Slider min={0} max={5} bind:value={henHouse.speed} />
				<div class="henHouseInline">
					<div class="label">{$_('date')}</div>
					<Button
						iconDescription={$_('edit')}
						on:click={() => (isEditDate = !isEditDate)}
						icon={Edit}
						style="padding: 0px; min-height: 1px;  {isEditDate ? 'background-color: #198038;' : ''}"
					/>
				</div>
				<DatePicker
					on:click={() => (isEditDate = true)}
					datePickerType="single"
					bind:value={bindDate}
					dateFormat="d/m/Y"
					on:change
				>
					<DatePickerInput placeholder="" />
				</DatePicker>
				<div class="henHouseInline">
					<div class="label">{$_('time')}</div>
					<Button
						iconDescription={$_('edit')}
						on:click={() => (isEditTime = !isEditTime)}
						icon={Edit}
						style="padding: 0px; min-height: 1px;  {isEditTime ? 'background-color: #198038;' : ''}"
					/>
				</div>
				<TimePicker on:click={() => (isEditTime = true)} bind:value={henHouse.time} />
				<div class="label">{$_('hourOpening')}</div>
				<TimePicker bind:value={henHouse.hourOpening} />
				<div class="label">{$_('hourOpeningMax')}</div>
				<TimePicker bind:value={henHouse.hourOpeningMax} />
			</div>
		</div>
		<div class="buttonsFlex">
			<Button size="field" on:click={doSave} iconDescription={$_('save')} icon={Save}
				>{$_('save')}
			</Button>
			<Button size="field" on:click={doOpen} iconDescription={$_('open')} icon={ArrowUp}
				>{$_('open')}
			</Button>
			<Button size="field" on:click={doClose} iconDescription={$_('close')} icon={ArrowDown}
				>{$_('close')}
			</Button>
		</div>
	{:else}
		<ProgressBar helperText={$_('loading')} />
	{/if}
</div>

<style>
	* {
		box-sizing: border-box;
	}

	.henHouseFlex {
		display: flex;
		flex-wrap: wrap;
		font-size: 30px;
		text-align: center;
	}

	.buttonsFlex {
		display: flex;
		flex-wrap: wrap;
		font-size: 30px;
		text-align: center;
		justify-content: center;
		gap: 10px;
	}

	.henHouseFlexLeft {
		padding: 10px;
		flex: 50%;
	}

	.label {
		padding-top: 15px;
		padding-right: 10px;
	}

	.henHouseGrid {
		display: grid;
		text-align: end;
		font-size: 0.5em;
		grid-template-columns: 2fr 1fr;
	}

	.henHouseFlexRight {
		padding: 10px;
		flex: 50%;
	}

	.henHouseInline {
		display: grid;
		grid-template-columns: 1fr auto;
	}

	@media (max-width: 800px) {
		.henHouseFlexRight,
		.henHouseFlexLeft {
			flex: 100%;
		}
	}
</style>
