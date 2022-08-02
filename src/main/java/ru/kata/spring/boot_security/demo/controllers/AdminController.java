package ru.kata.spring.boot_security.demo.controllers;

import ru.kata.spring.boot_security.demo.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.service.AdminService;

import javax.validation.Valid;

@Controller
@RequestMapping(value = "/admin", produces = MediaType.APPLICATION_JSON_VALUE + "; charset=utf-8")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    public String getUsers(Model model) {
        model.addAttribute("users", adminService.getUsers());
        return "admin/tableUser";
    }

    @GetMapping("/user/{id}")
    public String getUser(@PathVariable("id") Long id, Model model) {
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
        adminService.addUser(user);
        return "redirect:/admin";
    }

    @GetMapping("/{id}/edit")
    public String updatePerson(@PathVariable("id") Long id, Model model) {
        model.addAttribute("user", adminService.getUser(id));
        return "admin/updateUser";
    }

    @PatchMapping("/{id}")
    public String createUpdateUser(@PathVariable("id") Long id,
                                   @ModelAttribute("user") @Valid User user,
                                   BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "admin/updateUser";
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
