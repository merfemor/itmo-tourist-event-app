package ru.ifmo.cs.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import ru.ifmo.cs.entity.*;

import java.util.Date;
import java.util.Set;

public class ContestResponse {
    public final long id;
    public final String name;
    public final String description;
    public final Date startDateTime;
    public final Date endDateTime;
    public final ResultStructure resultStructure;
    public final RegistrationType registrationType;
    public final ParticipantType participantType;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public final Set<ContestParticipant> singleParticipants;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public final Set<ContestParticipantGroup> contestParticipantGroups;

    public ContestResponse(Contest contest, boolean includeRegistrations) {
        this.id = contest.getId();
        this.name = contest.getName();
        this.description = contest.getDescription();
        this.startDateTime = contest.getStartDateTime();
        this.endDateTime = contest.getEndDateTime();
        this.resultStructure = contest.getResultStructure();
        this.registrationType = contest.getRegistrationType();
        this.participantType = contest.getParticipantType();
        if (includeRegistrations) {
            this.singleParticipants = contest.getSingleParticipants();
            this.contestParticipantGroups = contest.getContestParticipantGroups();
        } else {
            this.singleParticipants = null;
            this.contestParticipantGroups = null;
        }
    }
}
