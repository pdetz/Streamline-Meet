import { dateAndTime } from "@data/export/helpers";
import { LineType } from "./LineType";
import { MY_TEAM } from "@src/stores";
import { get } from "svelte/store";

const A1 = new LineType({           // File information
    prefix: 'A1',
    shared: [
        {loc: [29, 15], key: 'vendor', defaultValue: 'Hy-Tek, Ltd' },
        {loc: [44, 14], key: 'software', defaultValue: 'Streamline' },
        {loc: [58, 17], key: 'dateAndTime', defaultValue: dateAndTime() },
        {loc: [75, 53], key: 'licensedTo' }
    ],
    entries: [
        { loc: [2, 2], key: 'fileCode', defaultValue: '02' }, // Entries value
        { loc: [4, 25], key: 'description', defaultValue: 'Meet Entries' }
    ],
    planning: [
        { loc: [2, 2], key: 'fileCode', defaultValue: '02' }, // Entries value
        { loc: [4, 25], key: 'description', defaultValue: 'Meet Planning' }
    ],
    results: [
        { loc: [2, 2], key: 'fileCode', defaultValue: '07' }, // Results value
        { loc: [4, 25], key: 'description', defaultValue: 'Results From MM to TM' }
    ],
    roster: [
        { loc: [2, 2], key: 'fileCode', defaultValue: '03' }, // Rosters value
        { loc: [4, 25], key: 'description', defaultValue: 'Rosters Only' }
    ],
    keysToParse: ['fileCode'],
    parseDataToKeys: () => { 
        return { licensedTo: get(MY_TEAM).fullName }
    }
});

const B1 = new LineType({           // Basic meet information
    prefix: 'B1',
    shared: [
        { loc: [2, 45], key: 'meetName' },               // Meet Name
        { loc: [47, 45], key: 'facility' },          // Meet Facility
        { loc: [92, 8], key: 'startDate' },          // Meet Start Date (MMDDYYYY)
        { loc: [100, 8], key: 'endDate' },           // Meet End Date (MMDDYYYY)
        { loc: [108, 8], key: 'ageDate' },             // Age Up Date (MMDDYYYY)
        { loc: [116, 4], key: 'elevation', rJust: true }  
    ],
    keysToParse: ['meetName', 'facility', 'startDate', 'endDate', 'ageDate'],
    parseDataToKeys: (meet) => {
        return { meetName: meet.name, 
                ...meet }
    }
});

const B2 = new LineType({           // Meet type and course information
    prefix: 'B2',
    shared: [ // read AND write entries and results
        { loc: [98, 1], key: 'course', defaultValue: 'S' }, // Shared field
        { loc: [102, 4], key: 'unknown', defaultValue: '0.00' } // Shared field (renamed to 'unknown3' for consistency)
    ],
    entries: [
        { loc: [96, 2], key: 'meetType' },
        { loc: [106, 2], key: 'courseCode', defaultValue: 'S' }
    ],
    results: [
        { loc: [92, 6], key: 'ohone', defaultValue: '010101' }, // Unique to results
        { loc: [99, 1], key: 'unknown2', defaultValue: '2' }
    ],
    keysToParse: ['course', 'meetType'],
    parseDataToKeys: (meet) => {
        return { course: meet.course, meetType: meet.meetType, courseCode: meet.course }
    }
});

const C1 = new LineType({           // Basic team information
    prefix: 'C1',
    shared: [
        { loc: [2, 5], key: 'teamAbbr' }, // Shared field
        { loc: [7, 30], key: 'teamFullName' }, // Shared field
        { loc: [37, 16], key: 'teamName' }, // Shared field
        { loc: [53, 2], key: 'lsc' } // Shared field
    ],
    entries: [
        { loc: [119, 3], key: 'teamType', defaultValue: 'AGE' } // Unique to entries
    ],
    results: [
        { loc: [118, 4], key: 'teamType', defaultValue: '0  0' } // Unique to results
    ],
    keysToParse: ['teamAbbr', 'teamFullName', 'teamName', 'lsc'],
    parseDataToKeys: (team) => {
        return { teamAbbr: team.abbr,
                teamFullName: team.fullName,
                teamName: team.name,
                lsc: 'PV' } //team.lsc }
     }
});

const C2 = new LineType({           // Team address
    prefix: 'C2',
    shared: [
        {loc: [2, 30], key: 'mailTo' },
        {loc: [32, 30], key: 'address' },       
        {loc: [62, 30], key: 'city' },
        {loc: [92, 2], key: 'state', defaultValue: 'MD' },
        {loc: [94, 10], key: 'zip' },       
        {loc: [104, 3], key: 'country', defaultValue: 'USA' },      
        {loc: [108, 4], key: 'teamRegistration' }
    ],
    keysToParse: ['mailTo', 'address', 'city', 'state', 'zip', 'country', 'teamRegistration'],
    parseDataToKeys: (team) => { return { mailTo: team.name } }
});

const C3 = new LineType({       // Team contact information
    prefix: 'C3',
    shared: [
        {loc: [32, 20], key: 'daytimePhone' },
        {loc: [52, 20], key: 'eveningPhone' },       
        {loc: [72, 20], key: 'fax' },
        {loc: [92, 36], key: 'email' }
    ],
    keysToParse: [],
    parseDataToKeys: (team) => {}
});

const D1 = new LineType({       // Swimmer's identifying information
    prefix: 'D1',
    shared: [
        { loc: [2, 1], key: 'gender' },         // Shared: Swimmer Gender
        { loc: [3, 5], key: 'currentId', rJust: true }, // Shared: Swimmer ID
        { loc: [8, 20], key: 'apellido' },      // Shared: Swimmer Last Name
        { loc: [28, 20], key: 'nombre' },       // Shared: Swimmer First Name
        { loc: [48, 20], key: 'nickname' },     // Shared: Swimmer Nickname
        { loc: [68, 1], key: 'middleInitial' }, // Shared: Swimmer Middle Initial
        { loc: [69, 14], key: 'ussID' },        // Shared: USS ID
        { loc: [88, 8], key: 'dob' },           // Shared: Swimmer Birth
        { loc: [96, 3], key: 'age', rJust: true } // Shared: Swimmer Age
    ],
    results: [
        { loc: [83, 5], key: 'id2', rJust: true }, // Unique to results: ID2
        { loc: [104, 1], key: 'zero', defaultValue: '0' }, // Unique to results: Zero field
        { loc: [124, 1], key: 'N', defaultValue: 'N' }     // Unique to results: N field
    ],
    keysToParse: ['gender', 'currentId', 'apellido', 'nombre', 'nickname', 'middleInitial', 'ussID', 'dob', 'age'],
    parseDataToKeys: (swimmer) => swimmer
});

const D2 = new LineType({       // Parent information
    prefix: 'D2',
    shared: [
        { loc: [2, 20], key: 'apellido' }, // Parent apellido
        { loc: [22, 20], key: 'nombre' }, // Parent nombre
        { loc: [42, 12], key: 'phone' }, // Parent phone
        { loc: [56, 40], key: 'email' }, // Parent email
    ],
    keysToParse: ['apellido', 'nombre', 'phone', 'email'],
    parseDataToKeys: (parent) => {
        return {
            apellido: parent.apellido,
            nombre: parent.nombre,
            phone: parent.phone || '',
            email: parent.email || ''
        };
    }
});

const D_ = new LineType({       // Parent information
    prefix: 'D_',
    shared: [
        { loc: [2, 20], key: 'apellido' }, // Parent apellido
        { loc: [22, 20], key: 'nombre' }, // Parent nombre
        { loc: [42, 12], key: 'phone' }, // Parent phone
        { loc: [56, 40], key: 'email' }, // Parent email
    ],
    keysToParse: ['apellido', 'nombre', 'phone', 'email'],
    parseDataToKeys: (parent) => {
        return {
            apellido: parent.apellido,
            nombre: parent.nombre,
            phone: parent.phone || '',
            email: parent.email || ''
        };
    }
});

const E1F1eventAndEntryFields = [
    { loc: [13, 1], key: 'eventGender' },                      // Shared: eventGender (M=Male, F=Female)
    { loc: [14, 1], key: 'gender2' },                      // Shared: Gender2 (M=Mens, B=Boys, F=Womens, G=Girls)
    { loc: [17, 4], key: 'distance', rJust: true },        // Shared: Distance
    { loc: [21, 1], key: 'stroke' },                       // Shared: Stroke
    { loc: [22, 3], key: 'ageLower', rJust: true },        // Shared: AgeLower (0=Under)
    { loc: [25, 3], key: 'ageUpper', rJust: true },        // Shared: AgeUpper (109=Over)
    { loc: [32, 6], key: 'eventFee', rJust: true, defaultValue: '0.00' }, // Shared: Event Fee
    { loc: [38, 4], key: 'eventNumber', rJust: true },     // Shared: Event Number
    { loc: [42, 8], key: 'conversionSeedTime1', rJust: true, defaultValue: '0' }, // Shared: Conversion Seed Time 1
    { loc: [50, 1], key: 'conversionSeedCourse1', rJust: true }, // Shared: Conversion Seed Course 1
    { loc: [51, 8], key: 'seed', rJust: true },       // Unique to results: Seed Time 1
    { loc: [59, 1], key: 'seedCourse', rJust: true },     // Unique to results: Seed Course 1
    { loc: [83, 1], key: 'exhibition' }                   // Shared: Exhibition
];
const E1F1ResultsFields = [
    { loc: [30, 2], key: 'zeroS', default: '0S' },         // Unique to results
    { loc: [62, 6], key: 'points', rJust: true },          // Unique to results: Points
    { loc: [70, 6], key: 'points2', rJust: true, defaultValue: '0.00' }, // Unique to results: Points 2
    { loc: [79, 2], key: 'NN', defaultValue: 'NN' },       // Unique to results: NN
    { loc: [96, 1], key: 'N', defaultValue: 'N' }          // Unique to results: N
]

const E1 = new LineType({       // Event and entry information (& points for results)
    prefix: 'E1',
    shared: [
        { loc: [2, 1], key: 'swimmerGender' },                 // Shared: Swimmer Gender (M=Male, F=Female)
        { loc: [3, 5], key: 'currentId', rJust: true },               // Shared: Swimmer Id
        { loc: [8, 5], key: 'swimmerAbbr' },                   // Shared: Swimmer Abbr (First five digits of the last name)
        ...E1F1eventAndEntryFields
    ],
    results: [ ...E1F1ResultsFields ],
    keysToParse: ['eventNumber', 'seed', 'exhibition'],
    parseDataToKeys: (data) => {
        const {swimmer, swim, meet} = data;
        return {
          swimmerGender: swimmer.gender,
          currentId: swimmer.currentId,
          swimmerAbbr: swimmer.apellido,
          eventGender: swim.event.gender,
          gender2: swim.event.gender,
          eventNumber: swim.event.n,
          distance: swim.distance,
          stroke: swim.stroke.hy3,
          ageLower: swim.event.ageGroup.ages[0],
          ageUpper: swim.event.ageGroup.ages[1],
          seed: swim.seed > 9990 ? '0.00' : swim.seed.toFixed(2),
          exhibition: swim.exhibition ? 'X' : '',
          seedCourse: meet.course,
          conversionSeedCourse1: meet.course
         }
    }
});

const E2F2ResultsFields = [
    { loc: [2, 1], key: 'resultType', defaultValue: 'F' }, // Result Type (F=Final, P=Prelim)
    { loc: [3, 8], key: 'result', rJust: true }, // Time
    { loc: [11, 1], key: 'course' }, // Length Unit (Y=Yard, S=Short Course Meter)
    { loc: [12, 1], key: 'resultCode' }, // Time Code (Q=DQ, R=No Start/Show, ' ' = Normal, 'S' = Scratch, 'F' = False Start)
    { loc: [13, 2], key: 'dqCode' }, // Time Code (Q=DQ, R=No Start/Show, ' ' = Normal, 'S' = Scratch, 'F' = False Start)
    { loc: [15, 1], key: 'exhibition' },
    { loc: [19, 1], key: 'zero1', defaultValue: '0' }, // Heat
    { loc: [21, 2], key: 'heat', rJust: true }, // Heat
    { loc: [24, 2], key: 'lane', rJust: true }, // Lane
    { loc: [27, 2], key: 'heatPlace', rJust: true }, // Place in Heat
    { loc: [30, 3], key: 'place', rJust: true }, // Overall Place
    { loc: [35, 1], key: 'zero2', defaultValue: '0' }, // Placeholder for [36:43]
    { loc: [36, 8], key: 'time1', defaultValue: '0.00', rJust: true }, // Placeholder for [36:43]
    { loc: [44, 8], key: 'time2', defaultValue: '0.00', rJust: true }, // Placeholder for [44:51]
    { loc: [52, 8], key: 'time3', defaultValue: '0.00', rJust: true }, // Placeholder for [52:59]
    { loc: [65, 8], key: 'time4', defaultValue: '0.00', rJust: true }, // Placeholder for [65:72]
    { loc: [74, 8], key: 'time5', defaultValue: '0.00', rJust: true }, // Placeholder for [74:81]
    { loc: [122, 1], key: 'zero3', defaultValue: '0' } // Heat
]

const E2 = new LineType({           // Swim results
    prefix: 'E2',
    shared: [
        ...E2F2ResultsFields,
        { loc: [87, 8], key: 'date' }, // Day of the event
    ],
    keysToParse: ['result', 'resultCode', 'heat', 'lane', 'place', 'date']
});

const F1 = new LineType({       // Relay event and entry information (points for results)
    prefix: 'F1',
    shared: [
        { loc: [2, 5], key: 'teamAbbr' },                // Shared: Team Abbreviation
        { loc: [7, 1], key: 'label' },  // Shared: Relay Team
        { loc: [11, 1], key: 'zero', defaultValue: '0' }, // Shared: Zero Field
        { loc: [12, 1], key: 'relayGender' },                // Shared: Gender
        ...E1F1eventAndEntryFields
    ],
    results: [
        ...E1F1ResultsFields,
        { loc: [84, 1], key: 'four', defaultValue: '4' },  // Unique to results: Four
        { loc: [97, 1], key: 'label' }               // Unique to results: Relay Team 2
    ],
    keysToParse: ['teamAbbr', 'label', 'eventNumber', 'seed', 'exhibition'],
    parseDataToKeys: (data) => {
        const {relay, meet} = data;
        return {
            teamAbbr: relay.team.abbr,
            label: relay.label,
            swimmerGender: relay.event.gender,
            eventGender: relay.event.gender,
            gender2: relay.event.gender,
            relayGender: relay.event.gender,
            eventNumber: relay.event.n,
            distance: relay.event.distance,
            stroke: relay.event.stroke.hy3,
            ageLower: relay.event.ageGroup.ages[0],
            ageUpper: relay.event.ageGroup.ages[1],
            seed: relay.seed > 9997 ? '0.00' : relay.seed.toFixed(2),
            exhibition: relay.exhibition ? 'X' : '',
            seedCourse: meet.course,
            conversionSeedCourse1: meet.course
         }
    }
});

const F2 = new LineType({       // Relay results
    prefix: 'F2',
    shared: [
        ...E2F2ResultsFields,
        { loc: [63, 2], key: 'strokeInfractionCode' },
        { loc: [102, 8], key: 'date' }, // Day of the event
    ],
    keysToParse: ['result', 'resultCode', 'heat', 'lane', 'place', 'date'],
    parseDataToKeys: (data) => {
    
    }
});

const F3 = new LineType({
    // Relay swimmers
    prefix: 'F3',
    shared: [
      ...[0, 1, 2, 3, 4, 5, 6, 7].map(i => ([
        { loc: [13 * i + 2 , 1], key: `gender${i+1}` },
        { loc: [13 * i + 3 , 5], key: `id${i+1}`, rJust: true },
        { loc: [13 * i + 8 , 5], key: `swimmerAbbr${i+1}` },
        { loc: [13 * i + 13, 2], key: `F${i+1}` }
      ])).flat()
    ],
    keysToParse: ['id1', 'id2', 'id3', 'id4', 'id5', 'id6', 'id7', 'id8'],
    parseDataToKeys: (data) => {
      const keys = {};
      data.swims.forEach((swim, i) => {
        keys[`gender${i + 1}`] = swim.swimmer.gender;
        keys[`id${i + 1}`] = swim.swimmer.currentId;
        keys[`swimmerAbbr${i + 1}`] = swim.swimmer.apellido;
        keys[`F${i + 1}`] = `F${i + 1}`;
      });
      return keys;
    }
});

const F4 = new LineType({       // Relay entry splits
    prefix: 'F4',
    shared: [
        { loc: [2, 1], key: 'hypothetical' }, // Hypothetical relay
      ...[0, 1, 2, 3, 4, 5, 6, 7].map(i => ([
        { loc: [13 * i + 7 , 7], key: `split${i+1}`, rJust: true }, // Split times
        { loc: [13 * i + 14 , 1], key: `converted${i+1}` } // Converted
      ])).flat()
    ],
    keysToParse: ['hypothetical', 'split1', 'split2', 'split3', 'split4', 'split5', 'split6', 'split7', 'split8',
        'converted1', 'converted2', 'converted3', 'converted4', 'converted5', 'converted6', 'converted7', 'converted8'  
    ],
    parseDataToKeys: (data) => {
      const keys = {hypothetical: data.hypothetical ? '*' : ''};
      data.swims.forEach((swim, i) => {
        keys[`split${i + 1}`] = swim.seed.toFixed(2); // Assuming result is a number
        keys[`converted${i + 1}`] = swim.converted ? '*' : '';
      });
      return keys;
    }
});

const H1 = new LineType({       // DQ information
    prefix: 'H1',
    shared: [
        { loc: [2, 2], key: 'dqCode' },
        { loc: [4, 123], key: 'dqDescription' }
    ],
    keysToParse: ['dqCode', 'dqDescription']
});

const H2 = new LineType({       // Individual swimmer DQ for relays
    prefix: 'H2',
    shared: [
        { loc: [2, 2], key: 'dqCode' },
        { loc: [4, 123], key: 'dqDescription' }
    ],
    keysToParse: ['dqCode', 'dqDescription']
});

/*
A1: fileFormat
    - Keys: fileFormat (02, 03, or 07 depending on type), description, vendor, software, dateAndTime, licensedTo

B1: meetName, facility, startDate, endDate, ageDate
    - Keys: meetName, facility, startDate (MMDDYYYY), endDate (MMDDYYYY), ageDate (MMDDYYYY), elevation

B2: course, meetType
    - Keys: course (S=Short, Y=Yard), meetType, courseCode, unknown

C1: abbr, fullName, name, lsc
    - Keys: abbr (team abbreviation), fullName, name (short name), lsc, teamType

C2: mailTo, address, city, state, zip, country, teamRegistration
    - Keys: mailing address, city, state, zip, country (default USA), teamRegistration

C3: daytimePhone, eveningPhone, fax, email
    - Keys: contact information for the team (phones, fax, email)

D1: gender, id, apellido, nombre, nickname, middleInitial, ussID, dob, age
    - Keys: swimmer identification (gender, id, name, dob, age)

E1: eventNumber, seed, exhibition
    - Keys: event information (gender, distance, stroke, age group, fee, seed times)

E2: result, resultCode, heat, lane, place, date
    - Keys: results information (time, heat, lane, place, result type, date)

F1: teamAbbr, relayTeam, eventNumber, seedTime1, exhibition
    - Keys: relay event and entry information (team, gender, distance, stroke, age group, fee, seed times)

F2: result, resultCode, heat, lane, place, date
    - Keys: relay results information (result type, time, heat, lane, place, date, infractions)

F3: id1, id2, id3, id4, id5, id6, id7, id8
    - Keys: swimmer identifiers for relay teams (gender, id, abbreviation)

H1: dqCode, dqDescription
    - Keys: disqualification information (code and description)

H2: dqCode, dqDescription
    - Keys: individual swimmer disqualification information for relays
*/

const HY3LineTypes = [A1, B1, B2, C1, C2, C3, D1, D2, D_, E1, E2, F1, F2, F3, F4, H1, H2];

export { HY3LineTypes };