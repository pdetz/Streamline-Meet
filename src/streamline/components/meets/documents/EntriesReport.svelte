<script>
  export let meet;
  export let type = 'planning';

  import LineUpTable from './LineUpTable.svelte';
  import { userStore, leagueStore, MY_TEAM } from '@src/stores';
  import PageAndTools from './PageAndTools.svelte';
  import ColorPicker from './tools/ColorPicker.svelte';
    import { numberToTime, timeToNumber } from '@models/Swim';

  $: myTeam = $MY_TEAM;
  //meet.sortAllSwimmers();

  $: participants = meet.participants(myTeam, type);
  $: nEntries = meet.individualEntries(myTeam, type).length;

  let selectedColors = ['#fff', '#fff'];

  let title = meet.name + ' Entries Report';

  function selectColors(colors) {
    selectedColors = colors;
    $userStore.updateDocumentColors(colors);
  }
</script>


<PageAndTools title={title}>
  <svelte:fragment slot="document">
    <div class="flexbox">
        <div class='summary'>
            <span class='subtitle'>Athletes Entered: {participants.length}</span>
            <span class='subtitle'>Individual Entries: {nEntries}</span>
        </div>

      <table class='list stripe'>
        <tbody>
          {#each participants as swimmer}
            <tr>
              <td class="name">{swimmer.display}</td>
            </tr>
            {#each swimmer.swimsByMeet(meet, 'planning') as swim}
              <tr>
                <td class="event">
                  {swim.event.name}
                </td>
                <td class="time pad-right">
                  {numberToTime(swim.seed) === '' ? 'NT' : numberToTime(swim.seed)}
                </td>
                <td class="event">
                  {swim.findMeetFromEntry().name}
                </td>
              </tr>
            {/each}
          {/each}
        </tbody>
      </table>
    </div>
  </svelte:fragment>
  
  <svelte:fragment slot="tools">
    <ColorPicker
      {selectedColors}
      {selectColors}
    />
    <button class='sb tool' on:click={copyEmails}>
      Copy Emails
    </button>
  </svelte:fragment>
</PageAndTools>

<style>
  .flexbox {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
  .name {
    text-align: left;
    padding-left: 0.25rem;
  }
  .summary {
    display: flex;
    flex-direction: row;
    gap: 5rem;
  }
  td.event {
    text-align: left;
    padding-left: 2em;
  }
  table.stripe tbody{
    background: transparent
  }

  @media print {
    table.stripe tbody {
        background: transparent;
    }
    table.stripe tbody>tr:nth-child(odd)>td {
        background: transparent;
    }

    table.stripe tbody>tr:nth-child(even) {
        background: transparent;
    }
  }
</style>