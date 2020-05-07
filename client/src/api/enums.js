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

export const ResultParticipantsType = {
    MEN: {
        name: "MEN",
        displayName: "Мужские"
    },
    WOMEN: {
        name: "WOMEN",
        displayName: "Женские"
    },
    MIXED_GROUP: {
        name: "MIXED_GROUP",
        displayName: "Смешанные"
    }
}
Object.freeze(ResultParticipantsType)

export const ItmoStudentsResultFilter = {
    ALL: {
        name: "ALL",
        displayName: "Все студенты"
    },
    FIRST_YEAR_BACHELOR: {
        name: "FIRST_YEAR_BACHELOR",
        displayName: "Первокурсники"
    },
    GRADUATE: {
        name: "GRADUATE",
        displayName: "Выпускники"
    }
}
Object.freeze(ItmoStudentsResultFilter)

export const AcademicDegree = {
    FIRST_YEAR_BACHELOR: {
        name: "FIRST_YEAR_BACHELOR",
        displayName: "Бакалавр (1 курс)"
    },
    BACHELOR: {
        name: "BACHELOR",
        displayName: "Бакалавр"
    },
    FIRST_YEAR_SPECIALIST: {
         name: "FIRST_YEAR_SPECIALIST",
        displayName: "Специалист (1 курс)"
    },
    SPECIALIST: {
        name: "SPECIALIST",
        displayName: "Специалист"
    },
    MASTER: {
        name: "MASTER",
        displayName: "Магистр"
    },
    POST_GRADUATE: {
        name: "POST_GRADUATE",
        displayName: "Аспирант"
    },
    GRADUATE: {
        name: "GRADUATE",
        displayName: "Выпускник"
    }
}
Object.freeze(AcademicDegree)

export const SportsCategory = {
    HONORED_MASTER_OF_SPORTS: {
        name: "HONORED_MASTER_OF_SPORTS",
        displayName: "ЗМС"
    },
    INTERNATIONAL_MASTER_OF_SPORTS: {
        name: "INTERNATIONAL_MASTER_OF_SPORTS",
        displayName: "МСМК"
    },
    MASTER_OF_SPORTS: {
        name: "MASTER_OF_SPORTS",
        displayName: "МС"
    },
    CANDIDATE_MASTER_OF_SPORTS: {
        name: "CANDIDATE_MASTER_OF_SPORTS",
        displayName: "КМС"
    },
    ADULT_1: {
        name: "ADULT_1",
        displayName: "1 взрослый"
    },
    ADULT_2: {
        name: "ADULT_2",
        displayName: "2 взрослый"
    },
    ADULT_3: {
        name: "ADULT_3",
        displayName: "3 взрослый"
    },
    YOUTH_1: {
        name: "YOUTH_1",
        displayName: "1 юношеский"
    },
    YOUTH_2: {
        name: "YOUTH_2",
        displayName: "2 юношеский"
    },
    YOUTH_3: {
        name: "YOUTH_3",
        displayName: "3 юношеский"
    }
}
Object.freeze(SportsCategory)

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