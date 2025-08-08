package com.demo.controller;
import com.demo.model.PruebaConexion;
import com.demo.repository.PruebaConexionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/test")
public class PruebaConexionController {

    private final PruebaConexionRepository repo;

    public PruebaConexionController(PruebaConexionRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<PruebaConexion> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public PruebaConexion crear(@RequestBody PruebaConexion nueva) {
        return repo.save(nueva);
    }
}
