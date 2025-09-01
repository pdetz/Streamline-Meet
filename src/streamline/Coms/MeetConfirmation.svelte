<script>
    import { updateParseObject } from "@data/ParseHelpers";
    import { STROKES } from "@models/LeagueData";
    import Tile from "@shared/components/Tile.svelte";
    import { formatMMDDYYYYToLongDate } from "@models/cleanData";

    export let meetConfirmation = null; // This is the ID string
    export let meet = {name: 'No Meet Loaded', date: '06012025'}; // This is the meet object
    export let numberOfEvents = 3;
    export let message = '';
    export let swimmers = [];
    export let meets = [{
        name: 'No Meet Loaded',
        date: '06012025',
        meetType: 'B', // 'A' for All Star, 'B' for regular meets
    }];

    let notes = meetConfirmation?.notes || '';
    let attending = meetConfirmation?.attending || null;
    const strokes = STROKES.slice(1, 6);
    let selectedStrokes = meetConfirmation?.strokes || [];
    let confirmed = false;

    function setAttending(value) {
        attending = value;
    }
    function selectStroke(stroke) {
        const index = selectedStrokes.indexOf(stroke.abbr);
        if (index !== -1) {
            selectedStrokes = selectedStrokes.filter(s => s !== stroke.abbr);
        } else if (selectedStrokes.length < numberOfEvents) {
            selectedStrokes = [...selectedStrokes, stroke.abbr];
        }
    }

    function selectedStrokesDisplay() {
        return selectedStrokes.length > 0 ?
            selectedStrokes.map(abbr => strokes.find(s => s.abbr === abbr).name)
                .join(', ') : 'None';
    }

    async function confirmAttendance() {
        confirmed = true;
        console.log(meetConfirmation, meet);
        await updateParseObject(meetConfirmation, 'MeetConfirmation', {
            notes: notes,
            attending: attending,
            strokes: selectedStrokes,
        }).then(() => {
            console.log('Meet confirmation updated successfully');
        }).catch(error => {
            console.error('Error updating meet confirmation:', error);
        });
    }
</script>

<div class="meet-confirmation-container">
    <Tile>
    <div slot='title' class='title'>
        Meet Confirmation for
        {meet.name} <br>
            {meetConfirmation.preferredName} {meetConfirmation.apellido}
    </div>

    <div class='inner-container'>
    {#if !confirmed}
        Will {meetConfirmation.nombre} be available to swim at the meet on {formatMMDDYYYYToLongDate(meet.date)}?
        <br>
        ¿Asistirá {meetConfirmation.nombre} a esta competencia el {formatMMDDYYYYToLongDate(meet.date)}?
        <div class='attendance-buttons'>
            <button class='sb' class:yes={attending === true}
                on:click={() => setAttending(true)}>
                Yes, attending <br>
                Sí, asistir
            </button>
            <button class='sb no' class:no={attending === false}
                on:click={() => setAttending(false)}>
                No, not attending <br>
                No, no asistir
            </button>
        </div>
        {#if attending}
            {#if meet.meetType === 'B'}
            <div class='strokes'>
                <p>Great! Please choose {numberOfEvents} events. Click the buttons to add/remove strokes:</p>
                <p>Genial! Elige {numberOfEvents} eventos por favor. Haga click en los botones para agregar/quitar estilos:</p>

                {#each strokes as stroke}
                <button
                    class={`sb ${selectedStrokes.includes(stroke.abbr) ? stroke.abbr : ''}`}
                    on:click={() => selectStroke(stroke)}
                >
                    {stroke.name}
                </button>
                {/each}
            </div>
            {/if}

            <div class='notes'>
                <p>Is there anything else you would like the coaches to know, such as injuries, scheduling conflicts, etc? </p>
                <p>¿Hay algo más que le gustaría que los entrenadores supieran, como lesiones, conflictos de programación, etc.?</p>
                <textarea class='notes' bind:value={notes} rows="4" cols="50"
                    placeholder="Your message / su mensaje..."></textarea>
            </div>
            
            <p>Please click the button to confirm attendance.<br>
            Por favor haga clic en el botón para confirmar la asistencia.</p>
            <button class='sb tool' on:click={confirmAttendance}>
                Confirm Attendance <br>
                Confirmar asistencia
            </button>
        {:else if attending === false}
            <p>Thank you for letting us know you won't be attending. Please click the button to confirm absence.<br>
                Gracias por informarnos que no asistirá. Por favor haga clic en el botón para confirmar la ausencia.</p>
            
            <button class='sb tool' on:click={confirmAttendance}>
                Confirm Absence <br>
                Confirmar ausencia
            </button>
        {/if}
    {#if attending !== null && !confirmed}

    {/if}
{/if}
{#if confirmed}
    {#if attending}
        <button class='sb confirmed'>
            Attendance for {meetConfirmation.preferredName} confirmed! <br>
            Asistencia confirmada para {meetConfirmation.preferredName}!
        </button>
        <p>Thank you for confirming your attendance!</p>
        <p>¡Gracias por confirmar su asistencia!</p>
        {#if meet.meetType === 'B'}
            <p>Selected Strokes: {selectedStrokesDisplay()}</p>
        {:else if meet.meetType === 'A'}
            <p>The coaches will send the meet line ups by Thursday morning. Please check your email to see if your swimmer is selected.</p>
            <p>Los entrenadores enviarán las alineaciones de la competencia el jueves por la mañana. Por favor, revise su correo electrónico para ver si su nadador está seleccionado.</p>
        {/if}
        
        <p>Notes: {notes}</p>

    {:else}
        <p> Thank you for letting use know you won't be attending. Hope you see you at the next meet!</p>
        <p>Gracias por informarnos que no asistirá. ¡Esperamos verle en la próxima competencia!</p>
    {/if}
        <button class='sb edit' on:click={confirmed=false}>
            Edit Confirmation <br>
            Editar confirmación
        </button>
{/if}
    </div>
</Tile>
</div>

<style>
    button.sb.confirmed {
        background-color: #2a2;
        color: #fff;
    }
    button.sb.edit {
        color: #999;
    }
    p {
        margin: 0.5rem 0;
    }
    div.title {
        padding: 0.5rem;
    }
    .meet-confirmation-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        max-width: 40em;
        margin: 0 auto;
    }
    .inner-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        width: 100%;
    }
    .attendance-buttons {
        display: flex;
        flex-direction: row;
        gap: 1rem;
    }
    button.sb.yes {
        background-color: #0f4;
        color: #000;
    }
    button.sb.no {
        background-color: #f44;
        color: #000;
    }
    .strokes {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        border: 1px solid var(--border-color);
        padding: 0.5rem 1rem;
        max-width: 20em;
    }
    button.sb.FR {
        background-color: var(--FR);
        color: #000;
    }
    button.BR {
        background-color: var(--BR);
        color: #000;
    }
    button.BK {
        background-color: var(--BK);
        color: #000;
    }
    button.FL {
        background-color: var(--FL);
        color: #000;
    }
    button.IM {
        background-color: var(--IM);
        color: #000;
    }
    div.notes {
        text-align: left;
    }
    textarea.notes {
        width: 100%;
        padding: 0.5rem;
        border-radius: 0.3rem;
        border: 1px solid var(--border-color);
        background-color: var(--bg-color-1);
        color: var(--text-color-1);
        margin-top: 0.5rem;
    }
</style>