package com.mdimpresiones.api.security;

import com.mdimpresiones.api.security.dto.LoginRequest;
import com.mdimpresiones.api.security.dto.LoginResponse;
import com.mdimpresiones.api.user.AdminUser;
import com.mdimpresiones.api.user.AdminUserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/** Login del panel de administracion. */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AdminUserRepository users;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService,
            AdminUserRepository users) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.users = users;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password()));
        } catch (BadCredentialsException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario o contrasena incorrectos");
        } catch (AuthenticationException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No pudimos iniciar tu sesion");
        }

        AdminUser user = users.findByUsername(request.username())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario inexistente"));

        String token = jwtService.generateToken(user.getUsername(), user.getRole());
        return new LoginResponse(token, jwtService.getExpirationMinutes(), user.getUsername(), user.getFullName());
    }
}
