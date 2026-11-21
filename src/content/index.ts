/**
 * Content registry. To add a level's content, import it here and add it to `LEVEL_CONTENT`.
 */
import type { Item, LessonScreen, LevelContent, LevelId } from '../types/content';
import { level1 } from './level1';
import { level2 } from './level2';
import { level3 } from './level3';
import { level4 } from './level4';
import { level5 } from './level5';
import { placementItems } from './placement';

export const LEVEL_CONTENT: Partial<Record<LevelId, LevelContent>> = {
  1: level1,
  2: level2,
  3: level3,
  4: level4,
  5: level5,
};

export const allLevels = (): LevelContent[] => Object.values(LEVEL_CONTENT) as LevelContent[];

export const getLevel = (l: LevelId): LevelContent | undefined => LEVEL_CONTENT[l];

/** Placement check items: two per level, not part of any test bank. */
export const PLACEMENT_ITEMS: Item[] = placementItems;

export function allScreens(): LessonScreen[] {
  return allLevels().flatMap((l) => l.screens);
}

/** Every item in the app: lesson checks, practice, bank and placement. */
export function allItems(): Item[] {
  return [
    ...allLevels().flatMap((l) => [...l.screens.map((s) => s.check), ...l.practice, ...l.bank]),
    ...PLACEMENT_ITEMS,
  ];
}

let index: Map<string, Item> | undefined;
export function getItem(id: string): Item | undefined {
  index ??= new Map(allItems().map((i) => [i.id, i]));
  return index.get(id);
}

export function findScreen(id: string): { level: LevelId; screen: LessonScreen; index: number } | undefined {
  for (const l of allLevels()) {
    const i = l.screens.findIndex((s) => s.id === id);
    if (i >= 0) return { level: l.level, screen: l.screens[i], index: i };
  }
  return undefined;
}
