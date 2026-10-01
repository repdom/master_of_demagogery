import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';
import { WorkstationStore } from '../core/services';
import { NAV_SECTIONS } from './nav.config';

/** Fixed taxonomy rail — always visible on desktop, collapsible on narrow screens. */
@Component({
  selector: 'app-sidebar-nav',
  imports: [RouterLink, RouterLinkActive, TuiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="brand" routerLink="/desk">
      <span class="brand__mark" aria-hidden="true">◈</span>
      <span class="brand__text">
        <strong>DEMAGOGIA</strong>
        <span class="mod-mono">PRENSA LAB V2.4</span>
      </span>
    </a>

    <nav class="nav" aria-label="Secciones del backoffice">
      @for (section of sections; track section.title) {
        <p class="nav__title mod-label">{{ section.title }}</p>
        <ul>
          @for (item of section.items; track item.link) {
            <li>
              <a
                class="nav__link"
                [routerLink]="item.link"
                routerLinkActive="nav__link_active"
                #active="routerLinkActive"
                [attr.aria-current]="active.isActive ? 'page' : null"
              >
                <tui-icon [icon]="item.icon" />
                <span>{{ item.label }}</span>
              </a>
            </li>
          }
        </ul>
      }
    </nav>

    <p class="node mod-mono">
      <span class="node__dot" aria-hidden="true"></span>
      {{ workstation.node() }}
      <span class="mod-tag">{{ workstation.latency() }}</span>
    </p>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      inline-size: var(--mod-sidebar-width);
      flex: none;
      background: var(--mod-surface-lowest);
      border-inline-end: 1px solid var(--mod-outline-variant);
      block-size: 100dvh;
      position: sticky;
      inset-block-start: 0;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: var(--mod-space-tight);
      padding: var(--mod-space-compact);
      border-bottom: 1px solid var(--mod-outline-variant);
      color: inherit;
      text-decoration: none;
    }

    .brand__mark {
      color: var(--mod-gold);
      font-size: 18px;
    }

    .brand__text {
      display: flex;
      flex-direction: column;
      line-height: 1.15;
    }

    .brand__text strong {
      font-size: 13px;
      letter-spacing: 0.08em;
    }

    .brand__text .mod-mono {
      font-size: 9.5px;
      color: var(--mod-gold);
      letter-spacing: 0.12em;
    }

    .nav {
      flex: 1;
      overflow-y: auto;
      padding-block: var(--mod-space-compact);
    }

    .nav__title {
      margin: var(--mod-space-compact) 0 var(--mod-space-base);
      padding-inline: var(--mod-space-compact);
      font-size: 9.5px;
      color: var(--mod-outline);
    }

    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav__link {
      display: flex;
      align-items: center;
      gap: var(--mod-space-tight);
      min-block-size: 32px;
      padding-inline: var(--mod-space-compact);
      color: var(--mod-on-surface-variant);
      text-decoration: none;
      font-size: 13px;
      border-inline-start: 2px solid transparent;
    }

    .nav__link tui-icon {
      font-size: 1rem;
    }

    .nav__link:hover {
      background: var(--mod-surface-low);
      color: var(--mod-on-surface);
    }

    .nav__link_active {
      background: var(--mod-primary-container);
      border-inline-start-color: var(--mod-gold);
      color: var(--mod-on-surface);
      font-weight: 600;
    }

    .node {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 0;
      padding: var(--mod-space-tight) var(--mod-space-compact);
      border-block-start: 1px solid var(--mod-outline-variant);
      color: var(--mod-on-surface-variant);
      font-size: 9.5px;
    }

    .node__dot {
      inline-size: 6px;
      block-size: 6px;
      border-radius: 50%;
      background: var(--mod-green);
    }

    @media (max-width: 900px) {
      :host {
        position: static;
        inline-size: 100%;
        block-size: auto;
        border-inline-end: 0;
        border-block-end: 1px solid var(--mod-outline-variant);
      }

      .nav {
        display: flex;
        flex-wrap: wrap;
        gap: var(--mod-space-base);
      }

      .nav__title {
        inline-size: 100%;
      }

      ul {
        display: flex;
        flex-wrap: wrap;
      }
    }
  `,
})
export class SidebarNav {
  protected readonly sections = NAV_SECTIONS;
  protected readonly workstation = inject(WorkstationStore);
}
