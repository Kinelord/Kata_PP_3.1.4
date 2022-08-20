package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.AdminService;
import ru.kata.spring.boot_security.demo.service.RegistrationService;

import java.util.List;

@org.springframework.web.bind.annotation.RestController
@RequestMapping(value = "/admin")
public class RestController {


    private final AdminService adminService;
    private final RegistrationService registrationService;

    @Autowired
    public RestController(AdminService adminService, RegistrationService registrationService) {
        this.adminService = adminService;
        this.registrationService = registrationService;
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
        registrationService.register(user);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @PatchMapping(value = "/{id}")
    public ResponseEntity<HttpStatus> updateUser(@PathVariable("id") Long id,
                                                 @RequestBody User user) {
        adminService.updateUser(id, user);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable("id") Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(HttpStatus.OK);
    }
}
