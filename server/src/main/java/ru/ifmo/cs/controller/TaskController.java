package ru.ifmo.cs.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.ifmo.cs.database.PersonRepository;
import ru.ifmo.cs.database.TaskRepository;
import ru.ifmo.cs.entity.Person;
import ru.ifmo.cs.utils.RestPaths;

import java.util.Collections;
import java.util.Date;

@RestController
public class TaskController {
    private final TaskRepository taskRepository;
    private final BestAssigneeFinder bestAssigneeFinder;

    public TaskController(TaskRepository taskRepository,
                          BestAssigneeFinder bestAssigneeFinder) {
        this.taskRepository = taskRepository;
        this.bestAssigneeFinder = bestAssigneeFinder;
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
    public ResponseEntity<Iterable<Person>> findAssigneeForTask(
            @RequestParam(required = false) Long startDateTime,
            @RequestParam(required = false) Long endDateTime
    ) {
        if (startDateTime == null && endDateTime == null) {
            Person assignee = bestAssigneeFinder.find();
            Iterable<Person> result;
            if (assignee != null) {
                result = Collections.singletonList(assignee);
            } else {
                result = Collections.emptyList();
            }
            return ResponseEntity.ok(result);
        }

        if (startDateTime == null || endDateTime == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Date start = new Date(startDateTime);
        Date end = new Date(endDateTime);

        if (!start.before(end)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Person assignee = bestAssigneeFinder.findForTime(start, end);
        Iterable<Person> result;
        if (assignee != null) {
            result = Collections.singletonList(assignee);
        } else {
            result = Collections.emptyList();
        }
        return ResponseEntity.ok(result);
    }
}
