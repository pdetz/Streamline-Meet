<script>
    export let meet;
    export let relayEvent;
    export let cssClass = "";
    export let selectedColors = ['transparent', 'transparent'];
    import TeamsPoints from '../TeamsPoints.svelte';

    console.log(relayEvent);
</script>

<div>
  <div class={"eventName " + cssClass}>
    {relayEvent.name} <TeamsPoints {meet} swims={relayEvent.entries}/>
  </div>
    <table class={cssClass + " list"}>
      <thead class='center'>
        <tr>
            <td class='thead-athletes' colspan="2">Athletes</td>
            <td class="team">Team</td>
            <td class='time'>Seed</td>
            <td class="points">Pts</td>
          </tr>
        </thead>
        
    <tbody>
        {#each relayEvent.entries as relay}
            <tr class:my_team={relay.team.isMyTeam()}>
              <td class="place"> {relay.place} </td>
              <td class='athletes'>
                {#each relay.swims as swim}
                  <div class='name'>
                    {swim.swimmer.display}
                  </div>
                {/each}
              </td>
              <td class='team'>{relay.team.abbr}</td>
              <td class="time relay-planner">{relay.display('seed')}</td>
              <td class='points'>
                {#if relay.points > 0}
                  {relay.points}
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
</div>

<style>
    div.eventName {
    font-size: 0.9em;
    padding-bottom: 0.25em;
    text-align: left;
    margin-top: 1em;
  }
  
  div.eventName.stripe {
    font-weight: bold;
    margin-top: 0;
  }
  
  div.name {
    width: 100%;
    white-space: nowrap; /* Prevent text from wrapping */
    overflow: hidden;    /* Hide content that overflows */
  }

  @media print {
    td.thead-athletes {
      width: 184px;
    }
    div.name {
      white-space: nowrap; /* Prevent text from wrapping */
      overflow: hidden;    /* Hide content that overflows */
      width: 100%
    }
  }
</style>