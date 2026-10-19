package com.example.islab1.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EntityChangePublisher {

    private final ApplicationEventPublisher publisher;

    public void publish(Integer id, ChangeType changeType) {
        publisher.publishEvent(new EntityChangedEvent(id, changeType));
    }
}