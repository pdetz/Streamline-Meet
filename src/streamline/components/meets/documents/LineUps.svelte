<script>
  export let meet;

  import LineUpTable from './LineUpTable.svelte';
  import { leagueStore } from '@src/stores';
  import Pairs from '@shared/components/Pairs.svelte';
  import PageAndTools from './PageAndTools.svelte';
  import ColorPicker from './tools/ColorPicker.svelte';
  import EmojiPicker from './tools/EmojiPicker.svelte';
  import RelayLineUpTable from './RelayLineUpTable.svelte';
  import { userStore } from '@src/stores.js';

  let selectedEmojis = $userStore?.emojis || ['', ''];
  let selectedColors = $userStore?.documentColors || ['#fff', '#fff'];
  let showAllSwimmers = true;

  $: meet.sortAllSwimmers();
  
  $: league = $leagueStore;
  let ageGroups = [];

  let title = meet.name + ' Line Ups';
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

  function selectEmojis(emojis) {
    selectedEmojis = emojis;
    $userStore.set('emojis', emojis);
  }

  function showAllSwimmersChanged(value) {
    showAllSwimmers = value;
  }
</script>

<PageAndTools title={title}>
  <svelte:fragment slot="document">
    <div class="lineups">
      {#each ageGroups as group}
        <div class="age-group">
          <LineUpTable
            {group}
            {meet}
            {selectedEmojis}
            {showAllSwimmers}
            cssClass="lineups"
          />
        </div>
      {/each}
    </div>
    {#if meet.relayEvents.length > 0}
      <div class='relays'>
          <Pairs
            items={meet.relayEvents}
            itemName="relayEvent"
            Component={RelayLineUpTable}
            meet={meet}
            selectedColors={selectedColors}
            cssClass="lineups"
          />
        </div>
    {/if}
  </svelte:fragment>
  
  <svelte:fragment slot="tools">
    <ColorPicker
      {selectedColors}
      {selectColors}
    />
    <EmojiPicker
      {selectedEmojis}
      {selectedColors}
      {selectEmojis}
    />
    <div class='show-swimmers'>
         <button class="sb tool" class:grey={!showAllSwimmers} on:click={() => showAllSwimmersChanged(true)}>
            All Swimmers
          </button>
          <button class="sb tool" class:grey={showAllSwimmers} on:click={() => showAllSwimmersChanged(false)}>
            Entered Swimmers Only
          </button>
    </div>
  </svelte:fragment>
</PageAndTools>

<style>
  .lineups {
      display: grid;
      grid-template-columns: 1fr 1fr; /* Two equal columns */
      row-gap: 1em;
      column-gap: 2em;
  }
  .show-swimmers {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .show-swimmers button {
    width: 50%;
    font-size: 0.8rem;
    padding: 0.5rem 0;
  }
  .show-swimmers button.grey {
    background-color: #aaa;
    color: #444;
  }
  div.relays {
    margin-top: 1rem;
  }

  @media print {
    div.relays {
      margin-top: 1em;
    }
  }
</style>