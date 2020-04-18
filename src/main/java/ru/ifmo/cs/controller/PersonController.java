package ru.ifmo.cs.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.ifmo.cs.database.PersonRepository;
import ru.ifmo.cs.entity.Person;

@RestController
public class PersonController {
    private final PersonRepository personRepository;

    public PersonController(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }


    @GetMapping("/")
    public String helloWorld() {
        return "Hello, world!";
    }

    @GetMapping(value = "/person")
    public Iterable<Person> getAllPerson() {
        return personRepository.findAll();
    }

    @PostMapping(value = "/person")
    public Person createPerson(Person person) {
        return personRepository.save(person);
    }
}
