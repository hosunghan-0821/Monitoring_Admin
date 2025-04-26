package com.dopee.monitor;


import com.dopee.monitor.dto.MonitorDto;
import lombok.RequiredArgsConstructor;
import module.database.entity.Monitor;
import module.database.repository.MonitorRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class MonitorService {

    private final MonitorRepository monitorRepository;

    public List<MonitorDto> getAllMonitors() {
        List<Monitor> allMonitor = monitorRepository.getAllMonitor();
        return allMonitor.stream().map(MonitorDto::fromEntity).toList();
    }
}
