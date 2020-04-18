package ru.ifmo.cs.database;

import org.springframework.data.repository.CrudRepository;
import ru.ifmo.cs.entity.Person;

public interface PersonRepository extends CrudRepository<Person, Long> {
}
