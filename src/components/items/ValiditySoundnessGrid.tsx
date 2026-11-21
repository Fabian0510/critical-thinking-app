import type { GridItem } from '../../types/content';
import type { GridResponse } from '../../types/progress';
import { Rich } from '../Rich';
import { cellOf, ValidityGrid2x2 } from '../visuals/ValidityGrid2x2';
import type { FeedbackProps, InputProps } from './types';

export function ValiditySoundnessGrid({ item, value, onChange, submitted }: InputProps<GridItem, GridResponse>) {
  return (
    <div>
      <div className="scenario">
        <div className="scenario__label">The argument</div>
        <ol style={{ margin: '0 0 8px', paddingLeft: 22 }}>
          {item.premises.map((p, i) => (
            <li key={i}>
              <span className="sr-only">Premise: </span>
              <Rich text={p} />
            </li>
          ))}
        </ol>
        <p style={{ margin: 0 }}>
          <strong>So: </strong>
          <Rich text={item.conclusion} />
        </p>
      </div>
      <ValidityGrid2x2
        name={`grid-${item.id}`}
        selected={value ? cellOf(value.valid, value.premisesTrue) : undefined}
        correct={submitted ? cellOf(item.answer.valid, item.answer.premisesTrue) : undefined}
        disabled={submitted}
        onSelect={submitted ? undefined : (valid, premisesTrue) => onChange({ valid, premisesTrue })}
      />
    </div>
  );
}

export function GridFeedback({ item, value }: FeedbackProps<GridItem, GridResponse>) {
  const mine = cellOf(value.valid, value.premisesTrue);
  const right = cellOf(item.answer.valid, item.answer.premisesTrue);
  return (
    <>
      <p>
        <Rich text={item.cells[right]} />
      </p>
      {mine !== right && (
        <p>
          <strong>About your choice: </strong>
          <Rich text={item.cells[mine]} />
        </p>
      )}
    </>
  );
}

export const gridComplete = (_: GridItem, v?: GridResponse) => !!v;
