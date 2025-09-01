<script>
  export let meet;
  export let event;

  let nHeats; let heats;

  $: if (event) {
    // Calculate the maximum heat number by finding the highest heat in event.entries
    nHeats = Math.max(...event.entries.map(entry => entry.heat));

    // Group entries by heat, creating an array of arrays for each heat
    heats = Array.from({ length: nHeats }, (_, i) =>
      event.entries.filter(entry => entry.heat === i + 1)
    );
  }


</script>

<div class="program_event">
  {event.name}
  <table class="list">
    <tbody>
      <tr>
        <td>Lane</td>
        <td>Athlete</td>
        <td>Age</td>
        <td>Team</td>
        <td>Seed</td>
      </tr>
      
      {#each heats as heatEntries}
     
        <td colspan=2>Heat {heatEntries[0].heat} of {nHeats}</td>
     
        {#each heatEntries as swim}
          <tr class:my_team={swim.swimmer.isMyTeam()}>
            <td>{swim.lane}</td>
            <td>{swim.swimmer.resultsDisplay}</td>
            <td>{swim.swimmer.age}</td>
            <td>{swim.swimmer.team.abbr}</td>
            <td class="time">{swim.display('seed')}</td>
          </tr>
          {/each}
        {/each}
    </tbody>
  </table>
</div>

<style>
  /* Your existing styles */
  div.program_event {
    margin-top: 1rem;
  }
</style>