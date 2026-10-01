import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DIFFICULTY_LABEL, type Difficulty } from '../../core/models';

/** 1-3 star challenge difficulty indicator. */
@Component({
  selector: 'app-difficulty-stars',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (withLabel()) {
      <span class="mod-label">{{ text() }}</span>
    }
    <span class="stars" role="img" [attr.aria-label]="text()">
      @for (star of stars(); track $index) {
        <span class="star" [class.star_on]="star" aria-hidden="true">★</span>
      }
    </span>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .stars {
      display: inline-flex;
      gap: 1px;
      font-size: 12px;
      line-height: 1;
    }

    .star {
      color: var(--mod-surface-highest);
    }

    .star_on {
      color: var(--mod-yellow);
    }
  `,
})
export class DifficultyStars {
  readonly level = input.required<Difficulty>();
  readonly withLabel = input(false);

  protected readonly stars = computed(() => [1, 2, 3].map((index) => index <= this.level()));
  protected readonly text = computed(
    () => `${DIFFICULTY_LABEL[this.level()]} (nivel ${this.level()})`,
  );
}
