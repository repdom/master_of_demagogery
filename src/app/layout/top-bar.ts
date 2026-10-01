import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { WorkstationStore } from '../core/services';
import { GlobalSearch } from './global-search';

/** Workstation command bar: identity, omni-search, API health and session. */
@Component({
  selector: 'app-top-bar',
  imports: [GlobalSearch, TuiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="identity">
      <span class="identity__name">DEMAGOGIA</span>
      <span class="mod-tag mod-tag_gold">BACKOFFICE V2.4</span>
    </div>

    <app-global-search />

    <div class="status">
      <span class="status__api mod-mono">
        <span class="status__dot" [style.background]="apiColor()" aria-hidden="true"></span>
        PROD API {{ workstation.apiStatus() }}
      </span>

      <button type="button" class="icon-btn" [attr.aria-label]="notificationsLabel()">
        <tui-icon icon="@tui.bell" />
        @if (workstation.notifications()) {
          <span class="icon-btn__badge mod-mono">{{ workstation.notifications() }}</span>
        }
      </button>

      <div class="user">
        <span class="user__text">
          <strong>{{ workstation.session().name }}</strong>
          <span class="mod-mono">{{ workstation.session().role }}</span>
        </span>
        <span class="user__avatar" aria-hidden="true">{{ workstation.session().initials }}</span>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--mod-space-standard);
      block-size: var(--mod-topbar-height);
      padding-inline: var(--mod-space-compact);
      background: var(--mod-surface-low);
      border-block-end: 1px solid var(--mod-outline-variant);
      position: sticky;
      inset-block-start: 0;
      z-index: 30;
    }

    .identity {
      display: flex;
      align-items: center;
      gap: var(--mod-space-tight);
    }

    .identity__name {
      font-size: 12.5px;
      font-weight: 700;
      letter-spacing: 0.1em;
    }

    .status {
      display: flex;
      align-items: center;
      gap: var(--mod-space-compact);
    }

    .status__api {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 8px;
      background: var(--mod-surface-container);
      border-radius: var(--mod-radius);
      font-size: 10.5px;
    }

    .status__dot {
      inline-size: 6px;
      block-size: 6px;
      border-radius: 50%;
    }

    .icon-btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 28px;
      block-size: 28px;
      border: 0;
      background: transparent;
      color: var(--mod-on-surface-variant);
      cursor: pointer;
    }

    .icon-btn:hover {
      color: var(--mod-on-surface);
    }

    .icon-btn__badge {
      position: absolute;
      inset-block-start: 1px;
      inset-inline-end: 0;
      min-inline-size: 13px;
      padding: 0 3px;
      border-radius: 7px;
      background: var(--mod-red);
      color: #fff;
      font-size: 9px;
      line-height: 13px;
      text-align: center;
    }

    .user {
      display: flex;
      align-items: center;
      gap: var(--mod-space-tight);
      padding-inline-start: var(--mod-space-compact);
      border-inline-start: 1px solid var(--mod-outline-variant);
    }

    .user__text {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      line-height: 1.2;
    }

    .user__text strong {
      font-size: 12px;
    }

    .user__text .mod-mono {
      font-size: 9.5px;
      color: var(--mod-on-surface-variant);
    }

    .user__avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 26px;
      block-size: 26px;
      border-radius: 50%;
      background: var(--mod-surface-highest);
      color: var(--mod-gold);
      font-family: var(--mod-font-mono);
      font-size: 10.5px;
    }

    @media (max-width: 720px) {
      .user__text,
      .status__api {
        display: none;
      }
    }
  `,
})
export class TopBar {
  protected readonly workstation = inject(WorkstationStore);

  protected apiColor(): string {
    switch (this.workstation.apiStatus()) {
      case 'OK':
        return 'var(--mod-green)';
      case 'DEGRADED':
        return 'var(--mod-yellow)';
      default:
        return 'var(--mod-red)';
    }
  }

  protected notificationsLabel(): string {
    return `Notificaciones (${this.workstation.notifications()} sin leer)`;
  }
}
