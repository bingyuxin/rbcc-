package com.redbird.rbcc;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    static final String AUTHENTICATED_KEY = "AUTHENTICATED";
    static final String USERNAME_KEY = "USERNAME";
    static final String USER_ID_KEY = "USER_ID";

    private final AccountRepository accountRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthController(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
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
    public ResponseEntity<Map<String, Object>> login(@RequestBody Credentials request, HttpSession session) {
        Account account = accountRepository.findByUsername(normalizeUsername(request.username())).orElse(null);
        if (account == null || request.password() == null || !passwordEncoder.matches(request.password(), account.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("authenticated", false, "message", "账号或密码错误"));
        }
        authenticate(session, account);
        return ResponseEntity.ok(Map.of("authenticated", true, "username", account.getUsername()));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Credentials request, HttpSession session) {
        String username = normalizeUsername(request.username());
        String password = request.password() == null ? "" : request.password();
        if (!username.matches("[a-zA-Z0-9_-]{3,40}")) {
            return ResponseEntity.badRequest().body(Map.of("message", "账号需为 3-40 位字母、数字、下划线或连字符"));
        }
        if (password.length() < 6 || password.length() > 72) {
            return ResponseEntity.badRequest().body(Map.of("message", "密码长度需为 6-72 位"));
        }
        if (accountRepository.existsByUsername(username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "该账号已被注册"));
        }

        Account account = new Account();
        account.setUsername(username);
        account.setPasswordHash(passwordEncoder.encode(password));
        accountRepository.save(account);
        authenticate(session, account);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("authenticated", true, "username", account.getUsername()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.noContent().build();
    }

    public record Credentials(String username, String password) {
    }

    private void authenticate(HttpSession session, Account account) {
        session.setAttribute(AUTHENTICATED_KEY, true);
        session.setAttribute(USERNAME_KEY, account.getUsername());
        session.setAttribute(USER_ID_KEY, account.getId());
    }

    private String normalizeUsername(String username) {
        return username == null ? "" : username.trim().toLowerCase(Locale.ROOT);
    }
}