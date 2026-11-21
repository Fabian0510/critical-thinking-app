import { useEffect, useRef, useState } from 'react';
import { isScored, type Confidence, type Item } from '../../types/content';
import type {
  GridResponse,
  ItemResponse,
  McResponse,
  NumericResponse,
  PairedResponse,
  RankResponse,
  ReflectionResponse,
  SliderResponse,
  TagResponse,
} from '../../types/progress';
import { scoreItem, type ItemScore } from '../../scoring/scoreItem';
import { Paragraphs, Rich } from '../Rich';
import { ConfidencePicker } from './ConfidencePicker';
import { EvidenceSlider, SliderFeedback, sliderComplete } from './EvidenceSlider';
import { mcComplete, MultipleChoice } from './MultipleChoice';
import { NumericEstimate, NumericFeedback, numericComplete } from './NumericEstimate';
import { PairedRating, pairedComplete } from './PairedRating';
import { RankList, rankComplete } from './RankList';
import { Reflection, ReflectionFeedback, reflectionComplete } from './Reflection';
import { TagSpans, tagComplete } from './TagSpans';
import { GridFeedback, gridComplete, ValiditySoundnessGrid } from './ValiditySoundnessGrid';

export interface ItemCardProps {
  item: Item;
  /** e.g. "Question 3 of 8" */
  position?: string;
  /** If the item was already answered (e.g. resuming after a reload), show it submitted. */
  initial?: { response: ItemResponse; confidence?: Confidence };
  onSubmit: (response: ItemResponse, result: ItemScore, confidence?: Confidence) => void;
  /** Called when a submitted reflection's self-check changes. */
  onUpdate?: (response: ItemResponse) => void;
  onNext: () => void;
  nextLabel?: string;
  /** Hold back feedback (used for paired-framing items during a test). */
  deferFeedback?: boolean;
}

function isComplete(item: Item, v: ItemResponse | undefined): boolean {
  switch (item.type) {
    case 'mc':
      return mcComplete(item, v as McResponse);
    case 'tag':
      return tagComplete(item, v as TagResponse);
    case 'rank':
      return rankComplete(item, v as RankResponse);
    case 'grid':
      return gridComplete(item, v as GridResponse);
    case 'numeric':
      return numericComplete(item, v as NumericResponse);
    case 'slider':
      return sliderComplete(item, v as SliderResponse);
    case 'paired':
      return pairedComplete(item, v as PairedResponse);
    case 'reflection':
      return reflectionComplete(item, v as ReflectionResponse);
  }
}

function Input({ item, value, onChange, submitted }: { item: Item; value: ItemResponse | undefined; onChange: (v: ItemResponse) => void; submitted: boolean }) {
  const common = { onChange, submitted };
  switch (item.type) {
    case 'mc':
      return <MultipleChoice item={item} value={value as McResponse | undefined} {...common} />;
    case 'tag':
      return <TagSpans item={item} value={value as TagResponse | undefined} {...common} />;
    case 'rank':
      return <RankList item={item} value={value as RankResponse | undefined} {...common} />;
    case 'grid':
      return <ValiditySoundnessGrid item={item} value={value as GridResponse | undefined} {...common} />;
    case 'numeric':
      return <NumericEstimate item={item} value={value as NumericResponse | undefined} {...common} />;
    case 'slider':
      return <EvidenceSlider item={item} value={value as SliderResponse | undefined} {...common} />;
    case 'paired':
      return <PairedRating item={item} value={value as PairedResponse | undefined} {...common} />;
    case 'reflection':
      return <Reflection item={item} value={value as ReflectionResponse | undefined} {...common} />;
  }
}

function headline(item: Item, r: ItemScore): { cls: string; text: string } {
  if (item.type === 'reflection') return { cls: 'feedback', text: 'Saved. Compare your answer with the examples below.' };
  if (item.type === 'paired') return { cls: 'feedback', text: 'Rating saved.' };
  if (r.score === 1) return { cls: 'feedback feedback--correct', text: '✓ Right.' };
  if (r.score === 0) return { cls: 'feedback feedback--incorrect', text: '✗ Not right.' };
  const pct = Math.round((r.score ?? 0) * 100);
  return r.correct
    ? { cls: 'feedback feedback--partial', text: `◐ Mostly right (${pct}% credit) — counted as right.` }
    : { cls: 'feedback feedback--partial', text: `◐ Partly right (${pct}% credit) — counted as not right.` };
}

function Details({ item, value, onUpdate }: { item: Item; value: ItemResponse; onUpdate: (v: ItemResponse) => void }) {
  switch (item.type) {
    case 'mc':
      return <p>The explanations are shown under the answers above, including why the wrong ones are tempting.</p>;
    case 'tag':
      return <p>Each part is explained above.</p>;
    case 'rank':
      return <Paragraphs text={item.rationale} />;
    case 'grid':
      return <GridFeedback item={item} value={value as GridResponse} />;
    case 'numeric':
      return <NumericFeedback item={item} value={value as NumericResponse} />;
    case 'slider':
      return <SliderFeedback item={item} value={value as SliderResponse} />;
    case 'reflection':
      return <ReflectionFeedback item={item} value={value as ReflectionResponse} onChange={onUpdate} />;
    case 'paired':
      return null;
  }
}

export function ItemCard({ item, position, initial, onSubmit, onUpdate, onNext, nextLabel = 'Next', deferFeedback }: ItemCardProps) {
  const [value, setValue] = useState<ItemResponse | undefined>(initial?.response);
  const [confidence, setConfidence] = useState<Confidence | undefined>(initial?.confidence);
  const [submitted, setSubmitted] = useState(!!initial);
  const feedbackRef = useRef<HTMLHeadingElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const scored = isScored(item);
  const complete = isComplete(item, value);
  const ready = complete && (!scored || confidence !== undefined);
  const result = submitted && value ? scoreItem(item, value) : null;

  useEffect(() => {
    if (submitted && !initial) feedbackRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  function submit() {
    if (!ready || !value) return;
    setSubmitted(true);
    onSubmit(value, scoreItem(item, value), scored ? confidence : undefined);
  }

  const missing = !complete ? 'Answer the question' : scored && confidence === undefined ? 'Choose how sure you are' : '';

  return (
    <article className="item" aria-labelledby={`h-${item.id}`}>
      {position && <div className="eyebrow">{position}</div>}
      {item.scenario && (
        <div className="scenario">
          <div className="scenario__label">{item.scenario.label}</div>
          {item.scenario.title && <h3>{item.scenario.title}</h3>}
          <Paragraphs text={item.scenario.body} />
        </div>
      )}
      <h2 id={`h-${item.id}`} ref={headingRef} className="item__prompt" tabIndex={-1}>
        <Rich text={item.prompt} />
      </h2>

      <Input item={item} value={value} onChange={setValue} submitted={submitted} />

      {!submitted && (
        <div className="item__footer stack">
          {scored && <ConfidencePicker name={`conf-${item.id}`} value={confidence} onChange={setConfidence} />}
          <div className="row">
            <button type="button" className="btn" onClick={submit} aria-disabled={!ready} disabled={!ready}>
              Submit answer
            </button>
            {missing && (
              <span className="muted" style={{ fontSize: '0.9rem' }}>
                {missing} to submit.
              </span>
            )}
          </div>
        </div>
      )}

      {submitted && result && value && (
        <section className={deferFeedback ? 'feedback' : headline(item, result).cls} aria-live="polite">
          <h3 ref={feedbackRef} tabIndex={-1}>
            {deferFeedback ? 'Rating saved. You’ll get feedback on this one at the end of the test.' : headline(item, result).text}
          </h3>
          {scored && confidence !== undefined && (
            <p className="muted" style={{ fontSize: '0.95rem' }}>
              You said you were {Math.round(confidence * 100)}% sure.
            </p>
          )}
          {!deferFeedback && (
            <Details
              item={item}
              value={value}
              onUpdate={(v) => {
                setValue(v);
                onUpdate?.(v);
              }}
            />
          )}
          <div className="row" style={{ marginTop: 12 }}>
            <button type="button" className="btn" onClick={onNext}>
              {nextLabel}
            </button>
          </div>
        </section>
      )}
    </article>
  );
}
