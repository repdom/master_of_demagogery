import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Crumb {
  readonly label: string;
  readonly link?: string;
}

/**
 * Persistent context header: breadcrumb trail + editorial title + action slot.
 * Used at the top of every backoffice section.
 */
@Component({
  selector: 'app-page-header',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="crumbs mod-label" aria-label="Ruta de navegación">
      <ol>
        @for (crumb of crumbs(); track crumb.label; let last = $last) {
          <li>
            @if (crumb.link && !last) {
              <a [routerLink]="crumb.link">{{ crumb.label }}</a>
            } @else {
              <span [attr.aria-current]="last ? 'page' : null" [class.crumbs__current]="last">
                {{ crumb.label }}
              </span>
            }
            @if (!last) {
              <span class="crumbs__sep" aria-hidden="true">/</span>
            }
          </li>
        }
      </ol>
      <ng-content select="[headerStatus]" />
    </nav>

    <div class="head">
      <div class="head__text">
        <h1 class="mod-headline-lg">{{ heading() }}</h1>
        @if (subtitle()) {
          <p class="head__subtitle mod-body-sm mod-muted">{{ subtitle() }}</p>
        }
      </div>
      <div class="head__actions">
        <ng-content select="[headerActions]" />
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      padding: var(--mod-space-compact) var(--mod-margin) var(--mod-space-tight);
      border-bottom: 1px solid var(--mod-outline-variant);
      background: var(--mod-surface);
    }

    .crumbs {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--mod-space-compact);
      flex-wrap: wrap;
    }

    .crumbs ol {
      display: flex;
      align-items: center;
      gap: var(--mod-space-tight);
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .crumbs li {
      display: flex;
      align-items: center;
      gap: var(--mod-space-tight);
    }

    .crumbs a {
      color: inherit;
      text-decoration: none;
    }

    .crumbs a:hover {
      color: var(--mod-on-surface);
      text-decoration: underline;
    }

    .crumbs__sep {
      color: var(--mod-outline-variant);
    }

    .crumbs__current {
      color: var(--mod-gold);
      font-weight: 600;
    }

    .head {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: var(--mod-space-standard);
      flex-wrap: wrap;
      margin-block-start: var(--mod-space-base);
    }

    .head__text {
      min-inline-size: 18rem;
      flex: 1 1 24rem;
    }

    .head__subtitle {
      margin: var(--mod-space-base) 0 0;
      max-inline-size: 62ch;
    }

    .head__actions {
      display: flex;
      align-items: center;
      gap: var(--mod-space-tight);
      flex-wrap: wrap;
      padding-block-end: var(--mod-space-base);
    }
  `,
})
export class PageHeader {
  readonly crumbs = input.required<readonly Crumb[]>();
  readonly heading = input.required<string>();
  readonly subtitle = input<string>('');
}
