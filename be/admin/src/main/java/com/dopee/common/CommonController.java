package com.dopee.common;


import com.dopee.common.dto.SignupDto;
import com.dopee.security.SessionListener;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class CommonController {

    private final SessionRegistry sessionRegistry;
    private final UserService userService;

    //유효한 세션인지 체크하는 API
    @GetMapping("/auth/session")
    private ResponseEntity<?> validSession(HttpServletRequest request) {

        HttpSession session = request.getSession(false);

        if (session != null) {
            SessionInformation sessionInformation = sessionRegistry.getSessionInformation(session.getId());
            if (sessionInformation != null && !sessionInformation.isExpired()) {
                return ResponseEntity.ok(null);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    /*
    * 새로운 Admin 계정 발급
    * 로그인 권한 있는 사람은 누구나 가능
    * */
    @PostMapping("/auth/signup")
    private ResponseEntity<Boolean> signUp(@RequestBody SignupDto signupDto){

        userService.registerAdmin(signupDto);
        return ResponseEntity.ok(true);
    }

    //TODO Session 확인용 API 제거 필요
    @GetMapping("/session/check")
    private ResponseEntity<?> check() {

        Map<String, HttpSession> sessions = SessionListener.getSessions();
        Map<String, Object> sessionData = new HashMap<>();
        Map<String, Object> info = new HashMap<>();

        for (Map.Entry<String, HttpSession> entry : sessions.entrySet()) {
            String sessionId = entry.getKey();
            HttpSession session = entry.getValue();
            Object principal = session.getAttribute("SPRING_SECURITY_CONTEXT");
            sessionData.put(sessionId, principal);

            long lastAccessed = session.getLastAccessedTime();          // 마지막 접근 시각 (ms)
            int maxInactive = session.getMaxInactiveInterval();       // 타임아웃 설정 (초)
            long now = System.currentTimeMillis();

            long elapsedSec = (now - lastAccessed) / 1000;             // 마지막 접근부터 경과된 시간
            long remaining = maxInactive - elapsedSec;               // 남은 시간(초)

            Map<String, Object> eachData = Map.of(
                    "principal", principal != null ? principal : "null value",
                    "sessionId", session.getId(),
                    "lastAccessedTime", Instant.ofEpochMilli(lastAccessed).toString(),
                    "maxInactiveInterval", maxInactive,
                    "elapsedSeconds", elapsedSec,
                    "remainingSeconds", Math.max(0, remaining)
            );

            info.put(sessionId, eachData);
        }
        return ResponseEntity.ok(info);
    }
}
