package ru.ifmo.cs.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Task {
    @Id
    @GeneratedValue
    private Long id;
    @Column(nullable = false)
    private String name;
    private String description;
    @ManyToOne
    private Person assignee;
    @Column(nullable = false)
    private boolean isDone;
    @ManyToOne
    private Contest associatedContest;
    private Date startTime;
    private Date endTime;

    protected Task() {
        /* for ORM */
    }

    @JsonCreator
    public Task(Long id, String name, String description, Person assignee, @JsonProperty("isDone") boolean isDone, Contest associatedContest, Date startTime, Date endTime) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.assignee = assignee;
        this.isDone = isDone;
        this.associatedContest = associatedContest;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Person getAssignee() {
        return assignee;
    }

    @JsonProperty("isDone")
    public boolean isDone() {
        return isDone;
    }

    public Contest getAssociatedContest() {
        return associatedContest;
    }

    public Date getStartTime() {
        return startTime;
    }

    public Date getEndTime() {
        return endTime;
    }
}
