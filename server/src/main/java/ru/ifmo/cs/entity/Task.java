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
    @JsonIgnore
    private Long assigneeId;
    @ManyToOne
    @JoinColumn(name = "assignee_id", insertable = false, updatable = false)
    private Person assignee;
    @Column(nullable = false)
    private boolean isDone;
    @Column(name = "associated_contest_id")
    @JsonIgnore
    private Long associatedContestId;
    @ManyToOne
    @JoinColumn(name = "associated_contest_id", insertable = false, updatable = false)
    private Contest associatedContest;
    private Date startTime;
    private Date endTime;

    protected Task() {
        /* for ORM */
    }

    @JsonCreator
    public Task(Long id, String name, String description, Long assigneeId, @JsonProperty("isDone") boolean isDone, Long associatedContestId, Date startTime, Date endTime) {
        Objects.requireNonNull(name, "name must not be null");
        this.id = id;
        this.name = name;
        this.description = description;
        this.assigneeId = assigneeId;
        this.isDone = isDone;
        this.associatedContestId = associatedContestId;
        this.startTime = startTime;
        this.endTime = endTime;
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

    public Date getStartTime() {
        return startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void updateFields(Task newTask) {
        this.assigneeId = newTask.assigneeId;
        this.name = newTask.name;
        this.startTime = newTask.startTime;
        this.endTime = newTask.endTime;
        this.isDone = newTask.isDone;
        this.associatedContestId = newTask.associatedContestId;
        this.description = newTask.description;
    }
}
