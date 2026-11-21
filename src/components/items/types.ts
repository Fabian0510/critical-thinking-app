import type { Item } from '../../types/content';
import type { ItemResponse } from '../../types/progress';

export interface InputProps<I extends Item, R extends ItemResponse> {
  item: I;
  value: R | undefined;
  onChange: (v: R) => void;
  /** After submission inputs are locked and annotated with right/wrong. */
  submitted: boolean;
}

export interface FeedbackProps<I extends Item, R extends ItemResponse> {
  item: I;
  value: R;
}
