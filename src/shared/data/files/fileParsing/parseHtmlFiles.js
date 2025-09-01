import { Swim, timeToNumber } from "@models/Swim";
import Relay from "@models/Relay";

function parseHtmlResultsFile(meet, file) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(file.contents, "text/html");

    const events = doc.querySelectorAll('div.cell');
    events.forEach(eventElement => {

        const eventHeader = eventElement.querySelector('h4');
        const eventName = eventHeader ? eventHeader.textContent.trim() : '';
        const match = eventName.match(/Event (\d+) - (.+)/);
        const eventNumber = match ? parseInt(match[1], 10) : null;
        const eventDescription = match ? match[2] : '';

        if (eventNumber !== null) {
            const event = meet.events[eventNumber - 1];
            // Check if the event description contains the word "Relay"
            const isRelay = eventDescription.includes("Relay");

            const resultsTable = eventElement.querySelector('table');
            if (resultsTable) {
                const rows = resultsTable.querySelectorAll('tbody > tr:not(:first-child)');
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    const swimmerDetails = cells[1];
                    let result = timeToNumber(cells[3].textContent.trim());
                    
                    let dq = false;
                    let place = cells[0].textContent.trim();
                    
                    if (place === 'DQ'){
                        result = 9996;
                        dq = {code: '', description: ''};
                        place = '';
                    } else if (place === 'NS'){
                        result = 9997;
                        place = '';
                    }

                    if (isRelay){
                        const newRelay = addHtmlRelay(swimmerDetails, result, event, meet);
                    }
                    else if (!isRelay) {
                        const swimmer = addHtmlSwimmer(event, swimmerDetails.textContent.trim());
                        const seed = timeToNumber(cells[2].textContent.trim());

                        let newSwim = new Swim({swimmer, event, meet, seed, result, place, dq, type:'results'});
                    }
                });
            }
        }
    });
}

function addHtmlRelay(swimmerDetails, result, event, meet) {
    const teamName = swimmerDetails.querySelector('span').textContent;
    const team = meet.getTeamByAbbreviation(teamName, 'name');
    const swimmerText = swimmerDetails.innerHTML.split('<br>');
    let swimmers = swimmerText[1].split('), ').map(s => {
        return addHtmlSwimmer(event, s + '(' + team.abbr + ')');
    });
    let swims = [];
    if (swimmers.length === event.legs.length) {
        swims = event.legs.map((leg, index) =>{
            return new Swim({
                relayLeg: true, 
                event: event,
                distance: leg.distance, 
                stroke: leg.stroke, 
                swimmer: swimmers[index], 
                meet
            });
        });
    }
    const newRelay = new Relay({result, swims, event, team});
    newRelay.addRelay();
    return newRelay;
}

function addHtmlSwimmer(event, swimmerDetailString) {
    // Manually splitting swimmer details
    const parts = swimmerDetailString.split(/[,()]+/).map(s => s.trim());
    
    let suffix = '';
    let apellido, nombre, middleInitial, age, teamAbbr;

    if (parts[1].toLowerCase() === 'jr' || parts[1].toLowerCase() === 'jr.') {
        suffix = parts[1];
        apellido = parts[0] + ', ' + suffix; // Concatenate suffix to apellido
        [nombre, middleInitial] = parseName(parts[2]);
        age = parts[3];
        teamAbbr = parts[4];
        //console.log(apellido, nombre, middleInitial, age, teamAbbr);
    } else {
        apellido = parts[0];
        [nombre, middleInitial] = parseName(parts[1]);
        age = parts[2];
        teamAbbr = parts[3];
    }

    const team = event.meet.getTeamByAbbreviation(teamAbbr);
    if (team) {
        const newSwimmer = {
            dob: '',
            nombre,
            apellido,
            nickname: '',
            middleInitial,
            gender: event.gender,
            id: '',
            ussID: '',
            age,
            team,
            key: nombre + apellido + age,
            //...(suffix && { suffix }) // Conditionally include the suffix property
        };
        return team.addSwimmer(newSwimmer);
    }
}

function parseName(name){
    let names = name.split(' ');
    if (names.length === 1) return [names[0], ''];
    const middleInitial = names.pop();
    return [names.join(' '), middleInitial];
}

export { parseHtmlResultsFile }