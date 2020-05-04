package ru.ifmo.cs.controller;


import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.ifmo.cs.database.PersonRepository;
import ru.ifmo.cs.database.TaskRepository;
import ru.ifmo.cs.entity.Person;
import ru.ifmo.cs.entity.Task;

import java.util.Collections;
import java.util.Date;

@RestController
public class TaskController {
    private final TaskRepository taskRepository;
    private final PersonRepository personRepository;

    public TaskController(TaskRepository taskRepository, PersonRepository personRepository) {
        this.taskRepository = taskRepository;
        this.personRepository = personRepository;
    }

    @GetMapping(value = "/tasks", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    Iterable<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @GetMapping(value = "/task/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Task> getTaskById(@PathVariable long id) {
        return ResponseEntity.of(taskRepository.findById(id));
    }

    @PostMapping(value = "/task", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Task createTask(@RequestBody Task task) {
        return taskRepository.save(task);
    }

    @PutMapping(value = "/task", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Task> modifyTask(@RequestBody Task newTask) {
        Task oldTask = taskRepository.findById(newTask.getId()).orElse(null);
        if (oldTask == null) {
            return ResponseEntity.notFound().build();
        }
        oldTask.updateFields(newTask);
        return ResponseEntity.ok(taskRepository.save(oldTask));
    }

    @DeleteMapping(value = "/task/{id}")
    public ResponseEntity deleteTask(@PathVariable long id) {
        if (!taskRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        taskRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping(value = "/task/assignee", produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<Person> findMatchingVolunteerForTask(
            @RequestParam(required = false) Long startDateTime,
            @RequestParam(required = false) Long endDateTime
    ) {
        Iterable<Person> person = personRepository.findAll();
        // TODO: implement best volunteer search
        return Collections.singleton(person.iterator().next());
    }
}
