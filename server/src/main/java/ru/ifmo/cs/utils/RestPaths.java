package ru.ifmo.cs.utils;

public interface RestPaths {
    interface Contest {
        String ROOT = "/contest";
    }

    interface Person {
        String ROOT = "/person";
    }

    interface Task {
        String ROOT = "/task";
        String GET_ALL = "/tasks";
    }

    interface Login {
        String LOGIN = "/login";
        String AUTH = "/auth";
        String REGISTER = "/register";
    }
}
