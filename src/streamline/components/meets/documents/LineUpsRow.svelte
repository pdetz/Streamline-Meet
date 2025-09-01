<script>
    import { pointsStore, userStore } from "@src/stores";

  export let swimmer;
  export let events;
  export let group;
  export let type = 'planning';
  export let selectedEmojis = ['🐊', '⭐'];

  let seed = '';
  let previousPoints = $pointsStore;
  $: if (type === 'planning' || type === 'entries') {
    seed = 'seed';
  }

  $: swimmer, selectedEmojis, fillEmojis();
  let status = swimmer.getStatus(events[0].meet);
  let tdClass = status === 'x' ? 'name unconfirmed' : 'name';

  let emojis = [];
  //fillEmojis();

  $: if (previousPoints !== $pointsStore) {
    fillEmojis();
    previousPoints = $pointsStore;
  }

  function fillEmojis(){
    if (selectedEmojis[0] === 'time') {
      emojis = events.map((event, i) => {
        let entry = event.planning.find(en => en.swimmer.key == swimmer.key);
        if (entry) {
          if (entry.seed > 9997) return 'NT';
          return entry.display('seed');
        } else return '';
      });
    } else {
      emojis = events.map((event, i) => {
        let entry = event.planning.find(en => en.swimmer.key == swimmer.key);
        if (entry) {
          return selectedEmojis[group.swimmerBelongs(swimmer) ? 0 : 1];
        } else return '';
      });
    }
  }
</script>

<tr>
  <td class={tdClass}>{swimmer.display}</td>
  {#each emojis as emoji}
    <td>
      {#if emoji === '🐊'}
        <img src="/gator.svg" alt="alligator" class="emoji-img" />
      {:else}
          {emoji}
      {/if}
    </td>
  {/each}
</tr>

<style>
  td.name.unconfirmed {
    font-style: italic;
  }
  .emoji-img {
    width: 1em;
    height: 1em;
    vertical-align: middle; /* Align the image vertically with the text */
  }
</style>