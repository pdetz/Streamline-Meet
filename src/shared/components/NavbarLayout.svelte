<!-- src/shared/components/Layout.svelte -->
<script>
    export let options = [];
    export let loading = false;
    import SelectButtons from '@shared/components/SelectButtons.svelte';
    import { viewStore } from '@src/stores';

    $: selected = $viewStore;

    function select(option) {
      viewStore.set(option);
    }
  </script>
  
  <div class="container">
    <div class="navbar">
      <SelectButtons {options} {selected} {select} text={(option) => option.name} />
    </div>
    <div class="content">
      {#if !loading}
        <svelte:component this={selected.component} { ...selected.props} />
      {/if}
      </div>
    {#if loading}
      <div class="loading-overlay">
        <div class="loading-text">Loading...</div>
      </div>
    {/if}
  </div>
  
  <style>
    .container {
      display: flex;
      height: 100vh;
    }
  
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 3rem;
      background-color: var(--bg-color-1);
      display: flex;
      align-items: center;
      padding: 0 1rem;
      gap: 0.5rem;
      z-index: 1000;
    }
  
    .content {
      margin-top: 3rem;
      background-color: var(--bg-color-1);
      color: var(--text-color-1);
      padding: var(--std-padding);
      height: calc(100vh - 3rem);
      width: 100vw;
      flex: 1;
    }
  
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
  
    .loading-text {
      color: var(--text-color-1);
      font-size: 2rem;
    }
  </style>
  