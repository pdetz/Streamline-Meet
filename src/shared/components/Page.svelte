<script>
  import { onMount, onDestroy } from 'svelte';

  export let minScale = 0.5;
  export let pageWidth = 48;

  let currentScaleFactor = 1;
  let scalingContainer;
  let height;

  let resizeObserver;

  function handleResize() {
    if (!scalingContainer) return;

    height = scalingContainer.offsetHeight * currentScaleFactor;

    const windowWidth = window.innerWidth;
    const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const windowWidthRatio = windowWidth / fontSize;
    const targetWidthRatio = 89;
    const difference = targetWidthRatio - pageWidth;

    let newScaleFactor = 1;
    if (windowWidthRatio < targetWidthRatio) {
      newScaleFactor = Math.max(minScale, (windowWidthRatio - difference) / (pageWidth));
    }

    if (newScaleFactor !== currentScaleFactor) {
        currentScaleFactor = newScaleFactor;
        height = scalingContainer.offsetHeight * currentScaleFactor;
    } else {
         height = scalingContainer.offsetHeight * currentScaleFactor;
    }
  }

  onMount(() => {
    handleResize();

    resizeObserver = new ResizeObserver(entries => {
      handleResize();
    });

    if (scalingContainer) {
      resizeObserver.observe(scalingContainer);
    }

    window.addEventListener('resize', handleResize);
  });

  onDestroy(() => {
    if (resizeObserver && scalingContainer) {
      resizeObserver.unobserve(scalingContainer);
    }
    window.removeEventListener('resize', handleResize);
  });
</script>

<div class='wrap' style="height: {height}px">  
  <div bind:this={scalingContainer} class="printable-page" 
    style="transform: scale({currentScaleFactor}); transform-origin: top left;">
      <slot></slot>
  </div>
</div>
  
  <style>
    .printable-page {
      background-color: #fafafa;
      max-width: 48rem;
      padding: 1.5rem;
      box-sizing: border-box;
      margin: 0.5rem;
      color: #000;
      width: 48rem; /* Set the layout width */
      transform-origin: top left; /* Ensure consistent scaling origin */
    }
  </style>