package ru.ifmo.cs.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.lang.NonNull;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

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
    @OneToMany(mappedBy = "contest", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<ContestParticipant> singleParticipants;
    @OneToMany(mappedBy = "associatedContest", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<ContestParticipantGroup> contestParticipantGroups;
    @OneToMany(mappedBy = "associatedContest", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Task> associatedTasks;

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

    @NonNull
    public RegistrationType getRegistrationType() {
        return registrationType;
    }

    public ParticipantType getParticipantType() {
        return participantType;
    }

    public Set<ContestParticipant> getSingleParticipants() {
        return singleParticipants;
    }

    public Set<ContestParticipantGroup> getContestParticipantGroups() {
        return contestParticipantGroups;
    }

    public Set<Task> getAssociatedTasks() {
        return associatedTasks;
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
