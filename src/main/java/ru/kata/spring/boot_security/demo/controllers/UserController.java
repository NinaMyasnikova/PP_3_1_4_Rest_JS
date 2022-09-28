package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class UserController {

    @GetMapping(value = "/user")
    public String printUsers() {
        return "user";
    }

    @GetMapping(value = "/403")
    public String accessDenied() {
        return "403";
    }
}
