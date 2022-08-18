package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.repository.UserRepository;

import java.util.Optional;

@Service
@Transactional
public class RegistrationServiceImpl implements RegistrationService {

    private final UserRepository userRepo;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public RegistrationServiceImpl(UserRepository userRepo, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepo = userRepo;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public void register(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        userRepo.save(user);
    }

    public Optional<User> checkUserName(String email) {
        return userRepo.findByEmail(email);
    }

}
