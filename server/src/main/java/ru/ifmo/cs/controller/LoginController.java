package ru.ifmo.cs.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import ru.ifmo.cs.auth.JwtUtils;
import ru.ifmo.cs.auth.LoginRequest;
import ru.ifmo.cs.auth.LoginResponse;
import ru.ifmo.cs.database.PersonRepository;
import ru.ifmo.cs.entity.Person;


@RestController
@CrossOrigin
public class LoginController {

    private final AuthenticationManager authenticationManager;
    private final PersonRepository personRepository;

    public LoginController(AuthenticationManager authenticationManager, PersonRepository personRepository) {
        this.authenticationManager = authenticationManager;
        this.personRepository = personRepository;
    }

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
        } catch (AuthenticationException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        final Person person = personRepository.findByEmail(loginRequest.getEmail());
        final String authToken = JwtUtils.generateToken(person.getEmail());
        return ResponseEntity.ok(new LoginResponse(authToken, person));
    }
}
