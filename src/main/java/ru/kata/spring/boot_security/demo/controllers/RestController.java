package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.service.AdminService;
import ru.kata.spring.boot_security.demo.service.RegistrationService;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@org.springframework.web.bind.annotation.RestController
@RequestMapping(value = "/admin")
public class RestController {


    private final AdminService adminService;
    private final RoleRepository roleRepository;
    private final RegistrationService registrationService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public RestController(AdminService adminService, RoleRepository roleRepository, RegistrationService registrationService, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.adminService = adminService;
        this.roleRepository = roleRepository;
        this.registrationService = registrationService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }


    @GetMapping("/{id}")
    public ResponseEntity<User> findById(@PathVariable("id") Long id) {
        return new ResponseEntity<>(adminService.getUser(id), HttpStatus.OK);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> findAll() {
        return new ResponseEntity<>(adminService.getUsers(), HttpStatus.OK);
    }
    @GetMapping(value = "/roles")
    public ResponseEntity<Iterable<Role>> findAllRoles() {
        return ResponseEntity.ok(adminService.findAllRoles());
    }

    @PostMapping(value = "/create")
    public ResponseEntity<HttpStatus> add(@RequestBody User user) {
        Set<Role> rolesSet = new HashSet<>();
        for (Role role : user.getRoles()) {
            rolesSet.add(roleRepository.findByName(role.getName()).get());
        }
        user.setRoles(rolesSet);

        registrationService.register(user);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @PatchMapping(value = "/{id}")
    public ResponseEntity<HttpStatus> updateUser(@PathVariable("id") Long id,
                                                 @RequestBody User user) {
        User userDb = null;
        if(user.getRoles().size() == 0 || user.getPassword().equals("")) {
            userDb = adminService.getUser(id);
        }
        if (user.getRoles().size() == 0) {
            user.setRoles(userDb.getRoles());
        }


        if (user.getPassword().equals("")) {
            user.setPassword(userDb.getPassword());
        } else {
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        }
        adminService.updateUser(id, user);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable("id") Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(HttpStatus.OK);
    }


}
