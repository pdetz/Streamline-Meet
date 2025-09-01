<script>
    import EditRosterRow from './EditRosterRow.svelte'
    export let swimmer;
    export let removeSwimmer;
    let edit = false;

    function editSwimmer() {
        edit = true;
    }

    function updateSwimmer(newSwimmerInfo) {
        for (const prop in newSwimmerInfo) {
            swimmer[prop] = newSwimmerInfo[prop];
        }
        edit = false;
    }

    function discardChanges(){
        edit = false;
    }

</script>

{#if edit}
    <EditRosterRow {swimmer} {updateSwimmer} {discardChanges} {removeSwimmer}/>
{:else}
    <tr>
        <td class='id'>{swimmer.id}</td>
        <td class='nombre'>{swimmer.apellido}</td>
        <td class='nombre'>{swimmer.nombre}</td>
        <td class='mi'>{swimmer.middleInitial}</td>
        <td class='nombre'>{swimmer.nickname}</td>
        <td class='dob'>{swimmer.dob}</td>
        <td class='age'>{swimmer.age}</td>
        <td class='parents'>
            {#each swimmer.parents as parent}
                {parent.nombre} {parent.apellido}<br>
            {/each}
        </td>
        <td class='phone'>
            {#each swimmer.parents as parent}
                {parent.phone}<br>
            {/each}
        </td>
        <td class='email'>
            {#each swimmer.parents as parent}
                {parent.email}<br>
            {/each}
        </td>
        <td>
            <button class='sb inv' on:click={editSwimmer}>
                ✏️
            </button>
        </td>
    </tr>
{/if}

<style>
    td.nombre {
        padding-left: 0.2em;
        width: 8em;
    }
    td.dob {
        text-align: center;
        width: 6em;
    }
    td.age {
        text-align: center;
        width: 4em;
    }
    td.phone {
        width: 8em;
        text-align: center;
    }
</style>