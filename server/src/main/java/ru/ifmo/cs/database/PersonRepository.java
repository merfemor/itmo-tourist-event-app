package ru.ifmo.cs.database;

import org.springframework.data.domain.Sort;
import org.springframework.data.repository.PagingAndSortingRepository;
import ru.ifmo.cs.entity.Person;
import ru.ifmo.cs.entity.UserRole;

public interface PersonRepository extends PagingAndSortingRepository<Person, Long> {
    Person findByEmail(String email);

    Iterable<Person> findByRole(UserRole role);

    default Iterable<Person> findAllOrderByFullName() {
        return findAll(Sort.by("lastName", "firstName", "middleName"));
    }

    boolean existsByEmail(String email);
}
