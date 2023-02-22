<script lang="ts">
	import '../styles.css';
	import '../../i18n';
	import 'carbon-components-svelte/css/white.css';
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { Button, Modal, TextInput } from 'carbon-components-svelte';
	import { NotificationDisplay, notifier } from '@beyonk/svelte-notifications';
	import { host } from '../constants';
	import Add from 'carbon-icons-svelte/lib/Add.svelte';
	import Header from '../Header.svelte';
	import CameraLine from './CameraLine.svelte';
	import type { Camera } from '../../types/Camera.type';
	import type { SimpleCamera } from '../../types/SimpleCamera.type';

	let cameraSave: SimpleCamera = { name: '', url: '' };
	let open = false;
	let cameraList: Camera[];

	onMount(() => reloadCameraList());

	async function reloadCameraList() {
		await fetch('http://' + host + ':8080/henHouse/getAllCamera')
			.then((r) => r.json())
			.then((data) => (cameraList = data));
	}

	async function addCamera() {
		const response = await fetch('http://' + host + ':8080/henHouse/saveCamera', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(cameraSave)
		});
		notifierResponse(response, $_('saveSucess'), $_('saveError'));
	}

	async function editCamera(event: CustomEvent<Camera>) {
		const response = await fetch('http://' + host + ':8080/henHouse/editCamera', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(event.detail)
		});
		notifierResponse(response, $_('editSucess'), $_('editError'));
	}

	async function deleteCamera(event: CustomEvent<number>) {
		const response = await fetch('http://' + host + ':8080/henHouse/removeCamera/' + event.detail, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' }
		});
		notifierResponse(response, $_('deleteSucess'), $_('deleteError'));
	}

	function notifierResponse(response: Response, success: string, fail: string) {
		if (response.ok) {
			reloadCameraList();
			notifier.success(success, 2000);
		} else notifier.danger(fail, 2000);
	}
</script>

<svelte:head>
	<title>{$_('camera')}</title>
	<meta name="description" content="Camera" />
</svelte:head>

<Header />

<h1>{$_('camera')}</h1>

<Button
	style="margin-bottom: 20px;margin-left: 20px;margin-top: 10px;"
	icon={Add}
	on:click={() => (open = true)}
	>{$_('add')}
</Button>

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
	{#each cameraList || [] as cam}
		<CameraLine on:edit={editCamera} on:delete={deleteCamera} camera={cam} />
	{/each}
</div>

<style>
	* {
		box-sizing: border-box;
	}

	.rowFlex {
		display: flex;
		flex-wrap: wrap;
		row-gap: 30px;
	}
</style>
