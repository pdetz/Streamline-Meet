<script>
    import { checkCurrentUser, createUsers } from "@data/ACL";
    import { loadParseObjects } from "@data/LoadParseObjects";
    import ScrollBox from "@shared/components/ScrollBox.svelte";
    import SelectButtons from "@shared/components/SelectButtons.svelte";
    import Settings from "./Settings/Settings.svelte";
    import { userStore, MY_TEAM, viewStore } from "@src/stores";
    import { loadData } from "@data/LoadData";

    $: league = $userStore?.league || null;
    $: season = $userStore?.season || null;
    $: selectedTeam = $MY_TEAM || null;
    $: selectedCoach = $userStore?.selectedCoach || null; // Get selected coach from the store
    $: leagueTeams = $userStore?.leagueTeams || []; // Get teams from the league object

    async function selectTeam(team) {
        $userStore.team = team; // Update the user object with the selected team
        let vs = $viewStore;
        await loadData($userStore); // Load data for the user with the selected team
        viewStore.set(vs);
    }

    async function newCoach() {
        try {
            selectedCoach = await createUsers(selectedTeam.objectId);
        }
        catch (error) {
            console.error("Error creating new coach:", error);
            selectedCoach = null; // Reset selectedCoach on error
        }
    }

</script>

<div class='team-management'>
    <ScrollBox width='11em' height='100%'>
        <div class='sidebar'>
            <SelectButtons
                options={leagueTeams}
                selected={selectedTeam}
                select={selectTeam}
                text={(team) => team.name}
            />
        </div>
    </ScrollBox>
    <div class='content'>
        {league.name}
        {season.year}
        {#if selectedTeam}
            {#if selectedCoach}
                <Settings user={selectedCoach} admin={true} /> 
            {:else}
                <button class='sb' on:click={newCoach}>Create New Coach</button>
            {/if}
        {:else}
            <p>Please select a team from the sidebar.</p>
        {/if}
</div>
</div>

<style>
    .team-management {
        display: flex;
        flex-direction: row;
        height: 100%;
    }

    .sidebar {
        width: 10em;
        height: 100%;
        background-color: var(--bg-color-1);
        padding: 0.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
  }

    .content {
        width: calc(100% - 10em);
        padding: 1rem;
        height: 100%;
    }
</style>