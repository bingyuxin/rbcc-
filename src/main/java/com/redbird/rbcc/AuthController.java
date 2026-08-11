package com.redbird.rbcc;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    static final String AUTHENTICATED_KEY = "AUTHENTICATED";
    static final String USERNAME_KEY = "USERNAME";

    private final String username;
    private final String password;

    public AuthController(
            @Value("${rbcc.auth.username:admin}") String username,
            @Value("${rbcc.auth.password:123456}") String password) {
        this.username = username;
        this.password = password;
    }

    @GetMapping("/me")
    public Map<String, Object> me(HttpSession session) {
        boolean authenticated = Boolean.TRUE.equals(session.getAttribute(AUTHENTICATED_KEY));
        return Map.of(
                "authenticated", authenticated,
                "username", authenticated ? session.getAttribute(USERNAME_KEY) : ""
        );
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request, HttpSession session) {
        if (username.equals(request.username()) && password.equals(request.password())) {
            session.setAttribute(AUTHENTICATED_KEY, true);
            session.setAttribute(USERNAME_KEY, username);
            return ResponseEntity.ok(Map.of("authenticated", true, "username", username));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("authenticated", false, "message", "账号或密码错误"));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.noContent().build();
    }

    public record LoginRequest(String username, String password) {
    }
}
