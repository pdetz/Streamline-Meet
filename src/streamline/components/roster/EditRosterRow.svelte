<script>
    export let swimmer;
    export let updateSwimmer;
    export let discardChanges;
    export let removeSwimmer;

    let newSwimmerInfo = {
        nombre: swimmer.nombre,
        apellido: swimmer.apellido,
        middleInitial: swimmer.middleInitial,
        nickname: swimmer.nickname,
        dob: swimmer.dob,
        age: swimmer.age
    };

    function saveSwimmer() {
        updateSwimmer(newSwimmerInfo);
    }

</script>

<tr>
    <td class='id'>{swimmer.id}</td>
    <td class='nombre'>
        <input type="text" bind:value={newSwimmerInfo.apellido}>
    </td>
    <td class='nombre'>
        <input type="text" bind:value={newSwimmerInfo.nombre}>
    </td>
    <td class='mi'>
        <input type="text" bind:value={newSwimmerInfo.middleInitial}>
    </td>
    <td class='nickname'>
        <input type="text" bind:value={newSwimmerInfo.nickname}>
    </td>
    <td class='dob'>
        <input type="text" bind:value={newSwimmerInfo.dob}>
    </td>
    <td class='age'>
        <input type="number" bind:value={newSwimmerInfo.age}>
    </td>
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
        <button class='sb inv' on:click={saveSwimmer}>
            ✅ Save
        </button>
        <button class='sb inv' on:click={discardChanges}>
            Discard Changes
        </button>
        <button class='sb inv' on:click={() => removeSwimmer(swimmer)}>
            ❌ Remove
        </button>
    </td>
</tr>

<style>
    td.nombre {
        width: 8em;
    }
    td.dob {
        text-align: center;
        width: 6em;
    }
    td.mi {
        width: 2em;
    }
    td.age {
        text-align: center;
        width: 4em;
    }
    input {
        background-color: transparent;
        color: var(--text-color-1);
        border: 1px solid var(--border-color-hl);
        padding: 0.2em;
        width: 100%;
        box-sizing: border-box;
    }
    button.sb.tool {
        padding: 0.2em 0.1em;
    }
    td.phone {
        width: 8em;
    }
</style>