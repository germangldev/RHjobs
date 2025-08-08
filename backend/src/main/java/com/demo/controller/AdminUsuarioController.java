package com.demo.controller;

import com.demo.model.Usuario;
import com.demo.repository.UsuarioRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/usuarios") // ruta solo para ADMIN
@Tag(name = "Usuarios - Admin", description = "Gestión de usuarios (Solo ADMIN)")
@SecurityRequirement(name = "bearerAuth")
public class AdminUsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;
    private final String msgUser = "Usuario no encontrado";

    // Crear un nuevo usuario
    @PostMapping
    public ResponseEntity<?> crearUsuario(@Validated @RequestBody Usuario usuario,
                                          BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors());
        }
        Usuario nuevoUsuario = usuarioRepository.save(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
    }

    // Actualizar usuario
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Long id,
                                               @Validated @RequestBody Usuario usuarioActualizado,
                                               BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors());
        }

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(msgUser));
        usuario.setNombre(usuarioActualizado.getNombre());
        usuario.setEmail(usuarioActualizado.getEmail());

        Usuario usuarioActualizadoDb = usuarioRepository.save(usuario);
        return ResponseEntity.ok(usuarioActualizadoDb);
    }

    // Eliminar usuario
    @DeleteMapping("/{id}")
    public void eliminarUsuario(@PathVariable Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(msgUser));
        usuarioRepository.delete(usuario);
    }


    @Operation(
        summary = "Obtener todos los usuarios", 
        description = "Solo accesible por ADMIN")
        @PreAuthorize("hasRole('ADMIN')")

        @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuarios obtenidos correctamente"),
        @ApiResponse(responseCode = "401", description = "No autenticado. Inicia sesión primero."),
        @ApiResponse(responseCode = "403", description = "Acceso prohibido. Requiere rol ADMIN.")
        })

        @GetMapping
        public List<Usuario> obtenerUsuarios() {
            return usuarioRepository.findAll();
        }

}
