function pad(strng, length) {
    const str = String(strng);
    const len = Math.abs(length);
    //console.log(str, str.length, len);
    if (str.length >= len) {
        return str.slice(0, len);
    }
    if (length < 0) return ' '.repeat(len - str.length) + str;
    return str + ' '.repeat(len - str.length);
}

function dateAndTime(currentDate = new Date()) {

    // Get the current date and time
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1; // Months are zero-indexed
    let day = currentDate.getDate();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();

    // Determine AM/PM
    let ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'

    // Pad minutes, months, and days with leading zeros
    let min = minutes < 10 ? '0' + minutes : minutes;
    let m = month < 10 ? '0' + month : month;
    let d = day < 10 ? '0' + day : day;

    // Format the date and time as desired
    return `${m}${d}${year}` + pad(`${hours}:${min} ${ampm}`, -9);
}

export { pad, dateAndTime };