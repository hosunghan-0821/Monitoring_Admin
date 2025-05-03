package com.dopee.domain.monitor;

import com.dopee.domain.monitor.dto.MonitorDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    /**
     * 모니터 주기를 변경합니다.
     *
     * @return boolean
     */

    @PutMapping("/{id}")
    public ResponseEntity<Boolean> updateInterval(@PathVariable(value = "id") Long id, @RequestBody MonitorDto monitorDto) {
        return ResponseEntity.ok(monitorService.updateInterval(id, monitorDto));

    }
}
