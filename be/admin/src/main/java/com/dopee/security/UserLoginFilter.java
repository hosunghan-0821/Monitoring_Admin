package com.dopee.security;

import com.dopee.security.dto.LoginRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;

import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;

public class UserLoginFilter extends UsernamePasswordAuthenticationFilter {

    private final HttpSessionSecurityContextRepository securityContextRepository;

    private final SessionRegistry sessionRegistry;

    public UserLoginFilter(AuthenticationManager authManager, HttpSessionSecurityContextRepository securityContextRepository, SessionRegistry sessionRegistry) {
        setAuthenticationManager(authManager);
        setFilterProcessesUrl("/api/auth/login");
        this.securityContextRepository = securityContextRepository;
        this.sessionRegistry = sessionRegistry;
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

    @Override
    protected void successfulAuthentication(HttpServletRequest req, HttpServletResponse res, FilterChain chain, Authentication authResult) throws IOException {

        //세션 생성
        HttpSession session = req.getSession();
        if (session != null) {
            session.setMaxInactiveInterval(60);
            sessionRegistry.registerNewSession(session.getId(), authResult.getPrincipal());
        }

        // 인증된 SecurityContext 를 SessionRepository 와 요청과 응답에 저장
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authResult);
        securityContextRepository.saveContext(context, req, res);


        res.setStatus(HttpStatus.OK.value());
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest req, HttpServletResponse res, AuthenticationException failed) throws IOException {
        res.sendError(HttpStatus.UNAUTHORIZED.value(), "Authentication Failed");
    }

}
