package ru.ifmo.cs.database;

import org.springframework.data.repository.CrudRepository;
import ru.ifmo.cs.entity.ContestParticipantGroup;
import ru.ifmo.cs.entity.Person;

public interface ContestParticipantGroupRepository extends CrudRepository<ContestParticipantGroup, Long> {
    Iterable<ContestParticipantGroup> findByMembersContains(Person person);
}
