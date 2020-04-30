package ru.ifmo.cs.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.ifmo.cs.database.PersonRepository;
import ru.ifmo.cs.entity.Person;

import java.util.Objects;

// TODO: implement validation of requests
@RestController
public class PersonController {
    private final PersonRepository personRepository;

    public PersonController(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    @GetMapping(value = "/person", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody Iterable<Person> getAllPerson() {
        return personRepository.findAll();
    }

    @GetMapping(value = "/person/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Person> getPersonById(@PathVariable Long id) {
        return ResponseEntity.of(personRepository.findById(id));
    }

    @PostMapping(value = "/person", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody Person createPerson(@RequestBody Person person) {
        return personRepository.save(person);
    }

    @PutMapping(value = "/person", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Person> modifyPerson(@RequestBody Person newPerson) {
        Person oldPerson = personRepository.findById(newPerson.getId()).orElse(null);
        if (oldPerson == null) {
            return ResponseEntity.notFound().build();
        }
        boolean emailChanged = !Objects.equals(oldPerson.getEmail(), newPerson.getEmail());
        boolean passwordChanged = !Objects.equals(oldPerson.getPassword(), newPerson.getPassword());
        if (emailChanged || passwordChanged) {
            // TODO: implement password and email change
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
        }
        oldPerson.updateFields(newPerson);
        return ResponseEntity.ok(personRepository.save(oldPerson));
    }
}
