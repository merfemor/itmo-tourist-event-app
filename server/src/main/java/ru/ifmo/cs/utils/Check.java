package ru.ifmo.cs.utils;

import java.util.Collection;

public class Check {
    public static <T> T failMissingSwitchBranch(Object element, T defaultVal) {
        fail("missing switch branch for " + element + ", return " + defaultVal + " by default");
        return defaultVal;
    }

    public static void fail(String msg) {
        // TODO: don't throw exceptions in prod, warn log instead
        // TODO: but check, that some methods may really need throwing exceptions
        throw new IllegalArgumentException(msg);
    }

    public static void notNull(Object o, String msg) {
        isTrue(o != null, msg);
    }

    public static void allNotNull(String msg, Object ...os) {
        for (Object o : os) {
            if (o == null) {
                fail(msg);
            }
        }
    }

    public static void anyNotNull(String msg, Object ...os) {
        for (Object o : os) {
            if (o != null) {
                return;
            }
        }
        fail(msg);
    }

    public static void isTrue(boolean cond, String msg) {
        if (!cond) {
            fail(msg);
        }
    }

    public static void minSize(Collection collection, int size, String msg) {
        isTrue(collection.size() >= size, msg);
    }

    public static void minSizeOrNull(long[] array, int size, String msg) {
        if (array == null) {
            return;
        }
        isTrue(array.length >= size, msg);
    }
}
