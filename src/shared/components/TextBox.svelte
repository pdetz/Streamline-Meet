<script>
    import { createEventDispatcher, onMount } from 'svelte';
  
    export let object;
    export let prop;
  
    let currentValue;
    let originalValue;
  
    const dispatch = createEventDispatcher();
  
    onMount(() => {
      if (object && prop in object) {
        currentValue = originalValue = object[prop];
      }
    });
  
    // Function to reset the value
    function reset() {
      currentValue = originalValue;
    }
  
    // Function to update the object[prop] with the current value
    function updateParent() {
      if (object && prop in object) {
        object[prop] = currentValue;
      }
    }
  
    // Listen for the parent component's message
    export function updateFromParent() {
      updateParent();
    }
  </script>
  
  <div class="textbox-container">
    <input
      type="text"
      bind:value={currentValue}
      on:input={() => dispatch('change', currentValue)}
    />
    {#if currentValue !== originalValue}
      <span class="reset-button" on:click={reset}>x</span>
    {/if}
  </div> 

  <style>
    .textbox-container {
      display: flex;
      align-items: center;
    }
    .reset-button {
      margin-left: 0.5rem;
      color: red;
      cursor: pointer;
      font-size: 1rem;
    }
    .reset-button:hover {
      color: darkred;
    }
  </style>