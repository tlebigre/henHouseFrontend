<script lang="ts">
	import '../styles.css';
	import '../../i18n';
	import 'carbon-components-svelte/css/white.css';
	import { _ } from 'svelte-i18n';
	import { onMount, type SvelteComponent } from 'svelte';
	import { Button, Modal, TextInput } from 'carbon-components-svelte';
	import {
		NotificationDisplay as NotificationDisplayRaw,
		notifier
	} from '@beyonk/svelte-notifications';
	import { host } from '../constants.js';
	import { Add } from 'carbon-icons-svelte';
	import Header from '../Header.svelte';
	import CameraLine from './CameraLine.svelte';
	import type { Camera } from '../../types/Camera.type.js';
	import type { SimpleCamera } from '../../types/SimpleCamera.type.js';

	// Cast the raw import to a type TypeScript understands
	const NotificationDisplay = NotificationDisplayRaw as never as typeof SvelteComponent;

	let cameraSave: SimpleCamera = { name: '', url: '' };
	let open = false;
	let cameraList: Camera[] = [];

	onMount(() => reloadCameraList());

	/* ===========================
	 * API
	 * =========================== */
	const API_BASE = `http://${host}:8085`;

	async function reloadCameraList() {
		await fetch(`${API_BASE}/camera/all`)
			.then((r) => r.json())
			.then((data) => (cameraList = data));
	}

	async function addCamera() {
		const response = await fetch(`${API_BASE}/camera`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(cameraSave)
		});
		notifierResponse(response, $_('saveSuccess'), $_('saveError'));
		resetCameraForm();
		await reloadCameraList();
	}

	async function editCamera(camera: Camera) {
		const response = await fetch(`${API_BASE}/camera`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(camera)
		});
		notifierResponse(response, $_('editSucess'), $_('editError'));
		resetCameraForm();
		await reloadCameraList();
	}

	async function deleteCamera(id: number) {
		const response = await fetch(`${API_BASE}/camera/${id}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' }
		});
		notifierResponse(response, $_('deleteSucess'), $_('deleteError'));
		await reloadCameraList();
	}

	function notifierResponse(response: Response, success: string, fail: string) {
		if (response.ok) {
			reloadCameraList();
			notifier.success(success, 2000);
		} else {
			notifier.danger(fail, 2000);
		}
	}

	function resetCameraForm() {
		cameraSave = { name: '', url: '' };
	}
</script>

<svelte:head>
	<title>{$_('camera')}</title>
	<meta name="description" content="Camera" />
</svelte:head>

<Header pageName={$_('camera')} />

<h1>{$_('camera')}</h1>

<Button class="add-button" icon={Add} on:click={() => (open = true)}>{$_('add')}</Button>

<Modal
	bind:open
	modalHeading={$_('addCamera')}
	primaryButtonText={$_('confirm')}
	secondaryButtonText={$_('cancel')}
	selectorPrimaryFocus="#camName"
	on:click:button--primary={() => {
		open = false;
		addCamera();
	}}
	on:click:button--secondary={() => (open = false)}
>
	<TextInput
		id="camName"
		labelText={$_('cameraName')}
		placeholder={$_('enterCameraName')}
		bind:value={cameraSave.name}
	/>
	<br />
	<TextInput
		labelText={$_('cameraUrl')}
		placeholder={$_('enterCameraUrl')}
		bind:value={cameraSave.url}
	/>
</Modal>

<NotificationDisplay />

<div class="rowFlex">
	{#if cameraList.length === 0}
		<p class="empty">{$_('noCamera')}</p>
	{:else}
		{#each cameraList as cam (cam.id)}
			<CameraLine camera={cam} onEdit={editCamera} onDelete={deleteCamera} />
		{/each}
	{/if}
</div>

<style>
	* {
		box-sizing: border-box;
	}

	:global(.add-button) {
		margin: 10px 0 20px 20px;
	}

	.rowFlex {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 30px;
		padding: 0 20px;
	}
</style>
