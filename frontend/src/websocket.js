import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let client = null;
let listeners = [];

export function connect(onConnected) {
  client = new Client({
    webSocketFactory: () => new SockJS(`/ws`),
    reconnectDelay: 5000,
    onConnect: () => {
      client.subscribe('/topic/entities', () => {
        listeners.forEach(fn => fn());
      });
      if (onConnected) onConnected(true);
    },
    onDisconnect: () => { if (onConnected) onConnected(false); },
  });
  client.activate();
}

export function onChange(fn) {
  listeners.push(fn);
  return () => { listeners = listeners.filter(f => f !== fn); };
}
