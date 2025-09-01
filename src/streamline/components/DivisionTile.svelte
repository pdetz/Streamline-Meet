<!-- DivisionTile.svelte -->
<script>
  export let division;

  import Tile from "@shared/components/Tile.svelte";
  import pullDivisionalHtml from '@data/pullDivisionalHtml';
  
  async function handleButtonClick() {
    try {
      const updatedDivision = await pullDivisionalHtml(division);
      division = updatedDivision;
    } catch (error) {
      console.error("Error fetching division data:", error);
    }
  }
</script>

<Tile size={{ width: "10em", height: "16em" }}>
  <div slot="title">
    Division {division.name}
  </div>
  
  {#if division.meets.length === 0}
    <button on:click={handleButtonClick}>Check/Create Division</button>
  {/if}

  {#if division.teams.length > 0}
    <ul class="team-list">
      {#each division.teams as team}
        <li>{team.name}</li>
      {/each}
    </ul>
  {/if}
</Tile>

<style>
  .team-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .team-list li {
    margin: 0.5rem 0;
  }

  button {
    background-color: var(--bg-color-2);
    border: 2px solid transparent;
    padding: 0.5rem 1rem;
    color: white;
    cursor: pointer;
  }

  button:hover {
    border-color: var(--border-color-hl);
  }
</style>
