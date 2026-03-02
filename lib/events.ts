/**
 * Sistema de eventos para sincronização de dados entre componentes
 */

type EventCallback = () => void;

class EventEmitter {
  private events: Map<string, Set<EventCallback>> = new Map();

  on(event: string, callback: EventCallback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(callback);
  }

  off(event: string, callback: EventCallback) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  emit(event: string) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback());
    }
  }
}

export const eventBus = new EventEmitter();

// Eventos disponíveis
export const EVENTS = {
  VEHICLES_UPDATED: "vehicles:updated",
  SETTINGS_UPDATED: "settings:updated",
} as const;
