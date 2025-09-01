<script>
  import Picker from './Picker.svelte';
  import { COLORS } from './colorsEmojis.js';

  export let selectedColors = [];
  export let selectColors = () => {};
  export let colors = COLORS;
  let newColors = [...selectedColors];

    function onColorClick(color, row) {
        newColors[row] = color;
        selectColors([...newColors]);
    }
</script>

<div class="toolbox">
  {#each colors as cols, row}
    <Picker
      key={row}
      css={"row" + row}
      items={cols}
      selectedItem={newColors[row]}
      onButtonClick={(color) => onColorClick(color, row)}
      buttonProps={(color) => ({ style: `background-color: ${color}` })}
    />
  {/each}
</div>

<style>
  /* Add your styles here */
</style>