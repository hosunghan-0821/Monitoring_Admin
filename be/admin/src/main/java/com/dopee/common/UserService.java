package com.dopee.common;

import com.dopee.common.dto.SignupDto;
import lombok.RequiredArgsConstructor;
import module.database.entity.User;
import module.database.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void registerAdmin(SignupDto signupDto) {
        //validate
        validate(signupDto);

        Optional<User> username = userRepository.findByUsername(signupDto.getUsername());
        if (username.isEmpty()) {
            User registerUser = User.builder()
                    .username(signupDto.getUsername())
                    .password(passwordEncoder.encode(signupDto.getPassword()))
                    .build();
            userRepository.save(registerUser);
        } else {
            throw new RuntimeException("이미 존재한 user ID");
        }

    }

    private void validate(SignupDto dto) {
        if (!StringUtils.hasText(dto.getUsername())) {
            throw new IllegalArgumentException("username은 필수 입력값입니다.");
        }
        if (!StringUtils.hasText(dto.getPassword())) {
            throw new IllegalArgumentException("password은 필수 입력값입니다.");
        }
    }
}
