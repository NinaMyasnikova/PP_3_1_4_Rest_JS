package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Controller
public class AdminController {
    @GetMapping(value = "/admin/users")
    public String printUsers() {
        return "users";
    }
}
