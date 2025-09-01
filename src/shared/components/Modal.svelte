<script>
    export let visible = false;
    export let close = () => {visible = false};
    export let closeOnBackdrop = close;

  
    const backdropClick = () => { closeOnBackdrop() };
  </script>
  
  <style>
    /* Modal container */
    .modal-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      transition: opacity 0.3s ease-in-out;
      opacity: 0;
      pointer-events: none;
    }

    .modal-container.visible {
      opacity: 1;
      pointer-events: auto;
    }
  
    /* Modal content */
    .modal {
      background: var(--bg-color-1);
      color: var(--text-color-1);
      border-radius: 0.5em;
      border: 2px solid var(--border-color-hl);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 1rem;
      width: 90%;
      max-width: 600px;
      z-index: 1010;
    }
  </style>
  
  {#if visible}
    <div class="modal-container visible" on:click={backdropClick}>
      <div class="modal" on:click|stopPropagation>
        <slot></slot>
      </div>
    </div>
  {/if}  