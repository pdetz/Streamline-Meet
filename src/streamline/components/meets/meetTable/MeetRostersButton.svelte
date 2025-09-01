<script>
  import { uploadFiles } from "@data/uploadFiles";
  import { meetEntriesRefresh, triggerRefresh } from "@src/stores";
  import Icon from "@shared/components/Icon.svelte";

  export let team;

  async function handleClick() {

    const fileContent = await uploadFiles(); // Use the imported function
    if (fileContent) {
      await team.updateRoster(fileContent);
      triggerRefresh(meetEntriesRefresh);
    } else {
      console.error('File upload was canceled or no file was selected.');
    }
  }

  async function clearEntry(event) {
    event.stopPropagation(); // Prevent the main button's click event from firing
    await team.updateRoster(null);
    triggerRefresh(meetEntriesRefresh);
    console.log('Roster cleared');
  }
</script>

{#key $meetEntriesRefresh}
<button class="sb" on:click={handleClick}>
  <Icon
    name="fileSingle" 
    className={team.rosterFile.exists ? "green" : "grey"}
  />
  {#if team.rosterFile.exists}
    <div class='text'>{team.rosterFile.name}</div>
    <div class="clear-icon" on:click={clearEntry}>X</div>
  {:else}
    <div class='text'>Upload {team.name} Roster</div>
  {/if}
</button>
{/key}

<style>
  .sb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .text {
    text-align: left;
  }
  .clear-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 1.2rem;
    height: 1.2rem;
    border-radius:0.3rem;
    text-align: center;
  }
  .clear-icon:hover{
    color: #f11;
    background-color: var(--bg-color-2);
  }
</style>