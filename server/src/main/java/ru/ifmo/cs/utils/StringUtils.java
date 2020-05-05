package ru.ifmo.cs.utils;

public class StringUtils {

    private StringUtils() { }

    public static String emptyIfNull(String s) {
        return s == null ? "" : s;
    }

    public static String toStringNullable(Object o) {
        return emptyIfNull(valueOfNullable(o));
    }

    public static String valueOfNullable(Object o) {
        return o == null ? null : String.valueOf(o);
    }
}
