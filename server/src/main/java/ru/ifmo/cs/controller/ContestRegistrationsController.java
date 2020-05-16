package ru.ifmo.cs.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.ifmo.cs.api.ContestRegistration;
import ru.ifmo.cs.database.ContestParticipantGroupRepository;
import ru.ifmo.cs.database.ContestParticipantRepository;
import ru.ifmo.cs.database.ContestRepository;
import ru.ifmo.cs.database.PersonRepository;
import ru.ifmo.cs.entity.*;

import java.util.HashSet;
import java.util.Set;


@RestController
public class ContestRegistrationsController {
    private final ContestRepository contestRepository;
    private final ContestParticipantRepository contestParticipantRepository;
    private final PersonRepository personRepository;
    private final ContestParticipantGroupRepository contestParticipantGroupRepository;

    public ContestRegistrationsController(ContestRepository contestRepository, ContestParticipantRepository contestParticipantRepository, PersonRepository personRepository, ContestParticipantGroupRepository contestParticipantGroupRepository) {
        this.contestRepository = contestRepository;
        this.contestParticipantRepository = contestParticipantRepository;
        this.personRepository = personRepository;
        this.contestParticipantGroupRepository = contestParticipantGroupRepository;
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
            return registerOnContestSingle(contestId, registration);
        }
        // TODO: split group and single registration API paths
        return registerOnContestGroup(contestId, registration);
    }

    private ResponseEntity<String> registerOnContestGroup(@PathVariable long contestId, @RequestBody ContestRegistration registration) {
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

        contestParticipantGroupRepository.save(contestParticipantGroup);
        return ResponseEntity.ok().build();
    }

    private ResponseEntity<String> registerOnContestSingle(@PathVariable long contestId, @RequestBody ContestRegistration registration) {
        if (!personRepository.existsById(registration.getParticipantId())) {
            return new ResponseEntity<>("person not found", HttpStatus.NOT_FOUND);
        }
        ContestParticipant contestParticipant =
                new ContestParticipant(registration.getParticipantId(), contestId, null, null);
        contestParticipantRepository.save(contestParticipant);
        return ResponseEntity.ok().build();
    }

    @PutMapping(value = "/contest/{contestId}/registration",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> modifyGroupRegistration(@PathVariable long contestId,
                                                     @RequestBody ContestRegistration registration) {
        if (registration.getRegistrationId() == null) {
            return new ResponseEntity<>("this API is only for group registrations, registrationId is null", HttpStatus.BAD_REQUEST);
        }
        if (!contestRepository.existsById(contestId)) {
            return new ResponseEntity<>("not found contest", HttpStatus.NOT_FOUND);
        }
        ContestParticipantGroup oldGroup = contestParticipantGroupRepository.findById(registration.getRegistrationId()).orElse(null);
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
        oldGroup.modify(registration.getGroupName(), members, registration.getResult());
        contestParticipantGroupRepository.save(oldGroup);
        return ResponseEntity.ok().build();
    }

    @PutMapping(path = "/contest/{contestId}/registration/single/{participantId}",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.TEXT_PLAIN_VALUE
    )
    public ResponseEntity<String> modifySingleRegistration(@PathVariable long contestId,
                                                           @PathVariable long participantId,
                                                           @RequestBody ContestRegistration contestRegistration) {
        ContestParticipant.ContestParticipantId id = new ContestParticipant.ContestParticipantId(participantId, contestId);
        ContestParticipant oldRegistration = contestParticipantRepository.findById(id).orElse(null);
        if (oldRegistration == null) {
            return ResponseEntity.notFound().build();
        }
        oldRegistration.updateFields(contestRegistration);
        contestParticipantRepository.save(oldRegistration);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping(value = "/contest/{contestId}/registration/{registrationId}",
            produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> deleteGroupRegistration(
            @PathVariable long contestId,
            @PathVariable long registrationId
    ) {
        if (!contestRepository.existsById(contestId)) {
            return new ResponseEntity<>("not found contest", HttpStatus.NOT_FOUND);
        }
        contestParticipantGroupRepository.deleteById(registrationId);
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
