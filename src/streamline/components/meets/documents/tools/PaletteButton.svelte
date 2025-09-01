<script>
  export let className = 'palette';
  export let selected = '';
  export let onClick;
  export let props;

  $: style = props.style ? props.style : '';
  $: text = props.text ? props.text : '';
</script>

<button class={className + selected} on:click={onClick} style={'; ' + style}>

  {#if props.icon}
    <img src={props.icon} alt="icon" />
  {/if}

  {#if props.text}
    <span>{text}</span>
  {/if}
</button>

<style>

button.palette {
  outline: 0.125rem solid var(--bg-color-1);
  border: 0.125rem solid transparent;
  height: 2rem;
  width: 2rem;
  margin: 0.1875rem;
  padding: 0;
  text-align: center;
  font-size: 1rem;
  transition: 0.1s ease-in;
  color: #000
}

button.palette:hover{
  outline-color: #888;
  border-color: #000; 
}

button.palette:active{
  outline-color: #000;
  border-color: transparent;
  filter: brightness(50%);
  transition: 0s;
}

button.palette.sel{
  outline-color: #fff;
  border-color: #000; 
  transition: 0.25s ease-in;
}

</style>