export function userRoleToString(role) {
    switch (role) {
        case "PARTICIPANT":
            return "участник";
        case "VOLUNTEER":
            return "волонтёр";
        case "ORGANIZER":
            return "организатор";
        default:
            console.error("Unknown role: " + role)
            return "-";
    }
}

export function personFullName(person) {
    return `${person.lastName} ${person.firstName} ${person.middleName}`
}

export function personShortName(person) {
    const middleName = person.middleName && ` ${person.middleName[0]}.`
    return `${person.lastName} ${person.firstName[0]}.${middleName}`
}

const DATE_TIME_FORMAT_OPTIONS = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timezone: 'UTC',
    hour: 'numeric',
    minute: 'numeric'
};

export function dateTimeToString(dateString) {
    const date = Date.parse(dateString)
    return Intl.DateTimeFormat("ru-RU", DATE_TIME_FORMAT_OPTIONS).format(date)
}