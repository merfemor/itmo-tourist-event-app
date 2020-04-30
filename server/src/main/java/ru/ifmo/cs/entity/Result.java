package ru.ifmo.cs.entity;

import com.fasterxml.jackson.annotation.JsonCreator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

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
}
