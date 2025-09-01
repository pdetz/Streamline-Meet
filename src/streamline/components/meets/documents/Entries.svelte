<script>
  export let meet;
  export let type = 'planning';

  import LineUpTable from './LineUpTable.svelte';
  import { userStore, leagueStore, MY_TEAM } from '@src/stores';
  import PageAndTools from './PageAndTools.svelte';
  import ColorPicker from './tools/ColorPicker.svelte';
  import RelayEntries from './RelayEntries.svelte';

  $: myTeam = $MY_TEAM;
  meet.sortAllSwimmers();

  $: participants = meet.participants(myTeam, type).length;
  $: nEntries = meet.individualEntries(myTeam, type).length;

  $: league = $leagueStore;
  let selectedColors = $userStore?.documentColors || ['#fff', '#fff'];

  let ageGroups = [];

  let title = meet.name + ' Entries';

  $: if (meet) {
    ageGroups = documentAgeGroups(league.bags, meet);
  }

  function documentAgeGroups(bags, currentMeet) {
    if (!currentMeet) return [];
    let dags = currentMeet.ageGroups.filter(ag => {
      return ag.eventIndices.length > 0 && bags.some(bag => ag.isSameAgeAs({ ages: bag }));
    });
    return dags;
  }

  function selectColors(colors) {
    selectedColors = colors;
    $userStore.updateDocumentColors(colors);
  }
</script>

<PageAndTools title={title}>
  <svelte:fragment slot="document">
    <div class="flexbox">
      <div class='summary'>
        <span class='subtitle'>Athletes Entered: {participants}</span>
        <span class='subtitle'>Individual Entries: {nEntries}</span>
      </div>
        {#each ageGroups as group}
          <LineUpTable
            {meet}
            {group}
            {type}
            {selectedColors}
            showDistance={true}
            showAllSwimmers={false}
            selectedEmojis={['time']}
            cssClass='entries'
          />
        {/each}
      <RelayEntries {meet} {type} />
    </div>
  </svelte:fragment>
  
  <svelte:fragment slot="tools">
    <ColorPicker
      {selectedColors}
      {selectColors}
    />
  </svelte:fragment>
</PageAndTools>

<style>
  .flexbox {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
  .summary {
    display: flex;
    flex-direction: row;
    gap: 5rem;
  }
</style>