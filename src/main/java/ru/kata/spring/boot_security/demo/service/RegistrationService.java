package ru.kata.spring.boot_security.demo.service;

import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.models.User;

import java.util.Optional;


public interface RegistrationService {
    @Transactional
    void register(User user);

    Optional<User> checkUserName(String name);
}
