<script>
    import { loadParseObjectById } from '@data/LoadParseObjects';
    import { onMount } from 'svelte';
    import SwimmerProgress from '@streamline/Coms/SwimmerProgress.svelte';
    import { meetConfirmationStore } from './stores';
    let loaded = false;
    let swimmerKey = '';
    let meetCon = null;

    onMount(async () => {
        console.log('Meet Confirmation Page Mounted');
        const urlParams = new URLSearchParams(window.location.search);
        const meetConId = urlParams.get('i');
        meetCon = await loadParseObjectById('MeetConfirmation', meetConId);
        console.log('Meet confirmation loaded:', meetCon);
        loaded = true;
    });

</script>

<div class="coms-page-container">
    {#if !loaded}
        <p>Loading swimmer progress...</p>
        <p>Progreso de nadador(a) cargando...</p>
    {:else}
        <SwimmerProgress
            nombre = {meetCon.nombre}
            preferredName = {meetCon.preferredName}
            apellido = {meetCon.apellido}
            age = {meetCon.age}
            teamId = {meetCon.teamId}
        />
    {/if}
</div>

<style>
    .coms-page-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
    }
</style>