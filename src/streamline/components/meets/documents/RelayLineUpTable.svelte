<script>
    export let meet;
    export let selectedColors = ['#5d0', '#dfb'];
    export let relayEvent;
    export let type='planning';

    $: relays = relayEvent[type].filter(swim => swim.team.isMyTeam());

</script>

{#if relays.length > 0}
<div class='relay-event'>
<div class='event'>{relayEvent.name}</div>
{#each relays as relay}
  <table class="list stripe">
      <thead>
        <tr>
          <td class="Leg">
              Leg
          </td>
          <td>
              Swimmer
          </td>
          <td>
              Time
          </td>
        </tr>
      </thead>
      <tbody>
        {#each relay.swims as swim, i}
          <tr class="swims">
            <td class='leg'>
              {relayEvent.legs[i].distance} {relayEvent.legs[i].stroke.abbr}
            </td>
            <td class='name'>
              {swim.swimmer.display}
            </td>
            <td class='time'>
              {swim.display('seed')}
            </td>
          </tr>
        {/each}
        <tr class='time-to-beat'>
          <td class='ttb' colspan="2">
            Time to beat:
          </td>
          <td class='time'>
            {relay.display('seed')}
          </td>
        </tr>
      </tbody>
  </table>
{/each}
</div>
{/if}

<style>
  div.event {
    font-size: 0.8em;
    font-weight: bold;
    margin: 0;
  }
  td.leg {
    width: 6em;
  }
  table.stripe.list td.ttb {
    text-align: right;
    padding-right: 0.5em;
    font-style: italic;
  }
  @media print {
    div.relay-event {
      break-inside: avoid;
      width: 100%;
      font-size: 10pt;
    }
    td.leg {
      width: 80px;
    }
    td.ttb {
      padding-right: 8px;
    }
  }
</style>