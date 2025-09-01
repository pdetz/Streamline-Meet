<script>
  import { seasonStore, MY_TEAM, meetViewStore, selectedMeetStore, updateMeetViewStore } from '@src/stores';

  import ScrollBox from '@shared/components/ScrollBox.svelte';
  import MeetTable from './meets/meetTable/MeetTable.svelte';
  import MeetSidebar from './meets/MeetSidebar.svelte';
  import TeamsPoints from './meets/TeamsPoints.svelte';
  import MeetMenu from './meets/MeetMenu.svelte';
  import MeetNav from './meets/MeetNav.svelte';
  import MeetViewComponent from './meets/MeetViewComponent.svelte';
    import SelectButtons from '@shared/components/SelectButtons.svelte';
    import Meet from '@models/Meet';
    import { loadDivision, loadTeam } from '@data/LoadData';

  $: season = $seasonStore;
  $: MyTeam = $MY_TEAM;

  $: teams = season ? season.teams.filter(t => t.abbr !== MyTeam.abbr) || [] : [];

  $: viewType = $meetViewStore.viewType || null;

  let selectedTeamInfo = null;
    let selectedTeam = null;
  let virtualMeet = null;
  let selectedDivision = null;
  let currentlyLoadingTeamId = null;

  $: if (selectedTeamInfo && season && selectedTeamInfo.objectId !== currentlyLoadingTeamId) {
    
    currentlyLoadingTeamId = selectedTeamInfo.objectId;
    if (virtualMeet) {
        virtualMeet.clear('planning');
    }

    (async () => { // Wrap the async call in an immediately invoked async function
      const divisionToLoad = season.divisionOfTeam(selectedTeamInfo);

      if (!divisionToLoad) {
        console.error('No division found for the selected team:', selectedTeamInfo);
        return;
      }

      selectedDivision = await loadDivision(divisionToLoad, season);
      console.log('Selected Division:', selectedDivision);
      
      selectedTeam = selectedDivision.getTeamById(selectedTeamInfo.objectId);
      console.log('Selected Team:', selectedTeam);

      virtualMeet = new Meet({
        name: MyTeam.name + ' at ' + selectedTeam.name + ' Virtual Meet',
        abbr: 'VM' + MyTeam.abbr + ' - ' + selectedTeam.abbr,
        view: 'planning',
        teamIds: [MyTeam.objectId, selectedTeam.objectId],
        teams: [MyTeam, selectedTeam],
        meetType: 'A',
        virtual: true
      });
        console.log('Virtual Meet:', virtualMeet);
        selectedMeetStore.set(virtualMeet);
        updateMeetViewStore(virtualMeet, 'planning');
    })();
  }

</script>

<div class="container">
  <div class="meet-sidebar-scrollbox">
  <ScrollBox width="13rem" cssClass="meet-sidebar-scrollbox">
    <div class="sidebar">
        <SelectButtons 
          options={teams} 
          selected={selectedTeamInfo} 
          select={(team) => selectedTeamInfo = team} 
          text={(team) => `${team.name}`}
          css='small'
        />
    </div>
  </ScrollBox>
  </div>
  
  <div class="main-content">

    {#if selectedTeam && virtualMeet}
      
      {#if virtualMeet.view === 'meetNav'}
        <p><b>{virtualMeet.name}</b></p>

        <MeetNav meet={virtualMeet} />
      {:else}
        <p><b>{virtualMeet.name}</b>
          <TeamsPoints meet={virtualMeet} viewType={virtualMeet.getDefaultView()}/>
        </p>
        <MeetMenu meet={virtualMeet} />
          
        {#if viewType}
          <div class="meet content-box">
            <MeetViewComponent />
          </div>
        {/if}
      {/if}
    {/if}

  </div>
</div>

<style>
  @media (max-width: 768px) { /* Adjust this breakpoint as needed */
    .meet-sidebar-scrollbox {
      display: none; /* Hide the sidebar */
    }

    /* You might also want to adjust the main-content padding or width here */
    .main-content {
      padding-left: 0; /* Remove padding if sidebar is hidden */
      width: 100%; /* Take full width */
    }
  }

    .sidebar {
        height: 100%;
        background-color: var(--bg-color-1);
        padding: 0.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
    }

  .container {
    display: flex;
    height: 100%;
  }
  
  div.meet {
    display: flex;
    flex-direction: row;
    height: calc(100% - 6rem);
    border: 1px solid var(--border-color);
  }

  .main-content {
    flex: 1;
    padding-left: 1rem;
    background-color: var(--bg-color-1);
    color: var(--text-color-1);
    overflow-y: hidden;
  }
</style>