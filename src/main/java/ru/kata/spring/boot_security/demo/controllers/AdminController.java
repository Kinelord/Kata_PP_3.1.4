package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import ru.kata.spring.boot_security.demo.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.security.UserDetailsImpl;
import ru.kata.spring.boot_security.demo.service.AdminService;
import ru.kata.spring.boot_security.demo.service.RegistrationService;
import ru.kata.spring.boot_security.demo.util.UserValidator;

import javax.validation.Valid;

@Controller
@RequestMapping(value = "/admin", produces = MediaType.APPLICATION_JSON_VALUE + "; charset=utf-8")
public class AdminController {

    private final RegistrationService registrationService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final AdminService adminService;
    private final UserValidator userValidator;

    @Autowired
    public AdminController(RegistrationService registrationService, BCryptPasswordEncoder bCryptPasswordEncoder, AdminService adminService, UserValidator userValidator) {
        this.registrationService = registrationService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.adminService = adminService;
        this.userValidator = userValidator;
    }

    @GetMapping
    public String getUsers(Model model) {
        model.addAttribute("users", adminService.getUsers());
        return "admin/tableUser";
    }

    @GetMapping("/user/{id}")
    public String getUser(@PathVariable("id") Long id, Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl principal = (UserDetailsImpl) authentication.getPrincipal();
        if (principal.user().getId().equals(id)) {
            return "redirect:/user";
        }
        model.addAttribute("user", adminService.getUser(id));
        return "user/oneUser";
    }

    @GetMapping("/user")
    public String getMyUser(Model model) {
        model.addAttribute("user", adminService.getMyUser());
        return "user/oneUser";
    }

    @GetMapping("/new")
    public String newPerson(Model model) {
        model.addAttribute("user", new User());
        return "admin/newUser";
    }

    @PostMapping("/create")
    public String add(@ModelAttribute("user") @Valid User user,
                      BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "admin/newUser";
        }
        userValidator.validate(user, bindingResult);

        if (bindingResult.hasErrors()) {
            return "admin/newUser";
        }

        registrationService.register(user);
        return "redirect:/admin";
    }

    @GetMapping("/{id}/edit")
    public String updateUser(@PathVariable("id") Long id, Model model) {
        model.addAttribute("user", adminService.getUser(id));
        model.addAttribute("pass", adminService.getUser(id).getPassword());
        return "admin/updateUser";
    }

    @PatchMapping("/{id}")
    public String createUpdateUser(@PathVariable("id") Long id,
                                   @ModelAttribute("user") @Valid User user,
                                   BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "admin/updateUser";
        }

        if(user.getPassword() == null){
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

    @DeleteMapping("/deleteAll")
    public String deleteAllUser() {
        adminService.deleteAllUser();
        return "redirect:/admin";
    }
}
