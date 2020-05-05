package ru.ifmo.cs.controller;


import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.ifmo.cs.api.dto.ContestResponse;
import ru.ifmo.cs.database.ContestRepository;
import ru.ifmo.cs.entity.Contest;

import java.util.Optional;


@RestController
public class ContestController {
    private final ContestRepository contestRepository;

    public ContestController(ContestRepository contestRepository) {
        this.contestRepository = contestRepository;
    }

    @GetMapping(value = "/contest", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Iterable<Contest> getAllContests() {
        return contestRepository.findAllOrderByName();
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
}
