package ru.kata.spring.boot_security.demo.util;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.RegistrationService;
import ru.kata.spring.boot_security.demo.service.RoleService;

import java.util.Set;

@Component
public class InitDataBase implements InitializingBean {

    private RegistrationService registrationService;
    private RoleService roleService;

    @Autowired
    public InitDataBase(RegistrationService registrationService, RoleService roleService) {
        this.registrationService = registrationService;
        this.roleService = roleService;
    }

    @Override
    @Transactional
    public void afterPropertiesSet() throws Exception {
        Role adminRole = new Role("ADMIN");
        Role userRole = new Role("USER");
        roleService.add(adminRole);
        roleService.add(userRole);

        User[] users = new User[]{
                new User("Admin"
                        , "Adminov"
                        , 25
                        , "admin@mail.com"
                        , "admin"
                        , Set.of(adminRole)),

                new User("User"
                        , "Userov"
                        , 24
                        , "user@mail.com"
                        , "user"
                        , Set.of(userRole)),

                new User("Test"
                        , "Test"
                        , 22
                        , "test@mail.com"
                        , "test"
                        , Set.of(adminRole, userRole))
        };
        registrationService.register(users[0]);
        registrationService.register(users[1]);
        registrationService.register(users[2]);
    }
}
