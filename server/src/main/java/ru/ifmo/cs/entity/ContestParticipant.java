package ru.ifmo.cs.entity;

import com.fasterxml.jackson.annotation.JsonCreator;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@IdClass(ContestParticipant.ContestParticipantId.class)
public class ContestParticipant {
    @Id
    @ManyToOne(optional = false)
    private Person participant;
    @Id
    @ManyToOne(optional = false)
    private Contest contest;
    private Date startDate;
    @OneToOne
    private Result result;

    protected ContestParticipant() {
        /* for ORM */
    }

    @JsonCreator
    public ContestParticipant(Person participant, Contest contest, Date startDate, Result result) {
        this.participant = participant;
        this.contest = contest;
        this.startDate = startDate;
        this.result = result;
    }

    public Person getParticipant() {
        return participant;
    }

    public Contest getContest() {
        return contest;
    }

    public Date getStartDate() {
        return startDate;
    }

    static class ContestParticipantId implements Serializable {
        private Person participant;
        private Contest contest;

        private ContestParticipantId() {
        }

        public Person getParticipant() {
            return participant;
        }

        public Contest getContest() {
            return contest;
        }
    }
}
