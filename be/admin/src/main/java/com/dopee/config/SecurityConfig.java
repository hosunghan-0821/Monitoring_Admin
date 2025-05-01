package com.dopee.config;

import com.dopee.security.UserLoginFilter;
import com.dopee.security.UserLoginProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.savedrequest.NullRequestCache;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CorsConfigurationSource corsConfig;

    @Bean
    public HttpSessionEventPublisher httpSessionEventPublisher() {
        return new HttpSessionEventPublisher();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http, UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) throws Exception {
        return new ProviderManager(List.of(new UserLoginProvider(userDetailsService, passwordEncoder)));
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, AuthenticationManager authenticationManager, AuthenticationEntryPoint loginAuthenticationEntryPoint, HttpSessionSecurityContextRepository securityContextRepository) throws Exception {

        http.csrf(AbstractHttpConfigurer::disable);
        http.formLogin(AbstractHttpConfigurer::disable);
        http.httpBasic(AbstractHttpConfigurer::disable);

        http.cors(cors -> cors.configurationSource(corsConfig));
        http
                .authorizeHttpRequests((authorize) -> authorize
                        .requestMatchers("/api/session/check").permitAll() // sessions 확인용
                        .anyRequest().authenticated()
                );

        //Rest API 형식이라 Redirect를 하기 위해 default로 저장해둘 필요가 없음
        http.requestCache(rc ->
                rc.requestCache(new NullRequestCache())
        );

        http.addFilterAt(new UserLoginFilter(authenticationManager, securityContextRepository), UsernamePasswordAuthenticationFilter.class);
        http.sessionManagement(
                session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                        .maximumSessions(1)                      // 계정당 최대 1세션
                        .maxSessionsPreventsLogin(false)         // true: 새 로그인 차단 / false: 기존 세션 만료
                        .sessionRegistry(sessionRegistry())      // 세션 레지스트리 빈 등록
        );
        http.exceptionHandling(ex -> ex
                .authenticationEntryPoint(loginAuthenticationEntryPoint)
        );

        return http.build();

    }

    //“어느 Principal(사용자)이, 어떤 세션 ID들을 가지고 있는가” 를 추적·관리용
    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }

    //해당 Bean은 인증이 성공됬을 경우 인증정보를 HttpSession에 저장하는 역할
    @Bean
    public HttpSessionSecurityContextRepository securityContextRepository() {
        HttpSessionSecurityContextRepository repository = new HttpSessionSecurityContextRepository();
        repository.setAllowSessionCreation(false);
        repository.setSpringSecurityContextKey(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY);
        return repository;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
