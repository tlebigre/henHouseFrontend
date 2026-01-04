<script lang="ts">
	import type { SimpleCamera } from '../../types/SimpleCamera.type.js';
	export let camera: SimpleCamera;
</script>

<img alt={camera.name} src={camera.url} />

<style>
	img {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
