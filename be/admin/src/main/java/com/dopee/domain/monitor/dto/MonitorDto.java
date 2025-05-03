package com.dopee.domain.monitor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import module.database.entity.Monitor;

/**
 * Data Transfer Object for Monitor entity
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonitorDto {
    private Long id;
    private String name;
    private Integer interval;


    /**
     * Entity -> DTO 변환 메서드
     */
    public static MonitorDto fromEntity(Monitor monitor) {
        return new MonitorDto(
                monitor.getId(),
                monitor.getName(),
                monitor.getInterval()
        );
    }
}
