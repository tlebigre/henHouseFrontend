<script lang="ts">
	import '$i18n/i18n';
	import { isLoading } from 'svelte-i18n'
</script>

{#if $isLoading}
	Please wait...
{:else}
	<slot />
{/if}