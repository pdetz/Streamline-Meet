<script>
    import { onMount } from 'svelte';
    import Page from '@shared/components/Page.svelte';
    import ScrollBox from '@shared/components/ScrollBox.svelte';
    export let title = "";

    let pageTitle = title;

    function handleTitleChange(event) {
        pageTitle = event.target.value;
    }
  </script>
  
  <div class="page-and-tools">
    <div class="document-area">
      <ScrollBox>
        <Page title={pageTitle}>
            <input class="title" bind:value={pageTitle} on:input={handleTitleChange} />
            <slot name="document">
              </slot>
        </Page>
      </ScrollBox>
    </div>
    
    <div class="tools-area">
        <button class='sb tool print' on:click={() => window.print()}>
            🖨️ Print
        </button>
        <div class="tools-content">
            <ScrollBox>
                <slot name="tools">
                    <!-- Tools will be placed here -->
                </slot>
            </ScrollBox>
        </div>
    </div>
</div>

<style>
    .page-and-tools {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
        gap: 1rem;
    }

    .document-area {
        flex-grow: 1;
        min-width: 0; /* Allows flex items to shrink below content width */
        max-width: 50rem;
        overflow-y: none; /* Add scrollbar when content overflows */
    }
    
    .tools-area {
        width: 22rem;
        background-color: var(--bg-color-2, #333);
        border-radius: 0.3rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.5rem;
    }
    
    button.print {
        width: 20rem;
        margin-bottom: 0.5rem;
    }

    .tools-content {
        flex: 1;
        overflow-y: auto;
    }
    
    /* Future responsive design - commented out for now */
    /* 
    @media (max-width: 768px) {
        .page-and-tools {
            flex-direction: column;
        }
        
        .tools-area {
            width: 100%;
            margin-top: 1rem;
        }
    }
    */
</style>