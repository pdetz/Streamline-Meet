<script>
    import Icon from "@shared/components/Icon.svelte";
    import { uploadFiles } from "@data/uploadFiles";

    import { pullMcslMeetResults } from "@data/pullMcslMeetResults"

  export let meet;

  $: resultsFile = meet.resultsFiles[0];// ?? null;

  async function handleClick(action) {
        if (typeof action === "function") {
            resultsFile = await action(meet);
        } else {
            resultsFile = action;
        }

        if (resultsFile !== undefined) {
            await meet.updateResults(resultsFile);
            console.log(resultsFile ? "Results updated: " + resultsFile.name : 'Results cleared');
        } else {
            console.error('Action was canceled or no file was selected.');
        }
    }

    function clearEntry(event) {
        event.stopPropagation(); // Prevent the main button's click event from firing
        handleClick(null); // Pass null to clear results
    }
</script>

<button class="sb" on:click={() => handleClick(uploadFiles)}>
  <Icon
    name="fileSingle" 
    className={resultsFile.exists ? "green" : "grey"}
  />
  {#if resultsFile.exists}
    <div class='text'>{resultsFile.name}</div>
    <div class="clear-icon" on:click={clearEntry}>X</div>
  {:else}
    <div class='text'>Upload {meet.name} Results</div>
  {/if}

</button>
{#if !resultsFile}
<button class="sb" on:click={() => handleClick(pullMcslMeetResults)}>
  <Icon
    name="fileSingle" 
    className="grey"
  />
    <div class='text'>Pull {meet.name} Results from MCSL</div>
</button>
{/if}

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
