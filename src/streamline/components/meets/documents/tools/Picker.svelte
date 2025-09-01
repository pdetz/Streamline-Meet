<script>
  import PaletteButton from './PaletteButton.svelte';

  export let items = [];
  export let selectedItem;
  export let buttonProps = (item) => ({});
  export let onButtonClick = (item) => {};

</script>

<div class="palette">
  {#each items as item, index}
    <PaletteButton
      props={ {...buttonProps(item)} }
      selected={selectedItem == item ? ' sel' : ''}
      onClick={() => onButtonClick(item)}
    />
  {/each}
</div>

<style>
  div.palette{
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      padding:0;
      margin-left: 0;
      width: 19rem;
  }
</style>