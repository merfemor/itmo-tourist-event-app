package ru.ifmo.cs.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import ru.ifmo.cs.api.ContestRegistration;
import ru.ifmo.cs.utils.JsonUtils;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

@Entity
@IdClass(ContestParticipant.ContestParticipantId.class)
public class ContestParticipant {
    @Id
    @Column(name = "participant_id")
    private long participantId;
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "participant_id", insertable = false, updatable = false)
    @JsonIgnoreProperties(JsonUtils.HIBERNATE_LAZY_INITIALIZER)
    private Person participant;
    @Id
    @Column(name = "contest_id")
    private long contestId;
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "contest_id", insertable = false, updatable = false)
    @JsonIgnore
    private Contest contest;
    private Date startDateTime;
    @OneToOne(cascade = CascadeType.ALL)
    private Result result;

    protected ContestParticipant() {
        /* for ORM */
    }

    public ContestParticipant(long participantId, long contestId, Date startDateTime, Result result) {
        this.participantId = participantId;
        this.contestId = contestId;
        this.startDateTime = startDateTime;
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

    public Date getStartDateTime() {
        return startDateTime;
    }

    public Result getResult() {
        return result;
    }

    public void updateFields(ContestRegistration contestRegistration) {
        this.startDateTime = contestRegistration.getStartDateTime();
        if (this.result == null) {
            this.result = contestRegistration.getResult();
        } else if (contestRegistration.getResult() == null) {
            this.result = null;
        } else {
            this.result.updateFields(contestRegistration.getResult());
        }
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

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            ContestParticipantId that = (ContestParticipantId) o;
            return participantId == that.participantId &&
                    contestId == that.contestId;
        }

        @Override
        public int hashCode() {
            return Objects.hash(participantId, contestId);
        }
    }
}
