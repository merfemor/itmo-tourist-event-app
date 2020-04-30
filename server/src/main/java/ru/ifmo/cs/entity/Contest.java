package ru.ifmo.cs.entity;

import com.fasterxml.jackson.annotation.JsonCreator;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Contest {
    @Id
    @GeneratedValue
    private Long id;
    @Column(nullable = false)
    private String name;
    private String description;
    @Column(nullable = false)
    private Date startDateTime;
    @Column(nullable = false)
    private Date endDateTime;
    @Column(nullable = false)
    private ResultStructure resultStructure;
    @Column(nullable = false)
    private RegistrationType registrationType;
    @Column(nullable = false)
    private ParticipantType participantType;

    protected Contest() {
        /* for ORM */
    }

    @JsonCreator
    public Contest(Long id, String name, String description, Date startDateTime, Date endDateTime, ResultStructure resultStructure, RegistrationType registrationType, ParticipantType participantType) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
        this.resultStructure = resultStructure;
        this.registrationType = registrationType;
        this.participantType = participantType;
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

    public Date getStartDateTime() {
        return startDateTime;
    }

    public Date getEndDateTime() {
        return endDateTime;
    }

    public ResultStructure getResultStructure() {
        return resultStructure;
    }

    public RegistrationType getRegistrationType() {
        return registrationType;
    }

    public ParticipantType getParticipantType() {
        return participantType;
    }

    public void updateFields(Contest contest) {
        this.name = contest.name;
        this.description = contest.description;
        this.startDateTime = contest.startDateTime;
        this.endDateTime = contest.endDateTime;
        this.resultStructure = contest.resultStructure;
        this.registrationType = contest.registrationType;
        this.participantType = contest.participantType;
    }
}
