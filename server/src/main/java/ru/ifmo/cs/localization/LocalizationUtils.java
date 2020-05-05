package ru.ifmo.cs.localization;

import ru.ifmo.cs.entity.AcademicDegree;
import ru.ifmo.cs.entity.Person;
import ru.ifmo.cs.utils.Check;

public class LocalizationUtils {

    public static final String[] SINGLE_RESULT_TABLE_HEADER_VALUES = {"№", "Номер участника", "ФИО", "Пол", "Организация", "Статус", "Время", "Баллы", "Штраф", "Место"};

    private LocalizationUtils() {
    }

    public static String academicDegreeToResultTableStatus(AcademicDegree academicDegree) {
        if (academicDegree == null) {
            return "";
        }
        switch (academicDegree) {
            case FIRST_YEAR_BACHELOR:
            case FIRST_YEAR_SPECIALIST:
                return "первокурсник";
            case BACHELOR:
            case SPECIALIST:
                return "студент";
            case MASTER:
                return "магистрант";
            case POST_GRADUATE:
                return "аспирант";
            case GRADUATE:
                return "выпускник";
            default:
                return Check.failMissingSwitchBranch(academicDegree, "");
        }
    }

    public static String getCompetitionPlaceString(int place) {
        Check.isTrue(place >= 1, "place must be >= 1, actual " + place);
        if (place == 1) {
            return "I";
        }
        if (place == 2) {
            return "II";
        }
        if (place == 3) {
            return "III";
        }
        return Integer.toString(place);
    }

    public static String getGenderString(boolean isMale) {
        return isMale ? "Мужской" :  "Женский";
    }

    public static String getPersonFullName(Person person) {
        final String middleName;
        if (person.getMiddleName() != null) {
            middleName = " " + person.getMiddleName();
        } else {
            middleName = "";
        }
        return person.getLastName() + " " + person.getFirstName() + middleName;
    }
}
