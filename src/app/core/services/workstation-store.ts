import { Injectable, signal } from '@angular/core';

export interface EditorSession {
  readonly name: string;
  readonly role: string;
  readonly initials: string;
}

/** Ambient workstation state: signed-in editor, node health, API status. */
@Injectable({ providedIn: 'root' })
export class WorkstationStore {
  readonly session = signal<EditorSession>({
    name: 'E. Ibarra',
    role: 'Editor-in-Chief / Admin',
    initials: 'EI',
  });

  readonly node = signal('NODE EU-CENTRAL-1');
  readonly latency = signal('IDLE 0.08 ms');
  readonly apiStatus = signal<'OK' | 'DEGRADED' | 'DOWN'>('OK');
  readonly schemaVersion = signal('SCHEMA v2.4.9-REL');
  readonly notifications = signal(3);
}
