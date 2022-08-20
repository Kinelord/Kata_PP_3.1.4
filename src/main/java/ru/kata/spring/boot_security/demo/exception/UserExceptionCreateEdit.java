package ru.kata.spring.boot_security.demo.exception;

import org.springframework.validation.FieldError;
import ru.kata.spring.boot_security.demo.models.User;

import java.util.Collections;
import java.util.List;

public class UserExceptionCreateEdit extends RuntimeException{
    private final User user;
    private final List<FieldError> fieldErrors;
    public UserExceptionCreateEdit(String message, User user, List<FieldError> fieldErrors) {
        super(message);
        this.user = user;
        this.fieldErrors = fieldErrors;
    }
    public User getUser() {
        return user;
    }

    public List<FieldError> getFieldErrors() {
        return fieldErrors == null ? Collections.emptyList() : fieldErrors;
    }
}
