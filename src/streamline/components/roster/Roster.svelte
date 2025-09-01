<script>
    import UploadFilesButton from '../UploadFilesButton.svelte';
    import { MY_TEAM } from '@src/stores';
    import EditSwimmer from './EditSwimmer.svelte';
    import File from '@data/files/File';
    import ScrollBox from '@shared/components/ScrollBox.svelte';
    import exportContent from '@data/export/exportContent';
    import { parseCSVRoster } from './parseCSVRoster';

    $: myTeam = $MY_TEAM;
    $: swimmers = myTeam.swimmers;

    let searchTerm = '';
    let viewModal = false;
    let selectedSwimmer = null;
    let saveFunction = addSwimmer;

    $: filteredSwimmers = swimmers.filter(swimmer => {
        let match = false;
        if (!searchTerm) return true; // If no search term, show all swimmers
        // Check if swimmer's name or last name includes the search term
        if (swimmer.nombre && swimmer.apellido) {
            match = swimmer.nombre.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
                    swimmer.apellido.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
                    (swimmer.nickname && swimmer.nickname.toLowerCase().startsWith(searchTerm.toLowerCase())) ||
                    (swimmer.middleInitial && swimmer.middleInitial.toLowerCase().startsWith(searchTerm.toLowerCase()));
        }
        if (!match && swimmer.parents) {
            // Check if any parent's name includes the search term
            match = swimmer.parents.some(parent => 
                (parent.nombre && parent.nombre.toLowerCase().startsWith(searchTerm.toLowerCase())) ||
                (parent.apellido && parent.apellido.toLowerCase().startsWith(searchTerm.toLowerCase()))
            );
        }
        return match;
    });

    function openNewSwimmerModal() {
        selectedSwimmer = null;
        saveFunction = addSwimmer;
        viewModal = true;
    }

    function editSwimmer(swimmer) {
        selectedSwimmer = swimmer;
        saveFunction = updateSwimmer;
        viewModal = true;
    }

    function addSwimmer(swimmer) {
        myTeam.addSwimmer(swimmer);
        console.log(myTeam.swimmers.length + ' swimmers in team');
        swimmers = [...myTeam.swimmers]; // Update the swimmers array to trigger reactivity
        viewModal = false;
    }

    function updateSwimmer(newSwimmerInfo) {
        console.log('Updating swimmer:', newSwimmerInfo);
        for (const prop in newSwimmerInfo) {
            selectedSwimmer[prop] = newSwimmerInfo[prop];
        }
        swimmers = [...myTeam.swimmers]; // Update the swimmers array to trigger reactivity
        viewModal = false;
    }

    function closeModal() {
        viewModal = false;
    }

    function saveRoster() {
        console.log('Saving roster...');
        const rosterFile = File.writeCompleteRosterToFile(myTeam);
        myTeam.updateRoster(rosterFile);
    }

    function removeSwimmer(swimmer) {
        myTeam.removeSwimmer(swimmer);
        swimmers = [...myTeam.swimmers]; // Update the swimmers array to trigger reactivity
    }

    function downloadRoster() {
        exportContent([File.writeRosterToFile(myTeam)]);
    }

    function generateIdNumbers() {
        swimmers.forEach((swimmer, index) => {
            swimmer.id = index + 1;
            swimmer.currentId = index + 1;
        });
        swimmers = [...swimmers];
    }

    function copyEmails() {
        const emails = swimmers.flatMap(swimmer => 
            swimmer.parents.map(parent => parent.email).filter(email => email)
        );
        if (emails.length > 0) {
            navigator.clipboard.writeText(emails.join(', ')).then(() => {
                alert('Emails copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy emails: ', err);
            });
        } else {
            alert('No emails found to copy.');
        }
    }
</script>

<!-- Display the manipulated roster data -->
<div style={'margin-bottom: 1em; display: flex; flex-direction: row; gap: 1em'}>
    Search: <input type='text' placeholder='Search by name...' bind:value={searchTerm} />
    <button class='sb tool' on:click={openNewSwimmerModal}>
        + Add Swimmer
    </button>
    <button class='sb tool' on:click={saveRoster}>
        ⬆️ Save
    </button>
    <button class='sb tool' on:click={downloadRoster}>
        ⬇️ Download
    </button>    
    <button class='sb tool' on:click={generateIdNumbers}>
        🔢 Generate IDs
    </button>
    <button class='sb tool' on:click={copyEmails}>
        Copy Emails
    </button>
    <UploadFilesButton 
        accept='.csv,.CSV'
        onFilesSelected={parseCSVRoster}
        multiple=false
        text='Upload CSV'
    />
    <span> Swimmer Count: {swimmers.length}</span>
</div>
<div>

</div>

<div class='flex-row'>
    <ScrollBox height='calc(100vh - 8em)' width='48em'>
        <table class="list">
            <thead>
                <tr>
                    <td>id</td>
                    <td>Swimmer</td>
                    <td>Parent(s)</td>
                    <td>Phone</td>
                    <td>Email</td>
                    <td></td>
                </tr>
            </thead>
            <tbody>
                {#each filteredSwimmers as swimmer}
                    <tr>
                        <td class='id'>{swimmer.id}</td>
                        <td class='swimmer'>
                            <button class='sb inv' on:click={()=>console.log(swimmer)}>
                                {swimmer.display}
                            </button>
                        </td>
                        <td class='swimmer'>
                            <div>
                            {#each swimmer.parents as parent}
                                {parent.nombre} {parent.apellido}<br>
                            {/each}
                            </div>
                        </td>
                        <td class='phone'>
                            {#each swimmer.parents as parent}
                                {#if parent.phone}
                                    <a href="tel:{parent.phone.replace(/\D/g, '')}">
                                        {parent.phone}
                                    </a>
                                {/if}
                                <br>
                            {/each}
                        </td>
                        <td class='email'>
                            {#each swimmer.parents as parent}
                                {#if parent.email}
                                    <a href="mailto:{parent.email}">
                                        {parent.email}
                                    </a>
                                {/if}
                                <br>
                            {/each}
                        </td>
                        <td>
                            <button class='sb inv' on:click={()=>editSwimmer(swimmer)}>
                                ✏️
                            </button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </ScrollBox>
    {#if viewModal}
        <EditSwimmer swimmer={selectedSwimmer} {saveFunction} {closeModal} />
    {/if}
</div>

<style>
    a {
        text-decoration: none;
        color: var(--team-color);
    }
    table.list {
        font-size: 0.8em;
    }
    div.flex-row {
        display: flex;
        gap: 2em;
    }
    td.swimmer {
        padding-left: 0.2em;
        width: 16em;
    }
    td.phone {
        padding: 0 0.5em;
        width: 8em;
    }
    div.modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    button.inv.sb {
        text-align: left;
    }
</style>