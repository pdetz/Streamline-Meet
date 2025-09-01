<script>
  export let meet;
  export let type = 'planning';

  import LineUpTable from './LineUpTable.svelte';
  import { userStore, leagueStore, MY_TEAM } from '@src/stores';
  import PageAndTools from './PageAndTools.svelte';
  import ColorPicker from './tools/ColorPicker.svelte';

  let myTeam = $MY_TEAM;
  meet.sortAllSwimmers();

  $: participants = meet.participants(myTeam, type);

  let selectedColors = $userStore?.documentColors || ['#fff', '#fff'];

  let title = meet.name + ' Participants';

  $: group = {
    name: 'All Participants',
    swimmers: participants
  };

  function selectColors(colors) {
    selectedColors = colors;
    $userStore.updateDocumentColors(colors);
  }

  function copyEmails() {
    const emails = participants.map(p => p.parents.map(parent => parent.email).join(', ')).join('\n');
    navigator.clipboard.writeText(emails).then(() => {
      alert('Emails copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy emails: ', err);
    });
  }
</script>

<PageAndTools title={title}>
  <svelte:fragment slot="document">
    <div class="flexbox">
      <table class='list stripe'>
        <thead>
          <tr>
            <td></td>
            <td class="name">
              {group.name}
              <span class="count">({participants.length})</span>
            </td>
            <td>
              Parents
            </td>
            <td>
              Email
            </td>
            <td>
              Phone
            </td>
          </tr>
        </thead>
        <tbody>
          {#each group.swimmers as swimmer}
            <tr>
              <td>
                {#if swimmer.getStatus(meet) === 'Present'}
                  <span class="icon checkmark">&#10003;</span>
                {/if}
              </td>
              <td class="name">{swimmer.display}</td>
              <td>
                {#each swimmer.parents as parent}
                  {parent.nombre} {parent.apellido}<br>
                {/each}
              </td>
              <td>
                {#each swimmer.parents as parent}
                  {parent.email}<br>
                {/each}
              </td>
              <td>
                {#each swimmer.parents as parent}
                  {parent.phone}<br>
                {/each}
            </tr>
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
</style>