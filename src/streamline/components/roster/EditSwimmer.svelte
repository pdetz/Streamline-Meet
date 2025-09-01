<script>
    import Tile from "@shared/components/Tile.svelte";
import { MY_TEAM } from "@src/stores";

    export let addSwimmer;
    export let saveFunction;
    export let closeModal;
    export let swimmer;
    // State variables for our input fields
    let nombre = '';
    let apellido = '';
    let nickname = '';
    let dob = ''; // Date of Birth
    let age = ''; // Age will likely be derived, but we'll include an input for now
    let gender = 'F';
    let parents = []; // Assuming parents is an array of objects with properties like nombre, apellido, etc.

    if (swimmer !== null) {
        // If a swimmer is passed, pre-fill the form with their data
        nombre = swimmer.nombre || '';
        apellido = swimmer.apellido || '';
        nickname = swimmer.nickname || '';
        gender = swimmer.gender;
        dob = swimmer.dob || '';
        age = swimmer.age ? String(swimmer.age) : ''; // Convert age to string for input
        parents = swimmer.parents || []; // Assuming parents is an array
    }

    $: myTeam = $MY_TEAM;

    // Function to handle the button click
    function saveSwimmer() {
        // Basic validation (you might want more robust validation)
        if (!nombre || !apellido || !dob) {
            alert('Please fill in Name, Last Name, and Date of Birth.');
            return;
        }

        // Create the swimmer object
        const newSwimmer = {
            nombre: nombre,
            apellido: apellido,
            nickname: nickname,
            dob: dob, // You might want to parse this into a Date object later
            age: parseInt(age) || null, // Convert age to a number, or null if empty/invalid
            team: myTeam,
            gender: gender,
            parents: parents, // Assuming parents is an empty array initially
        };

        saveFunction(newSwimmer);
    }
    
    function addParent() {
        // Add a new parent object to the parents array
        parents.push({ nombre: '', apellido: '', phone: '', email: '' });
        parents = [...parents]; // Trigger reactivity
    }
    function removeParent(parent) {
        // Remove the specified parent from the parents array
        parents = parents.filter(p => p !== parent);
        parents = [...parents]; // Trigger reactivity
    }

    function removeSwimmer() {
        myTeam.removeSwimmer(swimmer);
        closeModal();
    }
</script>

<Tile size={{width: '32em', height: 'auto'}}>
    <div slot='title'>
        {#if swimmer}
            Edit {swimmer.nombre} {swimmer.apellido}
        {:else}
            Add New Swimmer
        {/if}
    </div>
    <div class="swimmer-form-container">
        <div class="form-group">
            <label for="nombre">First Name (Nombre):</label>
            <input type="text" id="nombre" bind:value={nombre} placeholder="Enter first name" />
        </div>

        <div class="form-group">
            <label for="apellido">Last Name (Apellido):</label>
            <input type="text" id="apellido" bind:value={apellido} placeholder="Enter last name" />
        </div>

        <div class="form-group">
            <label for="nickname">Nickname (Optional):</label>
            <input type="text" id="nickname" bind:value={nickname} placeholder="Enter nickname" />
        </div>

        <div class="form-group">
            <label for="dob">Date of Birth (DOB):</label>
            <input type="text" id="dob" bind:value={dob} />
        </div>

        <div class="form-group">
            <label for="age">Age (Optional):</label>
            <input type="number" id="age" bind:value={age} placeholder="Enter age" min="0" />
        </div>
        <div class="form-group">
            <button on:click={()=> gender = 'F'} 
                class='sb tool' class:unselected={gender !== 'F'}>
                Female
            </button>
            <button on:click={()=> gender = 'M'}
                class='sb tool' class:unselected={gender !== 'M'}>
                Male
            </button>
        </div>
        <div class="form-group">
            <label for="team">Parents:</label>
            {#each parents as parent}
                <div class='parent-form'>
                    <input type="text" bind:value={parent.nombre} placeholder="Parent First Name" />
                    <input type="text" bind:value={parent.apellido} placeholder="Parent Last Name" />
                    <input type="text" bind:value={parent.phone} placeholder="Phone Number" />
                    <input type="email" bind:value={parent.email} placeholder="Email Address" />
                    <button on:click={() => removeParent(parent)} class="sb inv">
                        ❌
                    </button>
                </div>
            {/each}
            <button on:click={addParent} class="sb tool">
                Add Parent
            </button>
        </div>
        <button on:click={saveSwimmer} class="sb tool">Save Changes</button>
        <button on:click={closeModal} class="sb tool close">Close</button>
        <button on:click={removeSwimmer} class='sb tool remove'>
            Remove Swimmer
        </button>
    </div>
</Tile>

<style>
    /* Using em units where appropriate for scalability relative to font size */
    .swimmer-form-container {
        padding: 1em;
        font-size: 0.8rem; /* Base font size */
    }

    button.sb.tool.close {
        background-color: #888; /* Red for close button */
        color: #444;
    }

    button.sb.tool.remove {
        background-color: #d9534f; /* Bootstrap danger color */
        color: white;
    }

    .form-group {
        margin-bottom: 0.9375em; /* 15px */
    }

    label {
        display: block;
        margin-bottom: 0.3125em; /* 5px */
        font-weight: bold;
        color: white;
    }

    button.sb.tool.unselected {
        background-color: #555; /* Darker gray for disabled state */
        color: #ccc; /* Light gray text */
    }

    input[type="text"],
    input[type="email"],
    input[type="number"] { /* Adjust for 20px (1.25em) padding */
        padding: 0.625em; /* 10px */
        border: 0.0625em solid #888; /* 1px */
        border-radius: 0.3em;
        box-sizing: border-box; /* Include padding in width calculation */
        font-size: 1em; /* Base font size */
        background-color: #333; /* Darker background for inputs */
        color: white;
        width: 12em;
    }

    div.parent-form {
        display: flex;
        flex-direction: row;
        gap: 0.25em; /* Space between parent input fields */
        margin-bottom: 1em; /* Space between parent sections */
    }
    div.parent-form input[type="text"] {
        width: 8em; /* Allow inputs to grow equally */
    }
</style>