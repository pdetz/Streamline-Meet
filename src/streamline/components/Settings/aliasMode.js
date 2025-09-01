import {boyNames, girlNames, apellidos} from './names.js';

export function enableAliasMode(user){
    user.division.name = 'X';

    user.division.teams.forEach((team, index) => {
        user.division.teams[index].name = DivisionX.teams[index].name;
        user.division.teams[index].abbr = DivisionX.teams[index].abbr;
        team.swimmers.forEach(swimmer => {
            let nombre;
            if (swimmer.gender === 'M') {
                nombre = getRandom(boyNames);
            } else {
                nombre = getRandom(girlNames);
            }
            const middleInitial = getRandom(apellidos)[0];
            const apellido = getRandom(apellidos);
            
            swimmer.display = `${apellido}, ${nombre} (${swimmer.age})`;
            swimmer.resultsDisplay = `${apellido}, ${nombre} ${middleInitial}`;
            swimmer.displayShort = `${apellido}, ${nombre[0]}`;
            swimmer.nombreApellido = `${nombre} ${apellido}`;
        });
    });
    user.division.meets.forEach(meet => {
        const meetNameSplit = meet.name.split(' ');
        console.log(meetNameSplit);
        if (meetNameSplit[1] === 'Divisionals'){
            meet.name = 'X Divisionals';
            meet.abbr = 'X DIV';
            return;
        }
        if (meetNameSplit[0] === 'Division') {
            meet.name = 'Division X Relay Carnival';
            meet.abbr = 'X RELAYS';
            return;
        }

        const week = meet.name.split(' - ')[0];
        const w = week.split(' ');
        meet.name = week + ' - ' + meet.teams[0].name + ' at ' + meet.teams[1].name;
        meet.abbr = w[1] + ' - ' + meet.teams[0].abbr + '-' + meet.teams[1].abbr;
    });
}

export function disableAliasMode(user){
    let originalDivisionData;
    const unsubscribe = aliasDivisionStore.subscribe(value => {
        originalDivisionData = value;
    });
    unsubscribe();
    user.division.name = originalDivisionData.name;
    user.division.teams.forEach((team, index) => {
        team.name = originalDivisionData.teams[index].name;
        team.abbr = originalDivisionData.teams[index].abbr;
        team.swimmers.forEach(swimmer => {
            swimmer.display = `${swimmer.apellido}, ${swimmer.nombre} (${swimmer.age})`;
            swimmer.resultsDisplay = `${swimmer.apellido}, ${swimmer.nombre} ${swimmer.middleInitial}`;
            swimmer.displayShort = `${swimmer.apellido}, ${swimmer.nombre[0]}`;
            swimmer.nombreApellido = `${swimmer.nombre} ${swimmer.apellido}`;
        });
    });
}

const DivisionX = {
    name: 'X',
    teams: [
    {
        name: 'White Oak',
        abbr: 'WO'
    },
    {
        name: 'Silver Spring',
        abbr: 'SS'
    },
    {
        name: 'Wheaton',
        abbr: 'W'
    },
    {
        name: 'Olney',
        abbr: 'O'
    },
    {
        name: 'Gaithersburg',
        abbr: 'GB'
    },
    {
        name: 'Potomac Valley',
        abbr: 'PV'
    },
]};

function getRandom(arr) {
    const i = Math.floor(Math.random() * arr.length);
  return arr[i];
}