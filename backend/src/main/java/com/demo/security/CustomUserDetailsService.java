package com.demo.security;

import com.demo.model.Usuario;
import com.demo.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

private final UsuarioRepository usuarioRepository;
   
@Override
public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    System.out.println("Buscando usuario: " + email);
    Usuario usuario = usuarioRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con correo: " + email));
    System.out.println("Usuario encontrado: " + usuario.getEmail());
    System.out.println("Buscando: " + email);
    System.out.println("Usuario encontrado: " + usuario);
    return User.builder()
        .username(usuario.getEmail())
        .password(usuario.getPassword())
        .authorities(usuario.getRole())
        .build();
        
}
}

