package ru.ifmo.cs.controller;


import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.ifmo.cs.database.PersonRepository;
import ru.ifmo.cs.database.TaskRepository;
import ru.ifmo.cs.entity.Person;
import ru.ifmo.cs.utils.RestPaths;

import java.util.Collections;

@RestController
public class TaskController {
    private final TaskRepository taskRepository;
    private final PersonRepository personRepository;

    public TaskController(TaskRepository taskRepository, PersonRepository personRepository) {
        this.taskRepository = taskRepository;
        this.personRepository = personRepository;
    }

    @GetMapping(value = RestPaths.Task.GET_ALL, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    Iterable<ru.ifmo.cs.entity.Task> getAllTasks() {
        return taskRepository.findAllOrderByNameAndStatus();
    }

    @GetMapping(value = RestPaths.Task.ROOT + "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ru.ifmo.cs.entity.Task> getTaskById(@PathVariable long id) {
        return ResponseEntity.of(taskRepository.findById(id));
    }

    @PostMapping(value = RestPaths.Task.ROOT, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ru.ifmo.cs.entity.Task createTask(@RequestBody ru.ifmo.cs.entity.Task task) {
        return taskRepository.save(task);
    }

    @PutMapping(value = RestPaths.Task.ROOT, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ru.ifmo.cs.entity.Task> modifyTask(@RequestBody ru.ifmo.cs.entity.Task newTask) {
        ru.ifmo.cs.entity.Task oldTask = taskRepository.findById(newTask.getId()).orElse(null);
        if (oldTask == null) {
            return ResponseEntity.notFound().build();
        }
        oldTask.updateFields(newTask);
        return ResponseEntity.ok(taskRepository.save(oldTask));
    }

    @DeleteMapping(value = RestPaths.Task.ROOT + "/{id}")
    public ResponseEntity deleteTask(@PathVariable long id) {
        if (!taskRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        taskRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping(value = RestPaths.Task.ROOT + "/assignee", produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<Person> findMatchingVolunteerForTask(
            @RequestParam(required = false) Long startDateTime,
            @RequestParam(required = false) Long endDateTime
    ) {
        Iterable<Person> person = personRepository.findAll();
        // TODO: implement best volunteer search
        return Collections.singleton(person.iterator().next());
    }
}
