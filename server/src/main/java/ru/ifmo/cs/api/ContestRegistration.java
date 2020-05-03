package ru.ifmo.cs.api;

import com.fasterxml.jackson.annotation.JsonCreator;

public class ContestRegistration {
    private Long participantId;
    private Long registrationId;
    private String groupName;
    private long[] participantIds;

    @JsonCreator
    public ContestRegistration(Long participantId, Long registrationId, String groupName, long[] participantIds) {
        if (participantId == null && participantIds == null) {
            throw new IllegalArgumentException("either participantId or participantIds should be set");
        }
        if (participantIds != null && participantIds.length < 2) {
            throw new IllegalArgumentException("at least two participantIds should be set");
        }
        this.participantId = participantId;
        this.registrationId = registrationId;
        this.groupName = groupName;
        this.participantIds = participantIds;
    }

    public Long getParticipantId() {
        return participantId;
    }

    public Long getRegistrationId() {
        return registrationId;
    }

    public String getGroupName() {
        return groupName;
    }

    public long[] getParticipantIds() {
        return participantIds;
    }
}
