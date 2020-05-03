export const UserRole = {
    PARTICIPANT: {
        name: "PARTICIPANT",
        order: 1
    },
    VOLUNTEER: {
        name: "VOLUNTEER",
        order: 2,
    },
    ORGANIZER: {
        name: "ORGANIZER",
        order: 3
    }
}
Object.freeze(UserRole)

export const ResultStructure = {
    TIME: {
        name: "TIME",
        displayName: "время"
    },
    TIME_WITH_PENALTIES: {
        name: "TIME_WITH_PENALTIES",
        displayName: "время со штрафами"
    },
    TIME_WITH_POINTS: {
        name: "TIME_WITH_POINTS",
        displayName: "время с баллами"
    }
}
Object.freeze(ResultStructure)

export const RegistrationType = {
    OPEN: {
        name: "OPEN",
        displayName: "открытая"
    },
    PRE_REGISTRATION: {
        name: "PRE_REGISTRATION",
        displayName: "предварительная"
    }
}
Object.freeze(RegistrationType)

export const ParticipantType = {
    SINGLE: {
        name: "SINGLE",
        displayName: "личный"
    },
    PAIR: {
        name: "PAIR",
        displayName: "связка"
    },
    GROUP: {
        name: "GROUP",
        displayName: "группа"
    }
}
Object.freeze(ParticipantType)

export function requireEnumByName(enumClass, name) {
    const result = findEnumByName(enumClass, name)
    if (result == null) {
        throw new Error("Not found enum with name " + name)
    }
    return result
}

export function findEnumByName(enumClass, name) {
    for (const item in enumClass) {
        if (enumClass[item].name === name) {
            return enumClass[item]
        }
    }
    return null;
}

export function enumToLocaleString(enumClass, name) {
    return requireEnumByName(enumClass, name).displayName
}