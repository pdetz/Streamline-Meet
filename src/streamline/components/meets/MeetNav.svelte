<script>
    import { updateParseObject } from "@data/ParseHelpers";


    import ScrollBox from "@shared/components/ScrollBox.svelte";
    import Tile from "@shared/components/Tile.svelte";
    import { updateMeetViewStore, selectedMeetStore } from '@src/stores.js';

    function setView(view) {
        updateMeetViewStore($selectedMeetStore, view);
    }
    let currentMeet;

    $: meet = $selectedMeetStore;
    $: if (meet) currentMeet = {...meet };

    function updateMeetInformation() {
        console.log(meet);
        updateParseObject(meet, 'Meet', {
            name: currentMeet.name,
            abbr: currentMeet.abbr,
            startDate: currentMeet.startDate,
            endDate: currentMeet.startDate,
            arrivalTime: currentMeet.arrivalTime,
            pool: currentMeet.pool,
            address: currentMeet.address,
            mapLink: currentMeet.mapLink,
            instructions: currentMeet.instructions,
            instrucciones: currentMeet.instrucciones,
            description: currentMeet.description,
        }).then(() => {
            console.log('Meet information updated successfully.');
        }).catch(error => {
            console.error('Error updating meet information:', error);
        });
    }
</script>

<ScrollBox>
    <div class='v-flex'>
        <Tile size={{width: '32em', height: 'auto'}}>
            <div slot='title'>
                Meet Information
            </div>
            <table class="list">
                <tbody>
                    <tr>
                        <td>Meet Name:</td>
                        <td><input type='text' bind:value={currentMeet.name} placeholder='Meet Name' /></td>
                    </tr>
                    <tr>
                        <td>Meet Abbr:</td>
                        <td><input type='text' bind:value={currentMeet.abbr} placeholder='Abbreviation' /></td>
                    </tr>
                    <tr>
                        <td>Meet Date:</td>
                        <td><input type='text' bind:value={currentMeet.startDate} placeholder='Date' /></td>
                    </tr>
                    <tr>
                        <td>Arrival Time:</td>
                        <td><input type='text' bind:value={currentMeet.arrivalTime} placeholder='Arrival Time' /></td>
                    </tr>
                    <tr>
                        <td>Pool:</td>
                        <td><input type='text' bind:value={currentMeet.pool} placeholder='Pool' /></td>
                    </tr>
                    <tr>
                        <td>Adress:</td>
                        <td><input type='text' bind:value={currentMeet.address} placeholder='Adress' /></td>
                    </tr>
                    <tr>
                        <td>Map Link:</td>
                        <td> <input type='text' bind:value={currentMeet.mapLink} placeholder='Map Link' /></td>
                    </tr>
                    <tr>
                        <td>Description:</td>
                        <td><input type='text' bind:value={currentMeet.description} placeholder='Description' /></td>
                    </tr>
                    <tr>
                        <td>Instructions:</td>
                        <td><textarea bind:value={currentMeet.instructions} placeholder='Instructions' /></td>
                    </tr>
                    <tr>
                        <td>Instrucciones:</td>
                        <td><textarea bind:value={currentMeet.instrucciones} placeholder='Instrucciones' /></td>
                    </tr>
                </tbody>
            </table>
            <button class='sb tool' on:click={updateMeetInformation}>
                Update Meet Information
            </button>
        </Tile>
        <div class='h-flex'>
        <Tile size={{width: '15em', height: 'auto'}}>
            <div slot='title'>
                Meet Planning
            </div>
            <button class='sb tool' on:click={()=>setView('planning')}>
                Plan Entries
            </button>
            
            <button class='sb tool'>
                Export Entries as HY3
            </button>
            
            <button class='sb tool' on:click={()=>setView('Line Ups')}>
                View Line Ups
            </button>
        </Tile>

        <Tile size={{width: '15em', height: 'auto'}}>
            <div slot='title'>
                The Day Before
            </div>
            <button class='sb tool'>
                Download Entries File
            </button>
            
            <button class='sb tool'>
                View Heat Sheet
            </button>
            
            <button class='sb tool' on:click={()=>setView('Entries')}>
                View Meet Entries
            </button>
        </Tile>
    </div>
    </div>
</ScrollBox>

<style>
    .h-flex {
        display: flex;
        gap: 1rem;
        padding: 1rem;
    }

    .v-flex {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .tool {
        width: calc(100% - 1em);
    }
</style>