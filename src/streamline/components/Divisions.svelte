<script>
  import DivisionTile from './DivisionTile.svelte';
  import { onMount } from 'svelte';
  import { seasonStore } from '@src/stores';
  import { get } from 'svelte/store';

  const season = get(seasonStore);

</script>
  
  <style>
    .container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      justify-content: center;
    }
  </style>
  
  <h1>2024 Montgomery County Swim League</h1>

  <div class="container">
    {#each season.divisions as division}
      <DivisionTile {division} />
    {/each}
  </div>
  
