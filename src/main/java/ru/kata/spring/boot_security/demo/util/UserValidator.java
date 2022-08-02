package ru.kata.spring.boot_security.demo.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.RegistrationService;

import java.util.Optional;

@Component
public class UserValidator implements Validator {

    private RegistrationService registrationService;

    @Autowired
    public UserValidator(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return User.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        User user = (User) target;
        Optional<User> user1 = registrationService.checkUserName(user.getUsername());
        if (!user1.isEmpty()) {
            errors.rejectValue("username", "", "A user with this name already exists");
        } else if (!user.getPassword().equals(user.getPasswordConfirm())) {
            errors.rejectValue("password", "", "Passwords don't match");
        }
    }
}
