package com.redbird.rbcc;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Locale;
import java.util.Map;

/**
 * Handles registration before the controller so team members can use Chinese,
 * English, or numeric account names while the existing controller is open in
 * the IDE.
 */
@Component
public class RegistrationFilter extends OncePerRequestFilter {
    private final AccountRepository accountRepository;
    private final ObjectMapper objectMapper;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public RegistrationFilter(AccountRepository accountRepository, ObjectMapper objectMapper) {
        this.accountRepository = accountRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !"POST".equalsIgnoreCase(request.getMethod())
                || !"/api/auth/register".equals(request.getRequestURI());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        JsonNode payload;
        try {
            payload = objectMapper.readTree(request.getInputStream());
        } catch (IOException error) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("message", "Invalid registration request"));
            return;
        }

        String username = normalizeUsername(payload.path("username").asText());
        String password = payload.path("password").asText("");
        if (!username.matches("[\\p{L}\\p{N}_-]{2,40}")) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST,
                    Map.of("message", "账号需为 2-40 位汉字、字母、数字、下划线或连字符"));
            return;
        }
        if (password.length() < 6 || password.length() > 72) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of("message", "密码长度需为 6-72 位"));
            return;
        }
        if (accountRepository.existsByUsername(username)) {
            writeJson(response, HttpServletResponse.SC_CONFLICT, Map.of("message", "该账号已注册，请直接登录"));
            return;
        }

        Account account = new Account();
        account.setUsername(username);
        account.setPasswordHash(passwordEncoder.encode(password));
        accountRepository.save(account);

        HttpSession session = request.getSession(true);
        session.setAttribute(AuthController.AUTHENTICATED_KEY, true);
        session.setAttribute(AuthController.USERNAME_KEY, account.getUsername());
        session.setAttribute(AuthController.USER_ID_KEY, account.getId());
        writeJson(response, HttpServletResponse.SC_CREATED,
                Map.of("authenticated", true, "username", account.getUsername()));
    }

    private String normalizeUsername(String username) {
        return username == null ? "" : username.trim().toLowerCase(Locale.ROOT);
    }

    private void writeJson(HttpServletResponse response, int status, Map<String, Object> body) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json;charset=UTF-8");
        objectMapper.writeValue(response.getOutputStream(), body);
    }
}
