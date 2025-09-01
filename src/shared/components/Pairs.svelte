<script>
  export let items = []; // Array of items to pair
  export let Component; // The component to render for each item
  export let itemName = 'item'; // The name of the prop to pass the item as

  let props = $$restProps;
  let pairs = [];
  $: {
    props = $$restProps;
    pairs = [...pairs];
    console.log('Pairs props', props);
  }
  // Group items into pairs
  $: if (items) {
    pairs = [];
    for (let i = 0; i < items.length; i += 2) {
      pairs.push(items.slice(i, i + 2));
    }
  }
</script>

<div class="flexbox">
  {#each pairs as pair, index}
    <div class="pair" key={index}>
      {#each pair as item, idx}
      <div class='single'>
        <Component
          {...props}
          {...{ [itemName]: item }}
          key={index * 2 + idx}
        />
      </div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .flexbox {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .pair {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    gap: 1.5em;
    
  }

  .single {
    width: calc(50% - 0.75em);
  }

  @media print {
    .pair {
      gap: 20pt;
    }
  }
</style>