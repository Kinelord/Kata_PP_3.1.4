package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.security.UserDetailsImpl;

import javax.servlet.http.HttpSession;

@Service
public class AuthServiceImpl implements AuthService{
    @Override
    public String getPage(Model model, HttpSession session, Authentication auth) {
        UserDetailsImpl userDetails =(UserDetailsImpl) auth.getPrincipal();
        User user = userDetails.user();
                model.addAttribute("user", user);
        if (user.hasRole("ADMIN")) {
            return "admin/AdminPage";
        } else {
            return "user/UserPage";
        }

    }
}
