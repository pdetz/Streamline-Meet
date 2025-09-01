<script>
  import { onMount } from 'svelte';
  import { selectedMeetStore, MY_DIVISION, MY_TEAM, meetViewStore } from '@src/stores';

  import ScrollBox from '@shared/components/ScrollBox.svelte';
  import MeetTable from './meetTable/MeetTable.svelte';
  import MeetSidebar from './MeetSidebar.svelte';
  import TeamsPoints from './TeamsPoints.svelte';
  import MeetMenu from './MeetMenu.svelte';
  import MeetNav from './MeetNav.svelte';
  import MeetViewComponent from './MeetViewComponent.svelte';

  $: selectedMeet = $selectedMeetStore;
  $: MyDivision = $MY_DIVISION;
  $: MyTeam = $MY_TEAM;

  let teamOrDivision = null;
  let meets = [];

  $: viewType = $meetViewStore.viewType || null;;

  onMount(() => {
    teamOrDivision = MyTeam || MyDivision;
    meets = teamOrDivision ? teamOrDivision.meets || [] : [];
  });

  function selectTeamOrDivision(tOrD) {
    teamOrDivision = tOrD;
    meets = tOrD.meets || [];
  }
</script>

<div class="container">
  <div class="meet-sidebar-scrollbox">
  <ScrollBox width="13rem" cssClass="meet-sidebar-scrollbox">
    <MeetSidebar
      {selectTeamOrDivision}
      {teamOrDivision}
      {meets}
    />
  </ScrollBox>
  </div>
  
  <div class="main-content">
    {#if selectedMeet}
      
      {#if selectedMeet.view === 'meetNav'}
        <p><b>{selectedMeet.name}</b></p>

        <MeetNav meet={selectedMeet} />
      {:else}
        <p><b>{selectedMeet.name}</b>
          <TeamsPoints meet={selectedMeet} viewType={selectedMeet.getDefaultView()}/>
        </p>
        <MeetMenu meet={selectedMeet} />
          
        {#if viewType}
          <div class="meet content-box">
            <MeetViewComponent />
          </div>
        {/if}
      {/if}

    {:else}
      <ScrollBox>
        <MeetTable {meets} {teamOrDivision}/>
      </ScrollBox>
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