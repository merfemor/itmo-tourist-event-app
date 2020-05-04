package ru.ifmo.cs.entity;

import com.fasterxml.jackson.annotation.JsonCreator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.Objects;

@Entity
public class Result {
    @Id
    @GeneratedValue
    private Long id;
    private Long time;
    private Long points;
    private Long penalty;

    protected Result() {
        /* for ORM */
    }

    @JsonCreator
    public Result(Long id, Long time, Long points, Long penalty) {
        if (time == null && points == null && penalty == null) {
            throw new IllegalArgumentException("either time, penalty or points should be set");
        }
        this.id = id;
        this.time = time;
        this.points = points;
        this.penalty = penalty;
    }

    public Long getId() {
        return id;
    }

    public Long getTime() {
        return time;
    }

    public Long getPoints() {
        return points;
    }

    public Long getPenalty() {
        return penalty;
    }

    public void updateFields(Result result) {
        this.penalty = result.penalty;
        this.time = result.time;
        this.points = result.points;
    }
}
