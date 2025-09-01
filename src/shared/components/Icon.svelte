<script>
    export let name;
    export let className = '';
    export let size = '1rem'; // Default size
  
    const icons = {
      fileMultiple: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1H4a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7l-6-6zm2 18H6v-2h8v2zm0-4H6v-2h8v2zm-3-5V2.5L16.5 9H11z" fill-opacity="0.7"/>
          <path d="M13 3H5a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9l-6-6zm2 18H7v-2h8v2zm0-4H7v-2h8v2zm-3-5V4.5L17.5 11H12z" fill-opacity="0.85"/>
          <path d="M14 5H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V11l-6-6zm2 18H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V6.5L18.5 13H13z"/>
        </svg>
      `,
      fileSingle: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm2 18H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 10H13z"/>
        </svg>
      `,
    };
  </script>
  
  <div class={`icon ${className}`} style="width: {size}; height: {size};">
    {@html icons[name] || ''}
  </div>
  
  <style>
    .icon {
      display: inline-block;
      vertical-align: middle;
    }
  
    .icon svg {
      width: 100%;
      height: 100%;
    }
    .green {
        color: #0f0;
    }
    .grey {
        color: var(--bg-color-2);
    }
  </style>
  