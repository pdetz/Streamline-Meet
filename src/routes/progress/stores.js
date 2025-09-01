import { writable } from 'svelte/store';

export const meetStore = writable([]);
export const meetConfirmationStore = writable();

import { loadParseObjectById } from '@data/LoadParseObjects'; // Make sure this path is correct
import Parse from 'parse/dist/parse.min.js';

export async function loadMeetConfirmation(meetConId) {
    let meetConfirmation = null;
    let meet = null;
    let error = null;

    if (meetConId) {
        try {
            // Fetch MeetConfirmation
            const meetCon = await loadParseObjectById('MeetConfirmation', meetConId);
            meetConfirmation = meetCon;

            if (meetConfirmation && meetConfirmation.meetId) {
                // Fetch associated Meet
                
                const query = new Parse.Query('Meet');
                const meetObject = await query.get(meetConfirmation.meetId);
                
                meet = {name: meetObject.get('name'), id: meetObject.id, date: meetObject.get('startDate')};
            } else {
                console.warn("MeetConfirmation found but no meetId for:", meetConId);
            }
        } catch (e) {
            console.error("Error loading meet details in +page.js:", e);
            error = e.message || "Failed to load meet details.";
        }
    } else {
        console.warn("No 'i' parameter (meetConId) found in URL search params.");
    }
    console.log("Loaded meet:", meet, "and meetConfirmation:", meetConfirmation);
    meetStore.set(meet);
    meetConfirmationStore.set(meetConfirmation);
}