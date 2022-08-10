package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.security.UserDetailsImpl;
import ru.kata.spring.boot_security.demo.service.AdminService;
import ru.kata.spring.boot_security.demo.service.RegistrationService;
import ru.kata.spring.boot_security.demo.util.UserValidator;

import java.util.HashSet;
import java.util.Set;

@Controller
@RequestMapping(value = "/admin", produces = MediaType.APPLICATION_JSON_VALUE + "; charset=utf-8")
public class AdminController {

    private final RegistrationService registrationService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final AdminService adminService;
    private final RoleRepository roleRepository;

    @Autowired
    public AdminController(RegistrationService registrationService, BCryptPasswordEncoder bCryptPasswordEncoder, AdminService adminService, UserValidator userValidator, RoleRepository roleRepository) {
        this.registrationService = registrationService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.adminService = adminService;
        this.roleRepository = roleRepository;
    }

    @GetMapping
    public String adminPage(Model model) {
        model.addAttribute("users", adminService.getUsers());
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        model.addAttribute("admin", userDetails.user());
        model.addAttribute("newuser", new User());
        return "admin/AdminPage";
    }


    @PostMapping("/create")
    public String add(@ModelAttribute("newuser") User user,
                      @RequestParam(name = "role", required = false) String[] roles) {
        Set<Role> rolesSet = new HashSet<>();
        for (String role : roles) {
            rolesSet.add(roleRepository.findByName(role).get());
        }
        user.setRoles(rolesSet);

        registrationService.register(user);
        return "redirect:/admin";
    }

    @PatchMapping("/{id}")
    public String createUpdateUser(@PathVariable("id") Long id,
                                   @ModelAttribute("user") User user,
                                   @RequestParam(name = "role", required = false) String[] roles) {
        if (roles != null) {
            Set<Role> rolesSet = new HashSet<>();
            for (String role : roles) {
                rolesSet.add(roleRepository.findByName(role).get());
            }
            user.setRoles(rolesSet);
        } else {
            user.setRoles(adminService.getUser(user.getId()).getRoles());
        }

        if (user.getPassword().equals("")) {
            user.setPassword(adminService.getUser(user.getId()).getPassword());
        } else {
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        }
        adminService.updateUser(id, user);
        return "redirect:/admin";
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable("id") Long id) {
        adminService.deleteUser(id);
        return "redirect:/admin";
    }

}
