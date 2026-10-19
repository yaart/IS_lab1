package com.example.islab1.websocket;

public record EntityChangedEvent(Integer id, ChangeType changeType) {}