package ru.ifmo.cs.database;

import org.springframework.data.repository.CrudRepository;
import ru.ifmo.cs.entity.Contest;

public interface ContestRepository extends CrudRepository<Contest, Long> {
}
