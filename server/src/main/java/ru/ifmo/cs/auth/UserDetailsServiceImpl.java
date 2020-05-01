package ru.ifmo.cs.auth;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import ru.ifmo.cs.database.PersonRepository;
import ru.ifmo.cs.entity.Person;

import java.util.Collections;

@Component
public class UserDetailsServiceImpl implements UserDetailsService {

    private final PersonRepository personRepository;

    public UserDetailsServiceImpl(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        final Person person = personRepository.findByEmail(username);
        if (person == null) {
            throw new UsernameNotFoundException("Not found username \"" + username + "\"");
        }
        return new User(person.getEmail(), person.getPassword(), Collections.emptyList());
    }
}
