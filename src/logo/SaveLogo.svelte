<script>
    import { newParseObject } from '@data/ParseHelpers.js';

    export let dimensions;
    export let selectedColors;

    let saving = false;
    let saveStatus = '';

    async function saveLogo() {
        saving = true;
        saveStatus = 'Saving...';

        try {
            const logoParametersToSave = {
                ...dimensions,
                colors: selectedColors
            };

            console.log("Saving logo parameters:", logoParametersToSave);

            await newParseObject('Logo', logoParametersToSave);

            saveStatus = 'Saved successfully!';
            console.log("Logo saved successfully.");

        } catch (error) {
            saveStatus = `Error saving logo: ${error.message}`;
            console.error("Error saving logo:", error);
        } finally {
            saving = false;
            setTimeout(() => { saveStatus = ''; }, 5000);
        }
    }
</script>

<button class='sb tool' on:click={saveLogo} disabled={saving}>
    {#if saving}
        Saving...
    {:else}
        Save Logo
    {/if}
</button>

{#if saveStatus}
    <p class="save-status" class:error={saveStatus.startsWith('Error')}>{saveStatus}</p>
{/if}

<style>

    button:disabled {
        background-color: #5a6268;
        cursor: not-allowed;
        opacity: 0.6;
    }

    .save-status {
        margin-top: 0.5em;
        font-size: 0.9em;
        color: #fff;
        min-height: 1.2em;
    }

    .save-status.error {
        color: #dc3545;
    }
</style>