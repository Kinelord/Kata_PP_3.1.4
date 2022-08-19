package ru.kata.spring.boot_security.demo.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.kata.spring.boot_security.demo.service.AuthService;

import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("/")
public class AuthenticationController {

    private final AuthService authService;
    @Autowired
    public AuthenticationController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping
    public String openPage(Model model, HttpSession session, @Nullable Authentication auth) {
        return authService.getPage(model, session, auth);
    }

}
