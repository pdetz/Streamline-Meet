export function parseDateString(dateString) {
  if (!/^\d{8}$/.test(dateString)) {
    return "Invalid date string. Please use MMDDYYYY format.";
  }

  const month = parseInt(dateString.substring(0, 2), 10);
  const day = parseInt(dateString.substring(2, 4), 10);
  const year = parseInt(dateString.substring(4, 8), 10);

  // Validate the date components
  if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1000) {
    return "Invalid date components. Please check month, day, and year.";
  }

  const date = new Date(year, month - 1, day); // Month is 0-indexed in Date object
  return date;
}

export function formatDateString(dateString, language='en-US') {
  const date = parseDateString(dateString);

  // Use built-in toLocaleDateString for robust formatting
  return date.toLocaleDateString(language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatMMDDYYYYToLongDate(mmddyyyyDateString) {
    // Extract month, day, and year from the input string
    const date = parseDateString(mmddyyyyDateString);

    // Options for toLocaleDateString
    const options = {
        weekday: 'long', // e.g., Wednesday
        year: 'numeric', // e.g., 2025
        month: 'long',   // e.g., June
        day: 'numeric'   // e.g., 18
    };

    return date.toLocaleDateString('en-US', options);
}

export function formatMMDDYYYToShortDate(mmddyyyyDateString) {
    // Extract month, day, and year from the input string
    const date = parseDateString(mmddyyyyDateString);

    // Options for toLocaleDateString
    const options = {
        year: 'numeric', 
        month: 'numeric', 
        day: 'numeric'  
    };

    return date.toLocaleDateString('en-US', options);
}

export function formatPhone(phoneNumber) {
    if (typeof phoneNumber !== 'string') {
        return '';
    }
    const cleanedNumber = phoneNumber.replace(/[^0-9]/g, '');
    const match = cleanedNumber.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
    } else {
        return cleanedNumber;
    }
}

export function formatDob(dob) {
    if (!dob || dob.length !== 10) {
        return ''; // Handle invalid input
    }
    const [year, month, day] = dob.split('-');
    return month + day + year; // Format as MMDDYYYY
}

export function formatName(name) {
    if (typeof name !== 'string' || name.length === 0) {
        return '';
    }

    const capitalizePart = (part) => {
        if (part.length === 0) {
            return '';
        }
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    };

    let formattedName = name.split(' ').map(capitalizePart).join(' ');
    formattedName = formattedName.split('-').map(capitalizePart).join('-');

    return formattedName;
}