import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BiasSpectrumBar } from './bias-spectrum-bar';
import type { PoliticalBias } from '../../core/models';

@Component({
  imports: [BiasSpectrumBar],
  template: `<app-bias-spectrum-bar [bias]="bias()" />`,
})
class Host {
  readonly bias = signal<PoliticalBias>('CENTER_LEFT');
}

describe('BiasSpectrumBar', () => {
  it('should render the six spectrum segments and highlight the active one', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    const segments = element.querySelectorAll('.bar__seg');

    expect(segments.length).toBe(6);
    expect(element.querySelectorAll('.bar__seg_active').length).toBe(1);
    expect(segments[1].classList.contains('bar__seg_active')).toBe(true);
  });

  it('should expose the lean to assistive technology', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    const bar = (fixture.nativeElement as HTMLElement).querySelector('.bar');

    expect(bar?.getAttribute('aria-label')).toBe('Sesgo político: Centro-Izquierda');
  });
});
