package com.dopee.security;

import com.dopee.security.dto.LoginRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;

public class UserLoginFilter extends UsernamePasswordAuthenticationFilter {

    public UserLoginFilter(AuthenticationManager authManager) {
        setAuthenticationManager(authManager);
        // 기본 URL 대신 JSON 로그인 엔드포인트를 지정하려면
        setFilterProcessesUrl("/api/auth/login");
    }

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

        LoginRequest loginRequest;
        try (InputStream is = request.getInputStream()) {
            loginRequest = objectMapper.readValue(is, LoginRequest.class);
        } catch (IOException e) {
            throw new AuthenticationServiceException("Invalid login request", e);
        }

        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword(),
                        Collections.emptyList()
                );
        return this.getAuthenticationManager().authenticate(authToken);
    }

}
