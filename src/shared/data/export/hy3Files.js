import { addCheckSum, pad, dateAndTime } from "./helpers";
import { AGEDATE } from '@models/LeagueData';

function hy3Roster(team) {

    let fileName = team.name + ' Roster.hy3';

    let A1 = lineA1("03", "Rosters Only", "Hy-Tek, Ltd", "BetterTechnique", team.fullName);
    let C123 = lineC123(team);

    let fileContent = A1 + C123;

    team.swimmers.forEach(swimmer => {
        fileContent += lineD1(swimmer);
    })

    return [fileName, fileContent];
}

function hy3Entries(meet, team, type='entries') {

    let fileName = team.name + ' Entries - ' + meet.name + '.hy3';

    let A1 = lineA1("02", "Meet Entries", "Hy-Tek, Ltd", "BetterTech", team.fullName);
    let B12 = lineB12(meet);
    let C123 = lineC123(team);

    let fileContent = A1 + B12 + C123;

    team.swimmers.forEach(swimmer => {
        const entries = swimmer[type].filter(
            entry => entry.meet.name === meet.name
        );
        if (entries.length > 0) {
            fileContent += lineD1(swimmer);
            entries.forEach(entry => {
                fileContent += lineE1(entry);
            });
        }
    });

    return {name: fileName, contents: fileContent};
}

function lineE1(entry) {
    const swimmer = entry.swimmer;
    const event = entry.event;
    const seedTime = (entry.seed > 9997) ? '0.00S' : entry.seed.toFixed(2) + 'S';
    const exhibition = entry.exhibition ? 'X' : '';
    let e1 = 'E1' + swimmer.gender +
                pad(swimmer.id, -5) +
                pad(swimmer.apellido, 5) +
                pad(swimmer.gender + event.gender, 4) +
                pad(event.distance, -4) + event.stroke.letter +
                pad(event.ageGroup.ages[0], -3) +
                pad(event.ageGroup.ages[ event.ageGroup.ages.length - 1 ], -3) +
                pad('0.00', -10) + pad(event.n, -3) + pad('0S', -10) +
                pad(seedTime, -9) +
                pad(exhibition, -24) +
                pad('', 44);
    //console.log(e1);
    return addCheckSum(e1);
}

function lineD1(swimmer) {
    let d1 = 'D1' + swimmer.gender +
                pad(swimmer.id, -5) +
                pad(swimmer.apellido, 20) +
                pad(swimmer.nombre, 20) +
                pad(swimmer.nickname, 20) +
                pad(swimmer.middleInitial, 1) +
                pad(swimmer.ussID, 19) +
                pad(swimmer.dob, 8) + 
                pad(swimmer.age.toString(), -3) +
                pad('', 29);
    return addCheckSum(d1);
}

function lineC123(team) {
    let c1 = 'C1' + pad(team.abbr, 5)
                + pad(team.fullName, 30)
                + pad(team.name, 16)
                + pad('PV', 66)
                + pad('AGE', 9);
    let c2 = 'C2' + pad(team.fullName, 90)
                + pad('MD          USA USS', 36);
    let c3 = pad('C3', 128);

    return addCheckSum(c1) + addCheckSum(c2) + addCheckSum(c3);
}

function lineB12(meet) {
    let b1 = 'B1' + pad(meet.name, 45) +
                    pad(meet.facility, 45) +
                    meet.startDate + meet.startDate + AGEDATE +
                    pad('', 12);
    let b2 = 'B2' + pad('', 94) + pad('A S   0.00SO', 32);
    return addCheckSum(b1) + addCheckSum(b2);
}

function lineA1(fileFormat, description, vendor, software, licencedTo){
    let a1 = 'A1' + fileFormat +
            pad(description, 25) +
            pad(vendor, 15) +
            pad(software, 14) +
            dateAndTime() +
            pad(licencedTo, 53);
    return addCheckSum(a1);
}

export { hy3Roster, hy3Entries };