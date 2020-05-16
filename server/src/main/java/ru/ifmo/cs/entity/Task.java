package ru.ifmo.cs.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.lang.Nullable;
import ru.ifmo.cs.utils.Check;
import ru.ifmo.cs.utils.JsonUtils;

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
    @Column(name = "assignee_id")
    private Long assigneeId;
    @ManyToOne
    @JoinColumn(name = "assignee_id", insertable = false, updatable = false)
    @JsonIgnoreProperties(JsonUtils.HIBERNATE_LAZY_INITIALIZER)
    private Person assignee;
    @Column(nullable = false)
    private boolean isDone;
    @Column(name = "associated_contest_id")
    private Long associatedContestId;
    @ManyToOne
    @JoinColumn(name = "associated_contest_id", insertable = false, updatable = false)
    @JsonIgnoreProperties(JsonUtils.HIBERNATE_LAZY_INITIALIZER)
    private Contest associatedContest;
    @Nullable
    private Date startDateTime;
    @Nullable
    private Date endDateTime;
    // TODO: add created date time, and sort by it

    protected Task() {
        /* for ORM */
    }

    @JsonCreator
    public Task(Long id, String name, String description, Long assigneeId, @JsonProperty("isDone") boolean isDone, Long associatedContestId, Date startDateTime, Date endDateTime) {
        Check.notNull(name, "name must not be null");
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

    @Nullable
    public Date getStartDateTime() {
        return startDateTime;
    }

    @Nullable
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
