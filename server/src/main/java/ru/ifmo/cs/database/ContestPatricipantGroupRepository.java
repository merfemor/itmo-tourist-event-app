package ru.ifmo.cs.database;

import org.springframework.data.repository.CrudRepository;
import ru.ifmo.cs.entity.ContestParticipantGroup;

public interface ContestPatricipantGroupRepository extends CrudRepository<ContestParticipantGroup, Long> {
}
