package ru.ifmo.cs.database;

import org.springframework.data.domain.Sort;
import org.springframework.data.repository.PagingAndSortingRepository;
import ru.ifmo.cs.entity.Task;

public interface TaskRepository extends PagingAndSortingRepository<Task, Long> {
    default Iterable<Task> findAllOrderByNameAndStatus() {
        return findAll(Sort.by("isDone", "name"));
    }
}
