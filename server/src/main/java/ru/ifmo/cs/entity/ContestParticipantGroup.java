package ru.ifmo.cs.entity;

import com.fasterxml.jackson.annotation.JsonCreator;

import javax.persistence.*;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Entity
public class ContestParticipantGroup {
    @Id
    @GeneratedValue
    private Long id;
    @ManyToOne(optional = false)
    private Contest associatedContest;
    private String name;
    private Date startDate;
    @ManyToMany
    @JoinTable
    private Set<Person> members;
    @OneToOne
    private Result result;

    protected ContestParticipantGroup() {
        /* for ORM */
    }

    @JsonCreator
    public ContestParticipantGroup(Long id, Contest associatedContest, String name, Date startDate) {
        this.id = id;
        this.associatedContest = associatedContest;
        this.name = name;
        this.startDate = startDate;
    }

    public Long getId() {
        return id;
    }

    public Contest getAssociatedContest() {
        return associatedContest;
    }

    public String getName() {
        return name;
    }

    public Date getStartDate() {
        return startDate;
    }
}
