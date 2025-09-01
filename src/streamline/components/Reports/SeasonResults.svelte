<script>
  import PageAndTools from '@meets/documents/PageAndTools.svelte';
    import SwimmerResults from './SwimmerResults.svelte';
  import ColorPicker from '@meets/documents/tools/ColorPicker.svelte';
  import { userStore, MY_TEAM } from '@src/stores.js';

  $: myTeam = $MY_TEAM;
  $: divisionals = myTeam.meets[myTeam.meets.length - 1];
  $: swimmers = myTeam.swimmers
    .filter(swimmer => swimmer.swimsByMeet(divisionals, 'planning').length > 0)
    .sort((a, b) => a.nameSort(b));
  $: selectedColors = $userStore?.documentColors || ['#fff', '#fff'];

  function selectColors(colors) {
    selectedColors = colors;
    $userStore.updateDocumentColors(colors);
  }
</script>

<PageAndTools title=''>
  <svelte:fragment slot="document">
        <div class='swimmer-results'>
            {#each swimmers as swimmer}
                <SwimmerResults
                    {swimmer}
                    {selectedColors}
                />
            {/each}
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
    div.swimmer-results {
        margin-bottom: 1em;
    }
    @media print {
        div.swimmer-results {
            page-break-inside: avoid;
            break-after: always;
        }
    }
</style>