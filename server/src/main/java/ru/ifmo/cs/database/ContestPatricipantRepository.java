package ru.ifmo.cs.database;

import org.springframework.data.repository.CrudRepository;
import ru.ifmo.cs.entity.Contest;
import ru.ifmo.cs.entity.ContestParticipant;

public interface ContestPatricipantRepository
        extends CrudRepository<ContestParticipant, ContestParticipant.ContestParticipantId> {
}
