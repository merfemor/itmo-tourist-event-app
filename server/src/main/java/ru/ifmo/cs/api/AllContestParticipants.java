package ru.ifmo.cs.api;

import ru.ifmo.cs.entity.ContestParticipant;
import ru.ifmo.cs.entity.ContestParticipantGroup;

public class AllContestParticipants {
    private Iterable<ContestParticipant> singleParticipants;
    private Iterable<ContestParticipantGroup> participantGroups;

    public AllContestParticipants(Iterable<ContestParticipant> singleParticipants, Iterable<ContestParticipantGroup> participantGroups) {
        this.singleParticipants = singleParticipants;
        this.participantGroups = participantGroups;
    }

    public Iterable<ContestParticipant> getSingleParticipants() {
        return singleParticipants;
    }

    public Iterable<ContestParticipantGroup> getParticipantGroups() {
        return participantGroups;
    }
}
