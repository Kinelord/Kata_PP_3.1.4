package ru.kata.spring.boot_security.demo.service;


import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;

public interface AdminService extends UserDetailsService {
    List<User> getUsers();

    User getUser(Long id);

    void updateUser(Long id, User user);

    void deleteUser(Long id);


}
