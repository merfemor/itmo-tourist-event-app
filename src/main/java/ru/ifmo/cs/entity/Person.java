package ru.ifmo.cs.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;

@Entity
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(nullable = false)
    private String email;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private String firstName;
    @Column(nullable = false)
    private String lastName;
    private String middleName;
    @Column(nullable = false)
    @JsonProperty("isVolunteer")
    private boolean isVolunteer = false;

    protected Person() {
        /* for ORM */
    }


    @JsonCreator
    public Person(Long id, String email, @JsonProperty("password") String password, String firstName, String lastName, String middleName, boolean isVolunteer) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.middleName = middleName;
        this.isVolunteer = isVolunteer;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    @JsonIgnore
    public String getPassword() {
        return password;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getMiddleName() {
        return middleName;
    }

    @Override
    public String toString() {
        return "Person{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", middleName='" + middleName + '\'' +
                ", isVolunteer=" + isVolunteer +
                '}';
    }

    @JsonProperty("isVolunteer")
    public boolean isVolunteer() {
        return isVolunteer;
    }


}
