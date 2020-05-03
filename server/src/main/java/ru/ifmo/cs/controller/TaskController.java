package ru.ifmo.cs.controller;


import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.ifmo.cs.database.TaskRepository;
import ru.ifmo.cs.entity.Task;

@RestController
public class TaskController {
    private final TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @GetMapping(value = "/tasks", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody Iterable<Task> getAllTasks() {
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
}
