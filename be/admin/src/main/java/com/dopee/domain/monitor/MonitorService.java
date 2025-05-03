package com.dopee.domain.monitor;


import com.dopee.domain.monitor.dto.MonitorDto;
import lombok.RequiredArgsConstructor;
import module.database.entity.Monitor;
import module.database.repository.MonitorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@RequiredArgsConstructor
public class MonitorService {

    private final MonitorRepository monitorRepository;

    @Transactional(readOnly = true)
    public List<MonitorDto> getAllMonitors() {
        List<Monitor> allMonitor = monitorRepository.getAllMonitor();
        return allMonitor.stream().map(MonitorDto::fromEntity).toList();
    }

    @Transactional
    public boolean updateInterval(Long id, MonitorDto monitorDto) {
        Monitor monitor = monitorRepository.findById(id).orElseThrow(() -> new RuntimeException("해당하는 ID가 없습니다."));
        monitor.update(monitorDto.getInterval());
        return true;
    }
}
