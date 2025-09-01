<script>
    let menu = false;
    export let style;
  
    function showMenu() {
      menu = true;
    }
  
    function hideMenu() {
      menu = false;
    }
  </script>
  
  <div class="dropdown-container" style={style} on:mouseleave={hideMenu}>
    <button on:mouseenter={showMenu} class='menu-button' >
      <slot name="menu-button"></slot>
    </button>
  
    {#if menu}
      <div class='menu' role="menu" aria-label="Dropdown Menu">
        <slot></slot>
      </div>
    {/if}
  </div>
  
  <style>
    .dropdown-container {
      position: relative;
      display: inline-block;

    }
  
    .menu-button {
        background-color: transparent; /* Or use a variable here */
        border: none; /* Or use a variable */
        cursor: pointer;
    }
  
    .menu-button:focus {
        /* Customizable focus style */
        outline: var(--button-focus-outline, 2px solid blue);
    }
  
    .menu {
      position: absolute;
      top: 100%;
      /* Control alignment with a variable */
      left: var(--menu-left, 0);
      right: var(--menu-right, auto);
  
      background-color: var(--bg-color-2);
      padding: 0.2rem;
    }
  
     /* Styling for content INSIDE the default slot */
     .menu :global(.menu-item) {
         padding: 8px 16px;
         cursor: pointer;
     }
  
     .menu :global(.menu-item:hover) {
         background-color: #f5f5f5;
     }
  </style>