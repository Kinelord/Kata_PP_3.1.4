package ru.kata.spring.boot_security.demo.service;


import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;

public interface AdminService extends UserDetailsService {
    List<User> getUsers();

    User getUser(Long id);
    Iterable<Role> findAllRoles();

    void updateUser(Long id, User user);

    void deleteUser(Long id);


}
