<script>
    import MeetConfirmation from '@streamline/Coms/MeetConfirmation.svelte';
    import { loadMeetConfirmations, meetConfirmationStore, meetStore } from './stores';

    import { onMount } from 'svelte';
    import AMeetConfirmationForm from '@streamline/Coms/AMeetConfirmationForm.svelte';
    let loaded = false;
    let meetConfirmations = [];

    onMount(async () => {
        console.log('Meet Confirmation Page Mounted');
        const urlParams = new URLSearchParams(window.location.search);
        const meetConIds = urlParams.get('i')?.split(',') || [];

        if (meetConIds.length > 0) {
            try {
                meetConfirmations = await loadMeetConfirmations(meetConIds);
                console.log('Meet confirmation loaded:', meetConfirmations);
                console.log('Meet loaded:', $meetStore);
                loaded = true;
            } catch (error) {
                console.error('Error fetching meet confirmation:', error);
            }
        } else {
            console.warn('No meetConId provided in the URL.');
        }
    });

    $: meetConfirmation = $meetConfirmationStore;
    $: meet = $meetStore;

</script>

<div class="coms-page-container">
    {#if !loaded}
        <p>Loading meet confirmation...</p>
    {:else}
        {#each meetConfirmations as meetConfirmation}
            <AMeetConfirmationForm
                meetConfirmation={meetConfirmation.meetConfirmation}
                meet={meetConfirmation.meet}
            />
        {/each}
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