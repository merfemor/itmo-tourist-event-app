package ru.ifmo.cs.api;

import com.fasterxml.jackson.annotation.JsonCreator;
import ru.ifmo.cs.entity.Result;
import ru.ifmo.cs.utils.Check;

import java.util.Date;

// TODO: split into single and group registration
public class ContestRegistration {
    private Long participantId;
    private Long registrationId;
    private String groupName;
    private long[] participantIds;
    private Date startDateTime;
    private Result result;

    @JsonCreator
    public ContestRegistration(Long participantId, Long registrationId, String groupName, long[] participantIds,
                               Date startDateTime, Result result) {
        Check.anyNotNull("either participantId or participantIds should be set", participantId, participantIds);
        Check.minSizeOrNull(participantIds, 2, "at least 2 participantIds should be set");
        this.participantId = participantId;
        this.registrationId = registrationId;
        this.groupName = groupName;
        this.startDateTime = startDateTime;
        this.participantIds = participantIds;
        this.result = result;
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

    public Result getResult() {
        return result;
    }

    public Date getStartDateTime() {
        return startDateTime;
    }
}
