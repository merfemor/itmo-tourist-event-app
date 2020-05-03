package ru.ifmo.cs.database;

import org.springframework.data.repository.CrudRepository;
import ru.ifmo.cs.entity.Task;

public interface TaskRepository extends CrudRepository<Task, Long> {
}
