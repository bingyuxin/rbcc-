package com.redbird.rbcc;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        Object authenticated = request.getSession(false) == null
                ? null
                : request.getSession(false).getAttribute(AuthController.AUTHENTICATED_KEY);
        if (Boolean.TRUE.equals(authenticated)) {
            return true;
        }
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "请先登录");
        return false;
    }
}
