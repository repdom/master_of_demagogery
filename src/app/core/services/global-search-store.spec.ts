import { TestBed } from '@angular/core/testing';
import { GlobalSearchStore } from './global-search-store';

describe('GlobalSearchStore', () => {
  let store: GlobalSearchStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(GlobalSearchStore);
  });

  it('should return no groups while the query is empty', () => {
    expect(store.groups()).toEqual([]);
    expect(store.totalHits()).toBe(0);
  });

  it('should match fallacies from the first characters', () => {
    store.query.set('straw');

    const fallacies = store.groups().find((group) => group.title === 'Falacias');

    expect(fallacies?.hits.length).toBeGreaterThan(0);
    expect(fallacies?.hits[0].hint).toContain('TheoremType.');
  });

  it('should match outlets by domain', () => {
    store.query.set('elpais.com');

    const outlets = store.groups().find((group) => group.title === 'Medios');

    expect(outlets?.hits.length).toBe(1);
    expect(outlets?.hits[0].label).toBe('El País');
  });

  it('should keep recent searches unique and capped', () => {
    for (const term of ['a', 'b', 'c', 'd', 'e', 'f', 'a']) {
      store.remember(term);
    }

    expect(store.recent().length).toBe(5);
    expect(store.recent()[0]).toBe('a');
  });
});
