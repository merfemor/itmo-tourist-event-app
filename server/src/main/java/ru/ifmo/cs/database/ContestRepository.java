package ru.ifmo.cs.database;

import org.springframework.data.domain.Sort;
import org.springframework.data.repository.PagingAndSortingRepository;
import ru.ifmo.cs.entity.Contest;

public interface ContestRepository extends PagingAndSortingRepository<Contest, Long> {
    default Iterable<Contest> findAllOrderByName() {
        return findAll(Sort.by("name"));
    }
}
