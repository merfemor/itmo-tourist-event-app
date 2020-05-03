package ru.ifmo.cs.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@IdClass(ContestParticipant.ContestParticipantId.class)
public class ContestParticipant {
    @Id
    @Column(name = "participant_id")
    private long participantId;
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "participant_id", insertable = false, updatable = false)
    @JsonIgnoreProperties("hibernateLazyInitializer")
    private Person participant;
    @Id
    @Column(name = "contest_id")
    private long contestId;
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "contest_id", insertable = false, updatable = false)
    @JsonIgnore
    private Contest contest;
    private Date startDate;
    @OneToOne
    private Result result;

    protected ContestParticipant() {
        /* for ORM */
    }

    public ContestParticipant(long participantId, long contestId, Date startDate, Result result) {
        this.participantId = participantId;
        this.contestId = contestId;
        this.startDate = startDate;
        this.result = result;
    }

    public long getParticipantId() {
        return participantId;
    }

    public long getContestId() {
        return contestId;
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

    public Result getResult() {
        return result;
    }

    public static class ContestParticipantId implements Serializable {
        private long participantId;
        private long contestId;

        ContestParticipantId() {
            /* for ORM */
        }

        public ContestParticipantId(long participantId, long contestId) {
            this.participantId = participantId;
            this.contestId = contestId;
        }

        public long getContestId() {
            return contestId;
        }

        public long getParticipantId() {
            return participantId;
        }
    }
}
