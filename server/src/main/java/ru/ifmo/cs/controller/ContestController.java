package ru.ifmo.cs.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.ifmo.cs.api.ContestRegistration;
import ru.ifmo.cs.api.dto.ContestResponse;
import ru.ifmo.cs.database.ContestPatricipantGroupRepository;
import ru.ifmo.cs.database.ContestPatricipantRepository;
import ru.ifmo.cs.database.ContestRepository;
import ru.ifmo.cs.database.PersonRepository;
import ru.ifmo.cs.entity.Contest;
import ru.ifmo.cs.entity.ContestParticipant;
import ru.ifmo.cs.entity.ContestParticipantGroup;
import ru.ifmo.cs.entity.Person;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;


@RestController
public class ContestController {
    private final ContestRepository contestRepository;
    private final ContestPatricipantRepository contestParticipantRepository;
    private final PersonRepository personRepository;
    private final ContestPatricipantGroupRepository contestPatricipantGroupRepository;

    public ContestController(ContestRepository contestRepository, ContestPatricipantRepository contestParticipantRepository, PersonRepository personRepository, ContestPatricipantGroupRepository contestPatricipantGroupRepository) {
        this.contestRepository = contestRepository;
        this.contestParticipantRepository = contestParticipantRepository;
        this.personRepository = personRepository;
        this.contestPatricipantGroupRepository = contestPatricipantGroupRepository;
    }

    @GetMapping(value = "/contest", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Iterable<Contest> getAllContests() {
        return contestRepository.findAll();
    }

    @DeleteMapping(value = "/contest/{id}")
    public void deleteContest(@PathVariable long id) {
        contestRepository.deleteById(id);
    }

    @GetMapping(value = "/contest/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<ContestResponse> getContestById(
            @PathVariable long id,
            @RequestParam(required = false, defaultValue = "false") boolean includeRegistrations,
            @RequestParam(required = false, defaultValue = "false") boolean includeTasks
    ) {
        Optional<ContestResponse> response = contestRepository.findById(id).map(it ->
                new ContestResponse(it, includeRegistrations, includeTasks)
        );
        return ResponseEntity.of(response);
    }

    @PostMapping(value = "/contest", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Contest createContest(@RequestBody Contest contest) {
        return contestRepository.save(contest);
    }

    @PutMapping(value = "/contest", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Contest> modifyContest(@RequestBody Contest newContest) {
        Contest oldContest = contestRepository.findById(newContest.getId()).orElse(null);
        if (oldContest == null) {
            return ResponseEntity.notFound().build();
        }
        oldContest.updateFields(newContest);
        return ResponseEntity.ok(contestRepository.save(oldContest));
    }

    @PostMapping(value = "/contest/{contestId}/registration",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> registerOnContest(@PathVariable long contestId,
                                                    @RequestBody ContestRegistration registration) {
        if (!contestRepository.existsById(contestId)) {
            return new ResponseEntity<>("contest not found", HttpStatus.NOT_FOUND);
        }
        if (registration.getParticipantId() != null) {
            if (!personRepository.existsById(registration.getParticipantId())) {
                return new ResponseEntity<>("person not found", HttpStatus.NOT_FOUND);
            }
            ContestParticipant contestParticipant =
                    new ContestParticipant(registration.getParticipantId(), contestId, null, null);
            contestParticipantRepository.save(contestParticipant);
            return ResponseEntity.ok().build();
        }

        final Set<Person> members = new HashSet<>(registration.getParticipantIds().length);
        for (long participantId : registration.getParticipantIds()) {
            Person person = personRepository.findById(participantId).orElse(null);
            if (person == null) {
                return new ResponseEntity<>("person with id = " + participantId + " not found", HttpStatus.NOT_FOUND);
            }
            members.add(person);
        }
        ContestParticipantGroup contestParticipantGroup =
                new ContestParticipantGroup(null, contestId, registration.getGroupName(),
                        null, members, null);

        contestPatricipantGroupRepository.save(contestParticipantGroup);
        return ResponseEntity.ok().build();
    }

    @PutMapping(value = "/contest/{contestId}/registration",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> modifyRegistration(@PathVariable long contestId,
                                                     @RequestBody ContestRegistration registration) {
        if (registration.getRegistrationId() == null) {
            return new ResponseEntity<>("registrationId is null", HttpStatus.BAD_REQUEST);
        }
        if (!contestRepository.existsById(contestId)) {
            return new ResponseEntity<>("not found contest", HttpStatus.NOT_FOUND);
        }
        ContestParticipantGroup oldGroup = contestPatricipantGroupRepository.findById(registration.getRegistrationId()).orElse(null);
        if (oldGroup == null) {
            return new ResponseEntity<>("registration not found", HttpStatus.NOT_FOUND);
        }
        final Set<Person> members = new HashSet<>(registration.getParticipantIds().length);
        for (long participantId : registration.getParticipantIds()) {
            Person person = personRepository.findById(participantId).orElse(null);
            if (person == null) {
                return new ResponseEntity<>("not found person with id " + participantId, HttpStatus.NOT_FOUND);
            }
            members.add(person);
        }
        oldGroup.modify(registration.getGroupName(), members);
        contestPatricipantGroupRepository.save(oldGroup);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping(value = "/contest/{contestId}/registration/{registrationId}",
            produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> deleteGroupRegistration(
            @PathVariable("contestId") long contestId,
            @PathVariable("registrationId") long registrationId
    ) {
        if (!contestRepository.existsById(contestId)) {
            return new ResponseEntity<>("not found contest", HttpStatus.NOT_FOUND);
        }
        contestPatricipantGroupRepository.deleteById(registrationId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping(value = "/contest/{contestId}/registration/single/{participantId}",
            produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> deleteSingleRegistration(@PathVariable long contestId,
                                                           @PathVariable long participantId) {
        Contest contest = contestRepository.findById(contestId).orElse(null);
        if (contest == null) {
            return new ResponseEntity<>("not found contest", HttpStatus.NOT_FOUND);
        }
        Person person = personRepository.findById(participantId).orElse(null);
        if (person == null) {
            return new ResponseEntity<>("not found person", HttpStatus.NOT_FOUND);
        }
        ContestParticipant.ContestParticipantId contestParticipantId =
                new ContestParticipant.ContestParticipantId(participantId, contestId);
        contestParticipantRepository.deleteById(contestParticipantId);
        return ResponseEntity.ok().build();
    }
}
