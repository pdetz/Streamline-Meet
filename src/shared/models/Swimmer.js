import { NO_SWIM, Swim } from "./Swim";
import { MY_TEAM } from "@src/stores";
import { get } from "svelte/store";

export class Swimmer {
    constructor(swimmer) {
        this.dob = swimmer.dob;
        this.nombre = swimmer.nombre;
        this.apellido = swimmer.apellido;
        this.nickname = swimmer.nickname || '';
        this.preferredName = this.getPreferredName();
        this.middleInitial = swimmer.middleInitial;
        this.gender = swimmer.gender;
        this.id = swimmer.id;
        this.ussID = swimmer.ussID || '';
        this.age = parseInt(swimmer.age);
        this.team = swimmer.team;
        this.key = swimmer.nombre + swimmer.apellido + swimmer.age;
        this.key = this.key.toLowerCase();
        if (swimmer.suffix) {
            this.suffix = swimmer.suffix;
            this.display = `${this.apellido}, ${this.suffix}, ${this.preferredName} (${this.age})`;
        } else {
            this.display = `${this.apellido}, ${this.preferredName} (${this.age})`;
        }
        this.resultsDisplay = this.apellido + ', ' + this.preferredName + ' ' + this.middleInitial;
        this.displayShort = `${this.apellido}, ${this.nombre[0]}`;
        this.nombreApellido = `${this.nombre} ${this.apellido}`;
        this.currentId = swimmer.currentId || '';

        this.planning = swimmer.planning || [];
        this.entries = swimmer.entries || [];
        this.results = swimmer.results || [];
        this.parents = [];
        this.meetConfirmations = swimmer.meetConfirmations || [];
    }

    isAbsent(meet) {
        const swimmerPlan = meet.meetPlan.getSwimmerPlan(this);
        if (swimmerPlan) return swimmerPlan.absent;
        return false;
    }

    getPreferredName() {
        return (this.nickname === '') ? this.nombre : this.nickname;
    }

    nameSort(swimmer) {
        return this.display.localeCompare(swimmer.display);
        const apellidoComparison = this.apellido.localeCompare(swimmer.apellido);
        if (apellidoComparison !== 0) return apellidoComparison;

        return this.nombre.localeCompare(swimmer.nombre);
    }

    isMyTeam() {
        const myTeam = get(MY_TEAM);
        return this.team.abbr === myTeam.abbr;
    }

    addSwim(swim) {
        if (!this.findSwim(swim)) this[swim.type].push(swim);
    }

    newEventEntry(event, isOfficial=false) {
        let seed = this.best(event, isOfficial).result;
        if (!seed || seed > 9990) seed = 9998;
        let exhibition = false;
        const connectedMeet = event.meet.connectedMeet;
        if (connectedMeet) {
            const connectedMeetSwims = this.swimsByMeet(connectedMeet, 'results')
                                        .find(s => s.event.stroke.abbr === event.stroke.abbr);
            exhibition = connectedMeetSwims && connectedMeetSwims.result < 9990;                            
        }
        return new Swim({swimmer: this, event, meet: event.meet, seed, type: 'planning', exhibition});
    }

    removeSwim(swim) {
        let entryOrResult = swim.result === null ? "entries" : "swims";
        this[entryOrResult] = this[entryOrResult].filter(s => s.key !== swim.key);
    }

    removeSwims(meet, type = 'planning') {
        for (let i = this[type].length - 1; i >= 0; i--) {
            const swim = this[type][i];
            if (swim.meet.objectId === meet.objectId) {
                swim.removeSwim();
                console.log('removing', swim);
            }
        }
    }

    findRelayEvents(meet, type = 'planning') {
        let relayEvents = [];
        meet.relayEvents.forEach(event => {
            event[type].forEach(relay => {
                relay.swims.forEach(swim => {
                    if (swim.swimmer.currentId === this.currentId) relayEvents.push(swim);
                });
            });
        });
        return relayEvents;
    }

    findSwim(swim) {
        return this[swim.type].some(s => swim.key === s.key);
    }

    findSwimByEvent(event, type='results') {
        return this[type].find(swim => swim.event.key === event.key);
    }

    best(event, isOfficial=false) {
        // Filter swims to find those that match the event's stroke and distance
        let matchingSwims = this.results.filter(swim => swim.stroke === event.stroke && swim.distance === event.distance && swim.result !== null);
        if (isOfficial) matchingSwims = matchingSwims.filter(swim => swim.meet.is_official);

        if (matchingSwims.length === 0) return NO_SWIM;

        // Find the swim with the lowest result among the matching swims
        const bestResultSwim = matchingSwims.reduce((best, current) => {
            return (best.result < current.result) ? best : current;
        }, matchingSwims[0]); // Initialize with the maximum possible number to ensure any real result is lower

        return bestResultSwim;
    }

    bestSplit(event) {
        const bestSwim = this.best(event);
        if (bestSwim !== NO_SWIM) {
            return new Swim({
                swimmer: this,
                type: 'planning',
                event: event,
                meet: bestSwim.meet,
                distance: event.distance,
                stroke: event.stroke,
                seed: bestSwim.result,
                result: null,
                converted: bestSwim.converted,
                relayLeg: true,
                add: false
            });
        }
        const matchingSwims = this.results.filter(swim => swim.stroke === event.stroke && swim.result !== null);
        if (matchingSwims.length === 0) {
            return new Swim({
                swimmer: this,
                type: 'planning',
                event: event,
                meet: {course: 'S', name: '', date: '', abbr: ''},
                distance: event.distance,
                stroke: event.stroke,
                seed: 9999,
                result: null,
                converted: false,
                relayLeg: true,
                add: false
            });
        }

        // Find the swim with the lowest result among the matching swims
        const bestResultSwim = matchingSwims.reduce((best, current) => {
            return (best.result < current.result) ? best : current;
        }, matchingSwims[0]);

        const bestResultConverted = bestResultSwim.convertedTime(event.distance);
        return new Swim({
            swimmer: this,
            type: 'planning',
            event: event,
            meet: bestResultSwim.meet,
            distance: event.distance,
            stroke: event.stroke,
            seed: bestResultConverted,
            result: null,
            converted: true,
            relayLeg: true,
            add: false
        });
    }

    findSwimByDate(event, date) {
        const allSwims = [...this.results];
        const matchingSwims = allSwims.filter(swim => swim.date === date && swim.stroke === event.stroke && swim.distance === event.distance && swim.result !== null);
        
        if (matchingSwims.length === 0) return NO_SWIM;

        return matchingSwims[0];
    }

    findEarliestSwim(event){
        const allSwims = [...this.results];
        let matchingSwims = allSwims.filter(swim => swim.stroke === event.stroke && swim.distance === event.distance && swim.result !== null && swim.result < 9990);
        if (matchingSwims.length === 0) return NO_SWIM;
        matchingSwims.sort((a, b) => a.date - b.date);
        return matchingSwims[0];
    }

    swimsByMeet(meet, type = 'results') {
        const swims = this[type].filter(swim => swim.meet.objectId === meet.objectId)
            .sort((a, b) => a.event.n - b.event.n);
        return swims;
    }

    displayBest(event, isOfficial=false) {
        let bestSwim = this.best(event, isOfficial);
        return bestSwim.display();
    }

    points() {
        return this.results.reduce((totalPoints, swim) => {
            return totalPoints + swim.points;
        }, 0);
    }

    getStatus(meet) {
        if (!meet.meetPlan) return "Unconfirmed";
        return meet.meetPlan.getSwimmerStatus(this);
    }

    upsertMeetConfirmation(meetConfirmation) {
        const index = this.meetConfirmations.findIndex(mc => mc.swimmerKey === meetConfirmation.swimmerKey && mc.meetId === meetConfirmation.meetId);  
        if (index === -1) {
            this.meetConfirmations.push(meetConfirmation);
        } else {
            this.meetConfirmations[index] = meetConfirmation; // Update existing confirmation
        }
    }
    getMeetConfirmation(meetId) {
        return this.meetConfirmations.find(mc => mc.meetId === meetId);
    }
    getMeetConfirmations(meets) {
        console.log("Getting meet confirmations for meets:", meets);
        return meets.map(meet => this.getMeetConfirmation(meet.objectId)).filter(mc => mc);
    }
}

export class NoSwimmer {
    constructor(team) {
        this.dob = '';
        this.nombre = '';
        this.apellido = '';
        this.preferredName = '';
        this.gender = '';
        this.id = '';
        this.team = team;
        this.key = 'no_swimmer' + team.abbr;
        this.display = '';
    }
    isMyTeam() {
        const myTeam = get(MY_TEAM);
        return this.team.abbr === myTeam.abbr;
    }
}