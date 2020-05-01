package ru.ifmo.cs.controller;


import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.ifmo.cs.database.ContestRepository;
import ru.ifmo.cs.entity.Contest;


@RestController
@CrossOrigin
public class ContestController {
    private final ContestRepository contestRepository;

    public ContestController(ContestRepository contestRepository) {
        this.contestRepository = contestRepository;
    }

    @GetMapping(value = "/contest", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody Iterable<Contest> getAllContests() {
        return contestRepository.findAll();
    }

    @GetMapping(value = "/contest/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Contest> getContestById(@PathVariable Long id) {
        return ResponseEntity.of(contestRepository.findById(id));
    }

    @PostMapping(value = "/contest", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    Contest createContest(@RequestBody Contest contest) {
        return contestRepository.save(contest);
    }

    @PutMapping(value = "/contest", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Contest> modifyContest(@RequestBody Contest newContest) {
        Contest oldContest = contestRepository.findById(newContest.getId()).orElse(null);
        if (oldContest == null) {
            return ResponseEntity.notFound().build();
        }
        oldContest.updateFields(newContest);
        return ResponseEntity.ok(contestRepository.save(oldContest));
    }
}
