<script>
    import Relay from '@models/Relay';
    import RelayEntriesTable from './RelayEntriesTable.svelte';
    import RelayResultsTable from './RelayResultsPlannerTable.svelte';
    import NumberPicker from './NumberPicker.svelte';
    import RelayModal from './RelayModal.svelte';
    import { fastestNRelays, findRelaysByTeams, nToL } from './relayUtils';
    import {selectedRelayEventStore, relayOptionsStore, selectedMeetStore, triggerRefresh, pointsStore} from '@src/stores';
    import { NO_SWIM } from '@models/Swim';
    $: selectedRelayEvent = $selectedRelayEventStore;
    $: relayOptions = $relayOptionsStore;
    $: selectedMeet = $selectedMeetStore;
    $: selectedMeet.sortAllSwimmers();

    let relayResults = [];
    let potentialRelays = [];
    let nEntries = 1;
    //let visibleTeams = [];
    let openModal = false;

    let previousSelectedRelayEvent;

    $: {
        if (selectedRelayEvent && selectedRelayEvent !== previousSelectedRelayEvent) {
            openModal = false; // Close the modal because a *new* relay event was selected
        }
        previousSelectedRelayEvent = selectedRelayEvent;
    }

    $: unavailableSwimmersMap = selectedRelayEvent?.unavailableSwimmers || new Map();
    $: unavailableSwimmersArray = Array.from(unavailableSwimmersMap.values());
    $: absentSwimmers = Array.from(selectedMeet?.absences.values()) || [];

    $: if (selectedRelayEvent) {
        //visibleTeams = selectedRelayEvent.meet.teams;
        if (nEntries === 1) nEntries = selectedRelayEvent.maxEntries;
        relayResults = findRelaysByTeams(selectedRelayEvent, selectedMeet.teams);
    }

    $: selectedRelayEvent, 
        //visibleTeams, 
        unavailableSwimmersArray, 
        relayOptions, 
        nEntries, 
        selectedRelayEvent?.planning, 
        updateFastestRelays();
    $: selectedRelayEvent?.planning,
        updateLabelsAndPoints();

    function updateFastestRelays() {
        let usedSwimmers = [];
        selectedRelayEvent.planning.forEach(relay => {
            usedSwimmers.push(...relay.swims.filter(swim => swim !== NO_SWIM)
                .map(swim => swim.swimmer));
            });

        let newRelays = fastestNRelays(
            selectedRelayEvent,
            selectedMeet.teams,
            [...unavailableSwimmersArray, ...usedSwimmers, ...absentSwimmers], // Use the array derived from the Map
            relayOptions,
            nEntries
        );
        newRelays.sort((a, b) => a.seed - b.seed); // Sort the relays by time
        potentialRelays = newRelays;
    }

    function updateLabelsAndPoints() {
        let relaysByTeam = selectedMeet.teams.map(team => {
            return selectedRelayEvent.planning.filter(relay => relay.team.abbr === team.abbr);
        });
        relaysByTeam.forEach(relays => {
            relays.forEach((relay, index) => {
                relay.label = nToL(index + 1);
            });
        });
        selectedMeet.calculateScore('planning');
        triggerRefresh(pointsStore);
    }

    function addEntry(relay) {
        let newRelay = new Relay({
            ...relay, 
            event: selectedRelayEvent,
            hypothetical: true, 
            type: 'planning'
        });
        if (!newRelay.seed) newRelay.seed = newRelay.result;
        newRelay.edit = new Relay({...newRelay});;
        
        if (newRelay.addRelay()) selectedRelayEventStore.set(selectedRelayEvent);
    }

    function openExcludeModal() {
        openModal = true;
    }
    
    function toggleAvailability(swimmer) {
        selectedRelayEventStore.update(event => {
            if (!event.unavailableSwimmers || !(event.unavailableSwimmers instanceof Map)) {
                 console.warn("selectedRelayEvent.unavailableSwimmers was not a Map. Initializing.");
                 event.unavailableSwimmers = new Map();
            }
            if (event.unavailableSwimmers.has(swimmer.key)) {
                event.unavailableSwimmers.delete(swimmer.key);
            } else {
                event.unavailableSwimmers.set(swimmer.key, swimmer);
            }
            return event;
        });
    }
</script>

{#if openModal}
    <RelayModal
        closeModal={()=>openModal=false}
        unavailableSwimmers={unavailableSwimmersMap} 
        {toggleAvailability}
    />
{/if}

<div>
    <div class='relayName'>
        {selectedRelayEvent.name} Entries
    </div>

    <RelayEntriesTable />

    <div class='title'>
        Potential Relays Based on Fastest Splits
    </div>
    <div class='tools'>
        <NumberPicker text='Relay teams'
            n = {nEntries} 
            updateN={(n) => nEntries = n} 
            showN={(r) => nToL(r)}
        />
        {#if selectedRelayEvent.stroke.abbr === 'MRL'}
            <NumberPicker text='# of options per team'
                n = {relayOptions}
                updateN = {(n) => relayOptionsStore.set(n)}
            />
        {/if}
        <button class='sb tool' on:click={openExcludeModal}>
            ❌🏊 Unavailable Swimmers
        </button>
    </div>
    <RelayResultsTable relays={potentialRelays} {addEntry} />
    
    <div class='title'>
        Past Relay Results
    </div>
    <RelayResultsTable relays={relayResults} {addEntry} type='result' />
</div>

<style>
    div.relayName {
        margin-bottom: 0.5em;
    }

    div.tools {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        gap: 1em;
        padding-bottom: 0.5em;
    }
    
    button.sb.tool {
        margin-bottom: 0.5em;
    }

    div.title {
        margin: 1.2em 0 0.2em 0;
    }
</style>
