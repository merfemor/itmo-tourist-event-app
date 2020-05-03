package ru.ifmo.cs.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import java.util.Date;
import java.util.Objects;

@Entity
public class Task {
    @Id
    @GeneratedValue
    private Long id;
    @Column(nullable = false)
    private String name;
    private String description;
    @Column(name = "assignee_id")
    private Long assigneeId;
    @ManyToOne
    @JoinColumn(name = "assignee_id", insertable = false, updatable = false)
    private Person assignee;
    @Column(nullable = false)
    private boolean isDone;
    @Column(name = "associated_contest_id")
    private Long associatedContestId;
    @ManyToOne
    @JoinColumn(name = "associated_contest_id", insertable = false, updatable = false)
    private Contest associatedContest;
    private Date startDateTime;
    private Date endDateTime;

    protected Task() {
        /* for ORM */
    }

    @JsonCreator
    public Task(Long id, String name, String description, Long assigneeId, @JsonProperty("isDone") boolean isDone, Long associatedContestId, Date startDateTime, Date endDateTime) {
        Objects.requireNonNull(name, "name must not be null");
        this.id = id;
        this.name = name;
        this.description = description;
        this.assigneeId = assigneeId;
        this.isDone = isDone;
        this.associatedContestId = associatedContestId;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
    }

    public Long getAssigneeId() {
        return assigneeId;
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

    public Long getAssociatedContestId() {
        return associatedContestId;
    }

    public Contest getAssociatedContest() {
        return associatedContest;
    }

    public Date getStartDateTime() {
        return startDateTime;
    }

    public Date getEndDateTime() {
        return endDateTime;
    }

    public void updateFields(Task newTask) {
        this.assigneeId = newTask.assigneeId;
        this.name = newTask.name;
        this.startDateTime = newTask.startDateTime;
        this.endDateTime = newTask.endDateTime;
        this.isDone = newTask.isDone;
        this.associatedContestId = newTask.associatedContestId;
        this.description = newTask.description;
    }
}
