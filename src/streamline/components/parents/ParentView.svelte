<script>
    export let swimmer;
    import SwimmerMeetView from "./SwimmerMeetView.svelte";
</script>

<div>
    {#if swimmer}
        <div class="swimmer">{swimmer.nombre} {swimmer.apellido}</div>
        {#each swimmer.team.meets as meet}
            <div><SwimmerMeetView {swimmer} {meet}/></div>
        {/each}
    {:else}
        <div>No swimmer selected</div>
    {/if}
</div>

<style>
    .swimmer {
        color: #fff;
        width: 100%;
        text-align: center;
    }
</style>
