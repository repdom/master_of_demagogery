import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';
import { GlobalSearchStore } from '../core/services';

/** Always-available omni-search: results render from the first keystroke, no Enter needed. */
@Component({
  selector: 'app-global-search',
  imports: [RouterLink, TuiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.control.k)': 'capture($event)',
    '(document:keydown.meta.k)': 'capture($event)',
    '(document:keydown.escape)': 'close()',
    '(focusout)': 'onFocusOut($event)',
  },
  template: `
    <div class="field" role="combobox" aria-haspopup="listbox" [attr.aria-expanded]="focused()">
      <tui-icon icon="@tui.search" />
      <input
        #input
        type="search"
        class="field__input"
        placeholder="Quick search corpus…"
        aria-label="Buscar en todo el corpus"
        [value]="store.query()"
        (input)="onInput($event)"
        (focus)="focused.set(true)"
      />
      <kbd class="field__kbd mod-mono">⌘K</kbd>
    </div>

    @if (focused()) {
      <div class="results" role="listbox" aria-label="Resultados de búsqueda">
        @if (store.query()) {
          @for (group of store.groups(); track group.title) {
            @if (group.hits.length) {
              <p class="results__group mod-label">{{ group.title }} ({{ group.hits.length }})</p>
              @for (hit of group.hits; track hit.id) {
                <a
                  class="hit"
                  role="option"
                  [attr.aria-selected]="false"
                  [routerLink]="hit.link"
                  [queryParams]="hit.queryParams"
                  (click)="select()"
                >
                  <span class="hit__label">{{ hit.label }}</span>
                  <span class="hit__hint mod-mono">{{ hit.hint }}</span>
                </a>
              }
            }
          }
          @if (!store.totalHits()) {
            <p class="results__empty mod-body-sm mod-muted">
              Sin coincidencias para «{{ store.query() }}».
            </p>
          }
        } @else {
          <p class="results__group mod-label">Búsquedas recientes</p>
          @for (term of store.recent(); track term) {
            <button type="button" class="hit hit_button" (click)="replay(term)">
              <span class="hit__label">{{ term }}</span>
              <tui-icon icon="@tui.history" />
            </button>
          }
        }
      </div>
    }
  `,
  styles: `
    :host {
      position: relative;
      display: block;
      inline-size: min(420px, 38vw);
    }

    .field {
      display: flex;
      align-items: center;
      gap: var(--mod-space-tight);
      block-size: 28px;
      padding-inline: var(--mod-space-tight);
      background: var(--mod-surface-container);
      border: 1px solid var(--mod-outline-variant);
      border-radius: var(--mod-radius);
    }

    .field:focus-within {
      border-color: var(--mod-gold);
    }

    .field tui-icon {
      font-size: 0.875rem;
      color: var(--mod-on-surface-variant);
    }

    .field__input {
      flex: 1;
      min-inline-size: 0;
      border: 0;
      background: transparent;
      color: var(--mod-on-surface);
      font: inherit;
      font-size: 12.5px;
      outline: none;
    }

    .field__input::placeholder {
      color: var(--mod-outline);
    }

    .field__kbd {
      color: var(--mod-outline);
      font-size: 10px;
    }

    .results {
      position: absolute;
      inset-inline: 0;
      inset-block-start: calc(100% + 4px);
      z-index: 40;
      max-block-size: 60vh;
      overflow-y: auto;
      padding-block: var(--mod-space-base);
      background: var(--mod-surface-lowest);
      border: 1px solid var(--mod-outline-variant);
      border-radius: var(--mod-radius);
      box-shadow: 0 12px 24px rgb(0 0 0 / 45%);
    }

    .results__group {
      margin: var(--mod-space-tight) 0 2px;
      padding-inline: var(--mod-space-compact);
      color: var(--mod-gold);
    }

    .results__empty {
      margin: 0;
      padding: var(--mod-space-compact);
    }

    .hit {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--mod-space-tight);
      inline-size: 100%;
      min-block-size: 30px;
      padding-inline: var(--mod-space-compact);
      border: 0;
      background: transparent;
      color: var(--mod-on-surface);
      font: inherit;
      font-size: 12.5px;
      text-align: start;
      text-decoration: none;
      cursor: pointer;
    }

    .hit:hover {
      background: var(--mod-surface-container);
    }

    .hit__label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .hit__hint {
      color: var(--mod-on-surface-variant);
      flex: none;
    }
  `,
})
export class GlobalSearch {
  protected readonly store = inject(GlobalSearchStore);
  protected readonly focused = signal(false);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');

  protected onInput(event: Event): void {
    this.store.query.set((event.target as HTMLInputElement).value);
  }

  protected select(): void {
    this.store.remember(this.store.query());
    this.close();
  }

  protected replay(term: string): void {
    this.store.query.set(term);
    this.input().nativeElement.focus();
  }

  protected capture(event: Event): void {
    event.preventDefault();
    this.input().nativeElement.focus();
    this.focused.set(true);
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget;

    if (!(next instanceof Node) || !this.host.nativeElement.contains(next)) {
      this.close();
    }
  }

  protected close(): void {
    this.focused.set(false);
  }
}
