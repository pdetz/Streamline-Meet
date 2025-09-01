<script>
    import { updateParseObject } from "@data/ParseHelpers";
    import { STROKES } from "@models/LeagueData";
    import Tile from "@shared/components/Tile.svelte";
    import { formatMMDDYYYYToLongDate } from "@models/cleanData";

    export let meetConfirmation = null;
    export let meet = {name: 'No Meet Loaded', date: '06012025'}; // This is the meet object
    export let numberOfEvents = meetConfirmation?.numberOfEvents; // Default to 2 events if not set
    export let message = '';
    export let swimmers = [];
    export let meets = [{
        name: 'No Meet Loaded',
        date: '06012025',
        meetType: 'B', // 'A' for All Star, 'B' for regular meets
    }];

    let showModal = false;

    console.log('Meet Confirmation Form Loaded');
    console.log('Meet Confirmation:', meetConfirmation);
    console.log('Meet:', meet);
    console.log('Number of Events:', numberOfEvents);
    const disallowedStrokes = meetConfirmation?.disallowedStrokes || [];

    let notes = meetConfirmation?.notes || '';
    let attending = meetConfirmation?.attending || null;
    const strokes = STROKES.slice(1, 6).
        filter(stroke => 
            !disallowedStrokes.includes(stroke.abbr));
    let selectedStrokes = meetConfirmation?.strokes || [];
    let confirmed = false;
    if (attending !== null && attending !== undefined) {
        confirmed = true;
    }

    async function setAttending(value) {
        attending = value;
        await updateParseObject(meetConfirmation, 'MeetConfirmation', {
            attending: value
        }).then(() => {
            console.log('Meet confirmation updated successfully');
        }).catch(error => {
            console.error('Error updating meet confirmation:', error);
        });
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
        if (attending && meet.date === '07162025') showModal = true;
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

    async function closeModal(help) {
        showModal = false;
        await updateParseObject(meetConfirmation, 'MeetConfirmation', {
            help: help || false
        }).then(() => {
            console.log('Meet confirmation updated successfully');
        }).catch(error => {
            console.error('Error updating meet confirmation:', error);
        });
    }
</script>

{#if showModal}
    <div class="modal-backdrop">
        <div class="modal-content">

            <p style="color: #ff0; text-align: center;">
                We need parents to help at B Champs! Please click here to sign up.
                <br>¡Necesitamos padres que ayuden en los B Champs! Haz clic aquí para inscribir.
            </p>

            <div style="display: flex; justify-content: center; gap: 10px; margin-top: 20px;">
                <a href="https://glenmont-gators.swimtopia.com/swim_meets"
                   target="_blank" rel="noopener noreferrer"
                   style="text-decoration: none;">
                    <button class="sb tool yes" on:click={() => closeModal(true)}>
                        Yes, I will help <br>
                        Sí, voy a ayudar
                    </button>
                </a>
                <button class="sb tool no" on:click={() => closeModal(false)}>
                    No, I can't help out <br>
                    No, no puedo ayudar
                </button>
            </div>
        </div>
    </div>
{/if}

<div class="meet-confirmation-container">
    <Tile>
    <div slot='title' class='title'>
        Meet Confirmation for
        {meet.name} <br>
        <hr class="hr">
        <div class="meet-info">
            <span class="bold">Date / Fecha:</span> {formatMMDDYYYYToLongDate(meet.date)}<br>
            <span class="bold">Warm-ups / Calentamiento:</span> {meet.arrivalTime} <br>
            <span class="bold">Location / Ubicacion:</span> <br>
            <a href="{meet.mapLink}" target="_blank" rel="noopener noreferrer">
                {meet.pool}<br>
                {meet.address}
            </a>
        </div>
    </div>

    <div class='inner-container'>
    {#if !confirmed && numberOfEvents > 0}
        <div>
            Will <span class='name'>{meetConfirmation.preferredName}</span> 
            be available to swim at this meet?
        </div>
        <div>
            ¿Asistirá <span class='name'>{meetConfirmation.preferredName}</span> 
            a esta competencia?
        </div>
        <div class='attendance-buttons'>
            <button class='sb' class:yes={attending === true}
                on:click={() => setAttending(true)}>
                Yes, attending <br>
                Sí, asistir
            </button>
            <button class='sb' class:no={attending === false}
                on:click={() => setAttending(false)}>
                No, not attending <br>
                No, no asistir
            </button>
        </div>
        {#if attending}
            {#if meet.meetType === 'B' || meet.meetType === 'IS'}
            <div class='strokes'>
                <p>Great! Please choose {numberOfEvents} event(s). Click the buttons to add/remove strokes:</p>
                <p>Genial! Elige {numberOfEvents} evento(s) por favor. Haga click en los botones para agregar/quitar estilos:</p>

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
    {:else if numberOfEvents === 0}
        <p>{meetConfirmation.nombre} is swimming {disallowedStrokes.length} events at Divisionals. 
            You can email Coach Patrick to request events but please consider letting the other swimmers
            have a chance to win.
        </p>
        <p>{meetConfirmation.nombre} está nadando {disallowedStrokes.length} eventos en las Divisionales.
            Puede enviarle un correo electrónico a Coach Patrick para solicitar eventos, pero
             considera permitir que los demás nadadores tengan la oportunidad de ganar.</p>
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
        <p> Thank you for letting use know {meetConfirmation.preferredName} won't be attending. Hope you see you at the next meet!</p>
        <p>Gracias por informarnos que no {meetConfirmation.preferredName} asistirá. ¡Esperamos verle en la próxima competencia!</p>
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
    div.modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        backdrop-filter: blur(5px); /* Adjust the pixel value for more or less blur */
        -webkit-backdrop-filter: blur(5px); /* For Safari support */
    }
    div.modal-content {
        background-color: #000;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        text-align: center;
        border: 2px solid #ff0;
    }
    button.sb.tool.yes {
        background-color: #0f4;
        color: #000;
    }
    button.sb.tool.no {
        background-color: #f44;
        color: #000;
    }
    span.name {
        font-weight: bold;
        color: #2f2;
        display: inline;
    }
    hr {
        color: #888
    }
    a {
        color: #2f2;
    }
    span.bold {
        font-weight: bold;
    }
    div.meet-info {
        font-weight: normal;
    }
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
    button.sb {
        border: 2px solid #888;
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