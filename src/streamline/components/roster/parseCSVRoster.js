import { MY_TEAM } from "@src/stores";
import { get } from "svelte/store";
import { formatPhone } from "@models/cleanData";
const myTeam = get(MY_TEAM);

export function parseCSVRoster(file) {
    const data = parseCSV(file[0].contents); // Reuse the parseCSV function from above
    //let swimmers = [];
    data.forEach(csvSwimmer => {
        //const swimmerKey = csvSwimmer.apellido + csvSwimmer.nombre + csvSwimmer.age;
        const swimmer = myTeam.findSwimmerByName(csvSwimmer.apellido, csvSwimmer.nombre);
        if (swimmer){
            swimmer.homePhone = csvSwimmer.HomePhone || '';
            swimmer.middleInitial = csvSwimmer.middleInitial || '';
            swimmer.parents = [];
            for (let p = 1; p <= 3; p++) {
                if (csvSwimmer['Parent' + p + '_FirstName'] !== '') {
                    swimmer.parents.push({
                        nombre: csvSwimmer['Parent' + p + '_FirstName'],
                        apellido: csvSwimmer['Parent' + p + '_LastName'],
                        phone: formatPhone(csvSwimmer['Parent' + p + '_Phone']) || '',
                        email: csvSwimmer['Parent' + p + '_Email'] || ''
                    });
                }
            }
            console.log('Updating existing swimmer:', swimmer);
        }
    });
    //myTeam.swimmers = swimmers.sort((a, b) => a.nameSort(b));
}

export function parseCSV(csvString) {
    const lines = csvString.trim().split('\n');
    const headers = lines[0].split(',');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentline = lines[i].split(',');

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = currentline[j] ? currentline[j].trim() : '';
        }
        result.push(obj);
    }
    return result;
}
