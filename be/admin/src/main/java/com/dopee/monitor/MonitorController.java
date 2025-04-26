package com.dopee.monitor;

import com.dopee.monitor.dto.MonitorDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/monitors")
public class MonitorController {
    private final MonitorService monitorService;


    /**
     * 모든 모니터 리스트를 조회합니다.
     *
     * @return 모니터 DTO 목록
     */
    @GetMapping
    public List<MonitorDto> getAllMonitors() {
        return monitorService.getAllMonitors();
    }

}
