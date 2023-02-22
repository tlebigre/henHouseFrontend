<script lang="ts">
    export let camera : import("../../types/SimpleCamera.type").SimpleCamera
</script>

<img alt="{camera.name}" src="{camera.url}"/>

<style>
    img{
        display:block;
        width:100%; 
        height:100%;
    }
</style>