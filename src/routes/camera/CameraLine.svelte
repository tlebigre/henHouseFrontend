<script lang="ts">
	import '../styles.css';
	import 'carbon-components-svelte/css/white.css';
	import { _ } from 'svelte-i18n';
	import { Button, Modal, TextInput } from 'carbon-components-svelte';
	import { TrashCan, FitToScreen, Edit } from 'carbon-icons-svelte';
	import FullScreenCamera from './FullScreenCamera.svelte';
	import type { Camera } from '../../types/Camera.type.js';

	export let onDelete: (id: number) => void;
	export let onEdit: (camera: Camera) => void;

	export let camera: Camera;

	let cameraEdition: Camera = camera;
	let fullScreenCam = false;
	let deleteCam = false;
	let modifyCam = false;
</script>

<div>
	<div class="cameraFlex">
		<img alt={camera.name} src={camera.url} height="108px" width="192px" />
	</div>
	<div class="buttonsFlex">
		<Button size="field" icon={FitToScreen} on:click={() => (fullScreenCam = true)}
			>{$_('fullScreen')}
		</Button>
		<Button
			size="field"
			kind="secondary"
			icon={Edit}
			on:click={() => {
				cameraEdition = structuredClone(camera);
				modifyCam = true;
			}}
			>{$_('modify')}
		</Button>
		<Button size="field" icon={TrashCan} kind="danger-tertiary" on:click={() => (deleteCam = true)}
			>{$_('delete')}
		</Button>
	</div>
</div>

<Modal bind:open={fullScreenCam} size="lg" passiveModal modalHeading={camera.name}>
	<FullScreenCamera camera={{ name: camera.name, url: camera.url }} />
</Modal>

<Modal
	danger
	bind:open={deleteCam}
	modalHeading="{$_('delete')} {camera.name}"
	primaryButtonText={$_('delete')}
	secondaryButtonText={$_('cancel')}
	on:click:button--primary={() => {
		deleteCam = false;
		onDelete(camera.id);
	}}
	on:click:button--secondary={() => (deleteCam = false)}
>
	<p>{$_('deleteCamera')}</p>
</Modal>

<Modal
	bind:open={modifyCam}
	modalHeading={$_('modifyCamera')}
	primaryButtonText={$_('confirm')}
	secondaryButtonText={$_('cancel')}
	selectorPrimaryFocus="#camName"
	on:click:button--primary={() => {
		modifyCam = false;
		onEdit(cameraEdition);
	}}
	on:click:button--secondary={() => (modifyCam = false)}
>
	<TextInput
		id="camName"
		labelText={$_('cameraName')}
		placeholder={$_('enterCameraName')}
		bind:value={cameraEdition.name}
	/>
	<br />
	<TextInput
		labelText={$_('cameraUrl')}
		placeholder={$_('enterCameraUrl')}
		bind:value={cameraEdition.url}
	/>
</Modal>

<style>
	.cameraFlex {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.buttonsFlex {
		display: flex;
		flex-wrap: wrap;
		font-size: 30px;
		text-align: center;
		justify-content: center;
		gap: 10px;
	}
</style>
