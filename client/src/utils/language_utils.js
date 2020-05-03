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