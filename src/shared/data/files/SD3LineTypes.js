import { LineType } from "./LineType";

const A0 = new LineType({       // File information
    prefix: 'A0',
    shared: [
        { loc: [2, 1], key: 'orgCode', defaultValue: '1' }, // Organization code, 1 = USS, 9 = High School
        { loc: [3, 8], key: 'sdifVersion', defaultValue: 'V3' }, // SDIF version number
        { loc: [43, 20], key: 'softwareName', defaultValue: 'BetterTech' }, // Software name
        { loc: [63, 10], key: 'softwareVersion', defaultValue: '0.1' }, // Software version
        { loc: [73, 20], key: 'contactName' }, // Contact name
        { loc: [93, 12], key: 'contactPhone' }, // Contact phone
        { loc: [105, 8], key: 'createdAt' }, // File creation or update date
        { loc: [155, 2], key: 'submittedByLSC' } // Submitted by LSC for Top 16
    ],
    entries: [
        { loc: [11, 2], key: 'fileCode', defaultValue: '01' }, // File code, table checked
        { loc: [13, 12], key: 'description', defaultValue: 'Meet Entries' }
    ],
    planning: [
        { loc: [11, 2], key: 'fileCode', defaultValue: '01' }, // File code, table checked
        { loc: [13, 12], key: 'description', defaultValue: 'Meet Planning' }
    ],
    results: [
        { loc: [11, 2], key: 'fileCode', defaultValue: '02' }, // File code, table checked
        { loc: [13, 12], key: 'description', defaultValue: 'Meet Results' }
    ],
    roster: [
        { loc: [11, 2], key: 'fileCode', defaultValue: '20' }, // File code, table checked
        { loc: [13, 12], key: 'description', defaultValue: 'Roster' }
    ],
    keysToParse: ['fileCode']
});

const B1 = new LineType({       // Meet information
    prefix: 'B1',
    shared: [
        { loc: [2, 1], key: 'orgCode', defaultValue: '1' }, // Organization code, table checked
        { loc: [11, 30], key: 'meetName' }, // Meet name
        { loc: [41, 22], key: 'meetAddressLine1' }, // Meet address line one
        { loc: [63, 22], key: 'meetAddressLine2' }, // Meet address line two
        { loc: [85, 20], key: 'meetCity' }, // Meet city
        { loc: [105, 2], key: 'meetState' }, // Meet state (USPS code)
        { loc: [107, 10], key: 'postalCode' }, // Postal code (zip or foreign)
        { loc: [117, 3], key: 'countryCode' }, // Country code, table checked
        { loc: [120, 1], key: 'meetType' }, // Meet code, table checked
        { loc: [121, 8], key: 'startDate' }, // Meet start date
        { loc: [129, 8], key: 'endDate' }, // Meet end date
        { loc: [137, 4], key: 'poolAltitude' }, // Altitude of pool in feet
        { loc: [149, 1], key: 'course', defaultValue: 'S' } // Course code, table checked
    ],
    keysToParse: ['meetName', 'meetType', 'startDate', 'endDate', 'course']
});

const C1 = new LineType({       // Team information
    prefix: 'C1',
    shared: [
        { loc: [2, 1], key: 'orgCode', defaultValue: '1' }, // Organization code, table checked
        { loc: [11, 2], key: 'lsc' }, // LSC
        { loc: [13, 4], key: 'teamAbbr' }, // Team abbreviation
        { loc: [17, 30], key: 'teamFullName' }, // Full team name
        { loc: [47, 16], key: 'teamName' }, // Abbreviated team name
        { loc: [63, 22], key: 'address1' }, // Team address line one
        { loc: [85, 22], key: 'address2' }, // Team address line two
        { loc: [107, 20], key: 'city' }, // Team city
        { loc: [127, 2], key: 'state' }, // Team state (USPS code)
        { loc: [129, 10], key: 'zip' }, // Postal code (zip or foreign)
        { loc: [139, 3], key: 'country' }, // Country code, table checked
        { loc: [142, 1], key: 'regionCode' }, // Region code, table checked
        { loc: [149, 1], key: 'optional5thChar' } // Optional 5th character of team code
    ],
    keysToParse: ['teamAbbr', 'teamFullName', 'teamName', 'lsc']
});

const D0EntriesFields = [
        { loc: [66, 1], key: 'eventGender' }, // Event sex code, table checked
        { loc: [67, 4], key: 'distance', rJust: true }, // Event distance
        { loc: [71, 1], key: 'stroke' }, // Stroke code, table checked
        { loc: [72, 3], key: 'eventNumber', rJust: true }, // Event number
        { loc: [76, 2], key: 'ageLower' }, // Event age code, table checked
        { loc: [78, 2], key: 'ageUpper' }, // Event age code, table checked
        { loc: [88, 8], key: 'seed', rJust: true }, // Seed time
        { loc: [96, 1], key: 'seedCourse', defaultValue: 'S' }, // Seed time course, table checked
        { loc: [155, 1], key: 'exhibition' }
];

const D0 = new LineType({           // Swimmer, entries, and results infomation
    prefix: 'D0',
    shared: [
        { loc: [2, 1], key: 'orgCode', defaultValue: '1' }, // Organization code, table checked
        { loc: [3, 2], key: 'lsc', defaultValue: 'PV' }, // LSC
        { loc: [11, 28], key: 'swimmerName' }, // Swimmer name
        { loc: [39, 12], key: 'ussID' }, // USS#
        { loc: [51, 1], key: 'attachCode', defaultValue: 'A' }, // Attachment code, table checked
        { loc: [52, 3], key: 'citizenshipCode', defaultValue: 'USA' }, // Citizenship code, table checked
        { loc: [55, 8], key: 'dob' }, // Swimmer birth date
        { loc: [63, 2], key: 'age', rJust: true }, // Swimmer age or class (e.g., Jr or Sr)
        { loc: [65, 1], key: 'gender' } // Sex code, table checked
    ],
    entries: [
        ...D0EntriesFields
    ],
    results: [
        ...D0EntriesFields,
        { loc: [80, 8], key: 'date' }, // Date of swim
        { loc: [97, 8], key: 'prelimTime', rJust: true }, // Prelim time
        { loc: [105, 1], key: 'prelimTimeCourse' }, // Prelim time course, table checked
        { loc: [106, 8], key: 'swimOffTime', rJust: true }, // Swim-off time
        { loc: [114, 1], key: 'swimOffTimeCourse' }, // Swim-off time course, table checked
        { loc: [115, 8], key: 'result', rJust: true }, // Finals time
        { loc: [123, 1], key: 'course' }, // Finals time course, table checked
        { loc: [124, 2], key: 'prelimHeatNumber', rJust: true }, // Prelim heat number
        { loc: [126, 2], key: 'prelimLaneNumber', rJust: true }, // Prelim lane number
        { loc: [128, 2], key: 'heat', rJust: true }, // Finals heat number
        { loc: [130, 2], key: 'lane', rJust: true }, // Finals lane number
        { loc: [132, 3], key: 'prelimPlaceRanking', rJust: true }, // Prelim place ranking
        { loc: [135, 3], key: 'place', rJust: true }, // Finals place ranking
        { loc: [138, 4], key: 'points', rJust: true }, // Points scored from finals
        { loc: [142, 2], key: 'eventTimeClassCode' }, // Event time class code, table checked
        { loc: [144, 2], key: 'heatPlace', rJust: true }, // Result code, table checked
        { loc: [148, 1], key: 'zero'},
        { loc: [149, 1], key: 'stroke2' },
        { loc: [150, 2], key: 'decimalPoints' }, // Decimal values of the points
    ],
    keysToParse: ['swimmerName', 'gender', 'ussID', 'dob', 'age', // shared
        'eventNumber', 'seed', 'exhibition',     // entries
        'result', 'heat', 'lane', 'place', 'date']   //results
});

const D3 = new LineType({   // Swimmer preferred name, middle name, and misc info
    prefix: 'D3',
    shared: [
        { loc: [2, 14], key: 'ussNumber' }, // USS# (new)
        { loc: [16, 15], key: 'nickname' }, // Preferred first name
        { loc: [31, 2], key: 'ethnicityCode' }, // Ethnicity code, table checked
        { loc: [33, 1], key: 'juniorHighSchool', defaultValue: 'F' }, // Junior High School
        { loc: [34, 1], key: 'seniorHighSchool', defaultValue: 'F' }, // Senior High School
        { loc: [35, 1], key: 'ymcaYwca', defaultValue: 'F' }, // YMCA/YWCA
        { loc: [36, 1], key: 'college', defaultValue: 'F' }, // College
        { loc: [37, 1], key: 'summerSwimLeague', defaultValue: 'F' }, // Summer Swim League
        { loc: [38, 1], key: 'masters', defaultValue: 'F' }, // Masters
        { loc: [39, 1], key: 'disabledSportsOrganizations', defaultValue: 'F' }, // Disabled Sports Organizations
        { loc: [40, 1], key: 'waterPolo', defaultValue: 'F' }, // Water Polo
        { loc: [41, 1], key: 'none', defaultValue: 'F' }, // None
        { loc: [42, 1], key: 'unknown1', defaultValue: 'F' }, // Additional unknown field
        { loc: [43, 1], key: 'unknown2', defaultValue: 'F' }, // Additional unknown field
        { loc: [44, 1], key: 'unknown3', defaultValue: 'F' }, // Additional unknown field
        { loc: [45, 1], key: 'unknown4', defaultValue: 'F' }, // Additional unknown field
        { loc: [46, 1], key: 'unknown5', defaultValue: 'F' }, // Additional unknown field
        { loc: [47, 15], key: 'middleName'},
        { loc: [146, 1], key: 'n', defaultValue: 'N' }, // N
    ],
    keysToParse: ['nickname', 'middleName']
});

const E0 = new LineType({       // Relay event record
    prefix: 'E0',
    shared: [
        { loc: [2, 1], key: 'orgCode', defaultValue: '1' }, // Organization code, table checked
        { loc: [3, 2], key: 'lsc' }, // LSC
        { loc: [11, 1], key: 'label' }, // Relay team label character
        { loc: [12, 2], key: 'lsc2' }, // LSC
        { loc: [14, 4], key: 'teamAbbr' }, // Team code, table checked
        { loc: [18, 2], key: 'legs', rJust: true }, // Number of F0 relay name records to follow
        { loc: [20, 1], key: 'eventGender' }, // Event sex code, table checked
        { loc: [21, 4], key: 'distance', rJust: true }, // Distance of relay
        { loc: [25, 1], key: 'stroke' }, // Stroke code, table checked
        { loc: [26, 3], key: 'eventNumber', rJust: true }, // Event number
        { loc: [30, 2], key: 'ageLower' }, // Event age code, table checked
        { loc: [32, 2], key: 'ageUpper' }, // Event age code, table checked
        { loc: [34, 3], key: 'totalAthleteAge', rJust: true }, // Total age of all athletes in this event
        { loc: [45, 8], key: 'seed', rJust: true }, // Seed time
        { loc: [53, 1], key: 'seedCourse' }, // Seed time course, table checked
    ],
    results: [
        { loc: [37, 8], key: 'date' }, // Date of swim
        { loc: [54, 8], key: 'prelimTime' }, // Prelim time
        { loc: [62, 1], key: 'prelimTimeCourse' }, // Prelim time course, table checked
        { loc: [63, 8], key: 'swimOffTime' }, // Swim-off time
        { loc: [71, 1], key: 'swimOffTimeCourse' }, // Swim-off time course, table checked
        { loc: [72, 8], key: 'result' }, // Finals time
        { loc: [80, 1], key: 'course' }, // Finals time course, table checked
        { loc: [81, 2], key: 'prelimHeatNumber' }, // Prelim heat number
        { loc: [83, 2], key: 'prelimLaneNumber' }, // Prelim lane number
        { loc: [85, 2], key: 'heat', rJust: true }, // Finals heat number
        { loc: [87, 2], key: 'lane', rJust: true }, // Finals lane number
        { loc: [89, 3], key: 'prelimPlaceRanking' }, // Prelim place ranking
        { loc: [92, 3], key: 'place', rJust: true }, // Finals place ranking
        { loc: [95, 4], key: 'points', rJust: true }, // Points scored from finals
        { loc: [141, 3], key: 'heatPlace', rJust: true }, // Finals place ranking
        { loc: [144, 1], key: 'n', defaultValue: 'N' }, // N'
        { loc: [148, 1], key: 'zero', defaultValue: '0' }, // 0
        { loc: [149, 1], key: 'stroke2' },
        { loc: [150, 2], key: 'decimalPoints' }, // Decimal values of the points
        { loc: [151, 1], key: 'x', defaultValue: 'X' }, // X
        { loc: [155, 1], key: 'exhibition' }
    ],
    keysToParse: ['teamAbbr', 'label', 'eventNumber', 'seed', 'exhibition',
                    'result', 'heat', 'lane', 'place', 'date', 'points', 'decimalPoints']
});

const F0 = new LineType({    // Relay name record
    prefix: 'F0',
    shared: [
        { loc: [2, 1], key: 'orgCode', defaultValue: '1' }, // Organization code, table checked
        { loc: [3, 2], key: 'lsc' }, // LSC
        { loc: [15, 2], key: 'lsc2' }, 
        { loc: [17, 4], key: 'teamAbbr' }, // Team code, table checked
        { loc: [21, 1], key: 'label' }, // Relay team name character
        { loc: [22, 28], key: 'swimmerName' }, // Swimmer name
        { loc: [50, 12], key: 'ussID' }, // USS#
        { loc: [62, 3], key: 'citizenshipCode' }, // Citizenship code, table checked
        { loc: [65, 8], key: 'dob' }, // Swimmer's birth date
        { loc: [73, 2], key: 'age' }, // Swimmer age or class (e.g., Jr or Sr)
        { loc: [75, 1], key: 'gender' }, // Swimmer sex code, table checked
        { loc: [76, 1], key: 'prelimLegCode' }, // Prelim leg order, table checked
        { loc: [77, 1], key: 'swimOffLegCode' }, // Swim-off leg order, table checked
        { loc: [78, 1], key: 'legNumber' }, // Finals leg order, table checked
        { loc: [79, 8], key: 'legTime' }, // Leg time
        { loc: [87, 1], key: 'legTimeCourse' }, // Leg time course, table checked
        { loc: [88, 4], key: 'takeOffTime' }, // Automatic take-off time in seconds and hundredths
        { loc: [92, 14], key: 'newUSSNumber' }, // USS# (new)
        { loc: [106, 15], key: 'preferredName' } // Preferred first name
    ],
    keysToParse: ['teamAbbr', 'swimmerName', 'ussID', 'age', 'legNumber']
});

const G0 = new LineType({       // Split record
    prefix: 'G0',
    shared: [
        { loc: [2, 1], key: 'orgCode', defaultValue: '1' }, // Organization code, table checked
        { loc: [3, 2], key: 'lsc' }, // LSC
        { loc: [15, 28], key: 'swimmerName' }, // Swimmer name or default meaningful string
        { loc: [43, 12], key: 'ussID' }, // USS#
        { loc: [55, 1], key: 'sequenceNumber' }, // Sequence number to order multiple splits records
        { loc: [56, 2], key: 'totalSplits', rJust: true }, // Total number of splits for this event
        { loc: [58, 4], key: 'splitDistance', rJust: true }, // Split distance
        { loc: [62, 1], key: 'splitCode' }, // Split code, table checked
        { loc: [63, 8], key: 'split1' }, // Split time 1
        { loc: [71, 8], key: 'split2' }, // Split time 2
        { loc: [79, 8], key: 'split3' }, // Split time 3
        { loc: [87, 8], key: 'split4' }, // Split time 4
        { loc: [95, 8], key: 'split5' }, // Split time 5
        { loc: [103, 8], key: 'split6' }, // Split time 6
        { loc: [111, 8], key: 'split7' }, // Split time 7
        { loc: [119, 8], key: 'split8' }, // Split time 8
        { loc: [127, 8], key: 'split9' }, // Split time 9
        { loc: [135, 8], key: 'split10' }, // Split time 10
        { loc: [143, 1], key: 'prelimsFinalsCode' } // Prelims/Finals code
    ],
    keysToParse: ['swimmerName', 'ussId']
});

const Z0 = new LineType({
    prefix: 'Z0',
    shared: [
        { loc: [2, 1], key: 'orgCode', defaultValue: '1' }, // Organization code, table checked
        { loc: [11, 2], key: 'fileCode', defaultValue: '02' }, // File code, table checked
        { loc: [13, 30], key: 'notes' }, // Notes (additional file info)
        { loc: [43, 3], key: 'numBRecords', rJust: true }, // Number of B records
        { loc: [46, 3], key: 'numMeets', rJust: true }, // Number of different meets
        { loc: [49, 4], key: 'numCRecords', rJust: true }, // Number of C records
        { loc: [53, 4], key: 'numTeams', rJust: true }, // Number of different teams
        { loc: [57, 6], key: 'numDRecords', rJust: true }, // Number of D records
        { loc: [63, 6], key: 'numSwimmers', rJust: true }, // Number of different swimmers
        { loc: [69, 5], key: 'numERecords', rJust: true }, // Number of E records
        { loc: [74, 6], key: 'numFRecords', rJust: true }, // Number of F records
        { loc: [80, 6], key: 'numGRecords', rJust: true }, // Number of G records
        { loc: [86, 5], key: 'batchNumber', rJust: true }, // Batch number
        { loc: [91], key: 'numNewMembers', rJust: true } // Number of new members (until end of record)
    ],
    keysToParse: []
});

const SD3LineTypes = [ A0, B1, C1, D0, D3, E0, F0, G0, Z0 ];

export { SD3LineTypes };