export interface NavItem {
  readonly label: string;
  readonly link: string;
  readonly icon: string;
}

export interface NavSection {
  readonly title: string;
  readonly items: readonly NavItem[];
}

/** Two-group workstation navigation, mirroring the editorial org chart. */
export const NAV_SECTIONS: readonly NavSection[] = [
  {
    title: 'Editorial Workstation',
    items: [
      { label: 'Article Desk', link: '/desk', icon: '@tui.newspaper' },
      { label: 'Bias Spectrum Matrix', link: '/matrix', icon: '@tui.chart-scatter' },
      { label: 'Fact-Checking Queue', link: '/queue', icon: '@tui.target' },
      { label: 'Media Sources Ledger', link: '/sources', icon: '@tui.library' },
      { label: 'Taxonomy & Tags', link: '/taxonomy', icon: '@tui.tags' },
    ],
  },
  {
    title: 'Quality & Intelligence',
    items: [
      { label: 'Credibility Shields', link: '/shields', icon: '@tui.shield' },
      { label: 'Editorial Logs', link: '/logs', icon: '@tui.history' },
      { label: 'Engine Settings', link: '/settings', icon: '@tui.sliders-horizontal' },
    ],
  },
];
