<script>
  import Icon from "@shared/components/Icon.svelte";
  import { uploadFiles } from "@data/uploadFiles";
  export let meet;
  export let team;

  $: entriesFile = meet.entriesFiles?.[meet.teamIndex(team)];// ?? null;

  async function handleClick() {
    entriesFile = await uploadFiles(); // Use the imported function
    if (entriesFile) {
      // Update entries manually after file dialog is complete
      await meet.updateEntries(entriesFile)
      console.log("Entries updated: ", entriesFile);
    } else {
      console.error('File upload was canceled or no file was selected.');
    }
  }

  async function clearEntry(event) {
    event.stopPropagation(); // Prevent the main button's click event from firing
    entriesFile = null;
    await meet.updateEntries(null, team);
    console.log(team.abbr, ' entries cleared');
  }
</script>

<button class="sb" on:click={handleClick}>
  <Icon
    name="fileSingle" 
    className={entriesFile.exists ? "green" : "grey"}
  />
  {#if entriesFile.exists}
    <div class='text'>{entriesFile.name}</div>
    <div class="clear-icon" on:click={clearEntry}>X</div>
  {:else}
    <div class='text'>Upload {team.name} Entries</div>
  {/if}
</button>

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