package ru.ifmo.cs.controller;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.ifmo.cs.database.PersonRepository;
import ru.ifmo.cs.entity.Person;
import ru.ifmo.cs.entity.UserRole;
import ru.ifmo.cs.utils.Check;

import javax.annotation.PostConstruct;
import java.util.Objects;

// TODO: implement validation of requests
@RestController
public class PersonController {
    private static final Logger log = LoggerFactory.getLogger(PersonController.class);
    private final PersonRepository personRepository;
    @Value("${admin.default-email}")
    private String adminDefaultEmail;
    @Value("${admin.default-password}")
    private String adminDefaultPassword;

    public PersonController(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    @GetMapping(value = "/person", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody Iterable<Person> getAllPerson() {
        return personRepository.findAllOrderByFullName();
    }

    @GetMapping(value = "/person/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Person> getPersonById(@PathVariable Long id) {
        return ResponseEntity.of(personRepository.findById(id));
    }

    @PostMapping(value = "/person", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Person createPerson(@RequestBody Person person) {
        Check.isTrue(person.getPassword() == null && person.getRole() == UserRole.PARTICIPANT, "can only create users with role = " + UserRole.PARTICIPANT + " and null password");
        return personRepository.save(person);
    }

    private static boolean isForbiddenChange(String oldValue, String newValue) {
        return newValue != null && !Objects.equals(oldValue, newValue);
    }

    @PutMapping(value = "/person", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Person> modifyPerson(@RequestBody Person newPerson) {
        Person oldPerson = personRepository.findById(newPerson.getId()).orElse(null);
        if (oldPerson == null) {
            return ResponseEntity.notFound().build();
        }
        boolean emailChanged = isForbiddenChange(oldPerson.getEmail(), newPerson.getEmail());
        boolean passwordChanged = isForbiddenChange(oldPerson.getPassword(), newPerson.getPassword());
        if (emailChanged || passwordChanged) {
            // TODO: implement password and email change
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
        }
        oldPerson.updateFields(newPerson);
        return ResponseEntity.ok(personRepository.save(oldPerson));
    }

    @PostConstruct
    private void createAdminIfNeeded() {
        if (personRepository.existsByEmail(adminDefaultEmail)) {
            log.debug("Skip create of admin already exists");
            return;
        }
        Person admin = new Person(null, adminDefaultEmail, adminDefaultPassword, "admin", "admin", null, true, null, UserRole.ORGANIZER, null, null, null, null, null, null, null);
        admin = personRepository.save(admin);
        log.debug("Created admin with id = " + admin.getId() + " and email = " + adminDefaultEmail);

        // not required any more
        adminDefaultEmail = null;
        adminDefaultPassword = null;
    }
}
