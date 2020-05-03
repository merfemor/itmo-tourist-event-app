package ru.ifmo.cs.api;

import com.fasterxml.jackson.annotation.JsonCreator;
import ru.ifmo.cs.entity.Person;

public class LoginResponse {
    private String token;
    private Person user;

    @JsonCreator
    public LoginResponse(String token, Person user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public Person getUser() {
        return user;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setUser(Person user) {
        this.user = user;
    }
}
