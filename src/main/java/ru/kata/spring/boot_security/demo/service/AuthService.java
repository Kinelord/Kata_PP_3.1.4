package ru.kata.spring.boot_security.demo.service;

import org.springframework.lang.Nullable;
import org.springframework.security.core.Authentication;
import org.springframework.ui.Model;

import javax.servlet.http.HttpSession;

public interface AuthService {

    String getPage(Model model, HttpSession session, @Nullable Authentication auth);
}
