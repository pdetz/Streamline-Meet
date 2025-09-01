<script>
  import exportContent from '@data/export/exportContent';
  import { updateMeetViewStore, pointsStore, MY_TEAM } from '@src/stores.js';
  import SelectButtons from '@shared/components/SelectButtons.svelte';
  import { fillEvents, clearEvents } from './planning/fillEvents';
    import UploadFilesButton from '../UploadFilesButton.svelte';
    import File from '@data/files/File';
    import Tile from '@shared/components/Tile.svelte';
  export let meet;
  $: myTeam = $MY_TEAM;

  // Document selection functionality
  let tables; // = ['planning', 'results'];
  let documents; // = ['Line Ups', 'Results', 'Entries', 'Heat Sheet'];

  let viewType;// = 'planning';
  let defaultView;
  let openModal = false;
  let fillOrClear = 'fill'; // 'fill' or 'clear'

  let planUpdated = false;
  let previousPoints = $pointsStore;
  $: if (previousPoints !== $pointsStore) {
    planUpdated = true;
    previousPoints = $pointsStore;
  }

  $: if (meet) {
    viewType = meet.view;
    defaultView = meet.getDefaultView();
  } 
  $: if (defaultView === 'planning') {
    tables = ['planning', 'Attendance'];
    documents = ['Line Ups', 'Entries', 'Entries Report', 'Participants'];
  } else if (defaultView === 'entries') {
    tables = ['entries', 'planning'];
    documents = ['Entries', 'Line Ups'];
  } else if (defaultView === 'results') {
    tables = ['results'];
    documents = ['Results'];
  }
  
  async function savePlans() {
    await meet.getMeetPlan().updatePlanningFile();
    await meet.getMeetPlan().updateSwimmerPlans();
    planUpdated = false;
  }
  
  async function handleExport() {
    exportContent([File.writeEntriesToFile(meet, [myTeam], 'planning', false)]);
    //exportContent(meet.getMeetPlan().planningFile);
  }

  async function downloadResults() {
    exportContent(meet.resultsFiles);
  }

  function updateView(view) {
    viewType = view;
    updateMeetViewStore(meet, view);
  }

  function allEvents(fOc) {
    fillOrClear = fOc;
    const eventFunction = fillOrClear === 'fill' ? fillEvents : clearEvents;
    if (openModal) {
      eventFunction(meet.events);
      openModal = false;
      return;
    }
    let eventsEntered = meet.events.some(event => event.planning.length > 0);
    if (eventsEntered) {
      openModal = true;
    } else {
      eventFunction(meet.events);
    }
  }

  function uploadEntries(file) {
    //const [file] = files;
    //  this.parseSwims(this.meetPlan.planningFile, 'planning', 'seed');
    meet.parseSwims([new File(file)], 'planning', 'seed');
    //console.log(file);
  }

</script>

{#if openModal}
<div class='confirm-modal'>
  <Tile>
    <div slot='title' class='title'>
      Fill Events?
    </div>
    <div class='inner-container'>
      <p>Are you sure you want to {fillOrClear} all events?</p>
      <div class='buttons'>
        <button class='sb yes' 
          on:click={()=>allEvents(fillOrClear)}>Yes</button>
        <button class='sb no' on:click={() => openModal = false}>No</button>
      </div>
  </Tile>
</div>
{/if}

<div class='meet-menu'>
  <button class='sb' on:click={()=>updateView('meetNav')}> Back</button>
  <SelectButtons
    options={tables}
    selected={viewType}
    select={updateView}
    text={(option) => option[0].toUpperCase() + option.slice(1)}
  />
  
  {#if defaultView === 'planning'}
      <button class="sb tool" on:click={()=>allEvents('fill')}>
        <span class="icon">🏊</span>
        <span class="text">Fill Meet</span>
      </button>
      <button class="sb tool" on:click={()=>allEvents('clear')}>
        <span class="icon">❌🏊</span>
        <span class="text">Clear Meet</span>
      </button>
      {#if !meet.virtual}
        {#if planUpdated}
          <button class="sb tool" on:click={savePlans}>
            ⬆️ Save Plans
          </button>
        {:else}
          <button class="sb tool" on:click={handleExport}>
            ⬇️ Download Entries
          </button>
        {/if}
      {/if}
      <UploadFilesButton multiple={false} onFilesSelected={uploadEntries}>
        Upload Entries
      </UploadFilesButton>
  {:else if defaultView === 'results'}
      <button class="sb tool" on:click={downloadResults}>
        ⬇️ Download Results
      </button>
  {/if}
  <button class='sb blank'>Documents: </button>
  <SelectButtons
    options={documents}
    selected={viewType}
    select={updateView}
    text={(d) => d}
  />
</div>

<style>
  div.confirm-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  button.sb.yes {
    background-color: #0f4;
    color: #000;
  }
  button.sb.no {
    background-color: #f44;
    color: #000;
  }
  .meet-menu {
    display: flex;
    gap: 0.5rem;
    margin: 0.5rem;
    font-size: 0.75em;
    line-height: 0.5;
  }

  button.sb.blank {
    padding-left: 1.5rem;
  }

  button.sb.blank:hover {
    border-color: transparent;
    cursor: default;
  }
</style>