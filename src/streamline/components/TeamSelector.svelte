<script>
    import { seasonStore, userStore, MY_TEAM } from '@src/stores';
    import { get } from 'svelte/store';
    import SelectButtons from '@shared/components/SelectButtons.svelte';
    import ScrollBox from '@shared/components/ScrollBox.svelte';
    import { loadData } from '@data/LoadData';
    import { viewStore } from '@src/stores';
    import Meets from './meets/Meets.svelte';

    // Synchronously get the initial values of the stores
    let season = get(seasonStore);
    let selectedTeam = get(MY_TEAM);
    let user = get(userStore);

    // Reactive declarations to update the values when the stores change
    $: season = $seasonStore;
    $: selectedTeam = $MY_TEAM;

    // Add loading state
    let isLoading = false;

    async function selectTeam(team) {
        isLoading = true;
        
        // Update stores first
        user.updateTeam(team);
        
        // Then load data
        console.log('Loading data for team:', team.abbr);
        await loadData(user);
        viewStore.set({name: 'Meets', component: Meets, props: {meet: null}});
        isLoading = false;
    }
    // You can also manipulate displayedData here if needed
</script>

<!-- Display the manipulated roster data -->
<ScrollBox>
    <div class="divisions">
        {#each season.divisions as division}
            <div class="division">
                <h3>Division {division.name}</h3>
                <SelectButtons
                    options = {division.teams}
                    selected = {selectedTeam}
                    select = {selectTeam}
                    text = {(team) => team.name}
                />
            </div>
        {/each}
    </div>
</ScrollBox>

<style>
    .divisions {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.75rem;
        padding: 1rem;
        justify-content: center;
    }

    .division {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 0.5rem;
        width: 6rem;
        font-size: 0.75rem;
    }

    h3 {
        margin: 0;
        font-size: 1rem;
        text-align: center;
    }
</style>