import { computed, Injectable, signal } from '@angular/core';
import { DOM_ANNOTATION_TARGETS, QUEUE_ITEMS } from '../data';
import type { QueueItem, QueueStage, WebFallacyTarget } from '../models';

/** Editorial pipeline: articles waiting for DOM annotation and dual review. */
@Injectable({ providedIn: 'root' })
export class FactCheckQueueStore {
  private readonly source = signal<readonly QueueItem[]>(QUEUE_ITEMS);
  private readonly targets = signal<readonly WebFallacyTarget[]>(DOM_ANNOTATION_TARGETS);

  readonly items = this.source.asReadonly();
  readonly annotations = this.targets.asReadonly();
  readonly total = computed(() => this.source().length);

  readonly countByStage = computed<Readonly<Record<QueueStage, number>>>(() => {
    const counters: Record<QueueStage, number> = {
      TRIAGE: 0,
      ANNOTATING_DOM: 0,
      VALIDATING_METADATA: 0,
      DUAL_REVIEW: 0,
      READY: 0,
      REJECTED: 0,
    };

    for (const item of this.source()) {
      counters[item.stage] += 1;
    }

    return counters;
  });

  readonly criticalCount = computed(
    () => this.source().filter((item) => item.priority === 'URGENT').length,
  );

  byId(id: string): QueueItem | undefined {
    return this.source().find((item) => item.id === id);
  }

  patch(id: string, patch: Partial<QueueItem>): void {
    this.source.update((items) =>
      items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  toggleChecklist(itemId: string, checkId: string): void {
    this.source.update((items) =>
      items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              checklist: item.checklist.map((check) =>
                check.id === checkId ? { ...check, done: !check.done } : check,
              ),
            }
          : item,
      ),
    );
  }

  addAnnotation(target: WebFallacyTarget): void {
    this.targets.update((items) => [target, ...items]);
  }

  removeAnnotation(id: string): void {
    this.targets.update((items) => items.filter((item) => item.id !== id));
  }

  patchAnnotation(id: string, patch: Partial<WebFallacyTarget>): void {
    this.targets.update((items) =>
      items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }
}
