package ru.ifmo.cs.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import ru.ifmo.cs.auth.JwtUtils;
import ru.ifmo.cs.api.LoginRequest;
import ru.ifmo.cs.api.LoginResponse;
import ru.ifmo.cs.database.PersonRepository;
import ru.ifmo.cs.entity.Person;
import ru.ifmo.cs.utils.Check;
import ru.ifmo.cs.utils.RestPaths;


@RestController
public class LoginController {

    private final AuthenticationManager authenticationManager;
    private final PersonRepository personRepository;
    private final JwtUtils jwtUtils;

    public LoginController(AuthenticationManager authenticationManager,
                           PersonRepository personRepository, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.personRepository = personRepository;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping(value = RestPaths.Login.LOGIN, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
        } catch (AuthenticationException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        final Person person = personRepository.findByEmail(loginRequest.getEmail());
        final String authToken = jwtUtils.generateToken(person.getEmail());
        return ResponseEntity.ok(new LoginResponse(authToken, person));
    }

    @GetMapping(value = RestPaths.Login.AUTH, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody ResponseEntity<Person> getPersonInfoByToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AnonymousAuthenticationToken) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Person person = personRepository.findByEmail(userDetails.getUsername());
        return ResponseEntity.ok(person);
    }

    @PostMapping(value = RestPaths.Login.REGISTER, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<LoginResponse> createPerson(@RequestBody Person person) {
        Check.notNull(person.getPassword(), "password shouldn't be null");
        Person savedPerson = personRepository.save(person);
        String token = jwtUtils.generateToken(savedPerson.getEmail());
        return ResponseEntity.ok(new LoginResponse(token, savedPerson));
    }
}
