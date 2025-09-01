<!-- Tile.svelte -->
<script>
  export let size = { width: "auto", height: "auto" };
</script>

<div class="tile" style="width: {size.width}; height: {size.height};">
  <div class="tile-title">
    <slot name="title"></slot>
  </div>
  <div class="tile-content">
    <slot></slot>
  </div>
</div>

<style>
    .tile {
        border-radius: 0.3rem;
        display: flex;
        flex-direction: column;
        text-align: center;
        padding: 0;
        overflow: hidden; /* Add this line */
        border: 1px solid var(--border-color);
        transition: 0.25s;
    }
    .tile-title {
        background-color: var(--bg-color-2);
        color: var(--text-color-1);
        font-weight: bold;
        padding: 0.5rem;
    }
    .tile-content {
        flex: 1;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: var(--bg-color-1);
        padding: 0.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 0.75rem;
    }
    .tile:hover {
        /* Instead of changing border, create a subtle glow */
        box-shadow: 0.2rem 0.2rem 0.6rem var(--border-color);
    }
</style>
