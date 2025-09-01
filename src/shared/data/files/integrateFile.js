

function integrateFile(file, team, division) {
    const fileFormat = file.getFormat();

    if (!fileFormat) { 
        console.log(`Unsupported file format: ${file.name}`);
        return false;
    }

    const date = fileFormat.getSingleKey(file, 'startDate');
    const allTeamAbbreviations = fileFormat.getAllValuesForKey(file, 'teamAbbr');
    const teamAbbrs = Array.from(new Set(allTeamAbbreviations)).filter(abbr => abbr !== '');
    const teams = teamAbbrs.map(abbr => division.getTeamByAbbreviation(abbr));
    const typeOfFile = rosterEntryResult(file, fileFormat);

    if (typeOfFile === 'roster') {
      teams[0].updateRoster(file);
      return true;
    }
    let meetMatches = team.meets.map(meet => meet.match(date, teamAbbrs));
    let fullMatches = meetMatches.filter(match => match.full).map(match => match.meet);
    let partialMeetMatches = meetMatches.filter(match => match.partialDate).map(match => match.meet);
    if (typeOfFile === 'entries' && partialMeetMatches.length > 0) {
        partialMeetMatches[0].updateEntries(file);
        partialMeetMatches[0].parseSwims([file], 'entries', 'seed');
        return true;
    }
    if (typeOfFile === 'results' && partialMeetMatches.length > 0) {
        console.log('Updating results for', file.name, 'in', partialMeetMatches[0].name);
      partialMeetMatches[0].updateResults(file);
      return true;
    }
    console.log(file.name, teamAbbrs, teams, fullMatches, partialMeetMatches);
    return false;
}

function rosterEntryResult(file, fileFormat) {
    const fileCode = fileFormat.getSingleKey(file, 'fileCode');
    if (fileFormat.extension === 'hy3') {
        switch (fileCode) {
            case '03': return 'roster';
            case '02': return 'entries';
            case '07': return 'results';
            case '04': return 'results';
            default: return false;
        }
    } else if (fileFormat.extension === 'sd3' || fileFormat.extension === 'cl2') {
        switch (fileCode) {
            case '02': return 'results';
            case '20': return 'entries';
            case '01': 
                if (fileFormat.getSingleKey(file, 'eventNumber') === '') return 'roster';
                return 'entries';
            default: return false;
        }
    }
    return false;
}

function meetInfoFromFile(file) {
    const fileFormat = getFileFormat(file);
    return fileFormat.getMultipleKeys(file, ['meetName', 'facility', 'startDate', 'endDate', 'ageDate', 'meetType', 'course']);
}

function getTeamsFromFile(file) {
    const fileFormat = file.getFormat();
    const abbrs = fileFormat.getAllValuesForKey(file, 'teamAbbr');
    const names = fileFormat.getAllValuesForKey(file, 'teamName');
    return abbrs.map((abbr, index) => ({ abbr: abbr, name: names[index] }));
}

export { integrateFile, meetInfoFromFile, getTeamsFromFile };